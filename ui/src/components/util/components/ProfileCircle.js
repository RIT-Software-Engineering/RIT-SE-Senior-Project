import React from "react";

export default function ProfileCircle(props) {
  const {
    user,
    size = "small",
    style = {},
    className = "",
    bgImage = null,
    showFullName = false,
    pill = false,
    pillColor = "var(--bg-primary)",
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
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: pill ? pillColor : "transparent",
        padding: pill ? "5px 5px" : "0",
        borderRadius: pill ? "20px" : "0",
        ...style,
      }}
    >
      <div
        className={`profile-circle ${className}`}
        style={{
          width: sizes[size]?.width || sizes["small"].width,
          height: sizes[size]?.height || sizes["small"].height,
          borderRadius: "50%",
          backgroundColor: !["admin", "coach"].includes(user?.role)
            ? randColorFromName(user?.fname || "User")
            : "var(--bg-secondary)",
          border: ["admin", "coach"].includes(user?.role)
            ? `2px solid ${randColorFromName(user?.fname || "User")}`
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: sizes[size]?.fontSize || sizes["small"].fontSize,
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
      {showFullName && (
        <span style={{ marginLeft: "8px" }}>
          {user?.fname} {user?.lname}
        </span>
      )}
    </div>
  );
}
