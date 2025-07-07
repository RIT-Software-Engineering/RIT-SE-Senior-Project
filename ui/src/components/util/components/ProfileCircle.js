import React from "react";

export default function ProfileCircle(props) {
  const {
    user,
    size = "small",
    style = {},
    className = "",
    bgImage = null,
  } = props;

  const sizes = {
    tiny: {
      width: "20px",
      height: "20px",
      fontSize: "10px",
    },
    small: {
      width: "40px",
      height: "40px",
      fontSize: "14px",
    },
    medium: {
      width: "50px",
      height: "50px",
      fontSize: "20px",
    },
    large: {
      width: "60px",
      height: "60px",
      fontSize: "25px",
    },
    huge: {
      width: "80px",
      height: "80px",
      fontSize: "30px",
    },
  };

  function randColorFromName(name) {
    const hash = Array.from(name).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  return (
    <div
      className={`profile-circle ${className}`}
      style={{
        width: sizes[size]?.width || sizes["small"].width,
        height: sizes[size]?.height || sizes["small"].height,
        borderRadius: "50%",
        backgroundColor: randColorFromName(user?.fname || "User"),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: sizes[size]?.fontSize || sizes["small"].fontSize,
        ...style,
      }}
    >
      {bgImage ? (
        <img
          src={bgImage}
          alt="Profile Background"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <>
          {user?.fname?.charAt(0).toUpperCase()}
          {user?.lname?.charAt(0).toUpperCase()}
        </>
      )}
    </div>
  );
}
