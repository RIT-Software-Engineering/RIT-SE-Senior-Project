import React from "react";

export default function ProfileCircle(props) {
  const {
    user,
    name,
    isStudent = true,
    size = "small",
    style = {},
    className = "",
    bgImage = null,
    showFullName = false,
    pill = false,
    pillColor = "var(--bg-primary)",
    textUnderlined = false,
    clickable = false,
  } = props;

  // Auto-detect coach role if name contains "Coach" and isStudent wasn't explicitly set to false
  const actualIsStudent =
    isStudent && !(name && name.toLowerCase().includes("coach"));

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

  function generateInitials(user, name) {
    // If user object with fname and lname is available, use those
    if (user?.fname && user?.lname) {
      return (
        user.fname.charAt(0).toUpperCase() + user.lname.charAt(0).toUpperCase()
      );
    }

    // If only name string is available, handle it consistently
    if (name) {
      const nameParts = name.split(" ").filter((part) => part.length > 0);
      if (nameParts.length === 1) {
        // Single name - take first two characters or just first if only one char
        return nameParts[0].substring(0, 2).toUpperCase();
      } else if (nameParts.length >= 2) {
        // Multiple names - take first letter of first name and first letter of last name
        return (
          nameParts[0].charAt(0).toUpperCase() +
          nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        );
      }
    }

    return "NA";
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
        cursor: clickable ? "pointer" : "default",
        marginRight: "5px",
        ...style,
      }}
    >
      <div
        className={`profile-circle ${className}`}
        style={{
          width: sizes[size]?.width || sizes["small"].width,
          height: sizes[size]?.height || sizes["small"].height,
          minWidth: sizes[size]?.width || sizes["small"].width,
          minHeight: sizes[size]?.height || sizes["small"].height,
          borderRadius: "50%",
          backgroundColor:
            actualIsStudent && !["admin", "coach"].includes(user?.role)
              ? randColorFromName(user?.fname || name.split(" ")[0] || "User")
              : "var(--bg-secondary)",
          border:
            !actualIsStudent || ["admin", "coach"].includes(user?.role)
              ? `2px solid ${randColorFromName(user?.fname || name.split(" ")[0] || "User")}`
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
          <div
            style={{
              color:
                !actualIsStudent || ["admin", "coach"].includes(user?.role)
                  ? "var(--text-primary)"
                  : "black",
              fontWeight: "bold",
              fontStyle: "normal",
            }}
          >
            {generateInitials(user, name)}
          </div>
        )}
      </div>
      {showFullName && (
        <span
          style={{
            marginLeft: "5px",
            fontStyle: "normal",
            textDecoration: textUnderlined ? "underline" : "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "120px",
            display: "inline-block",
          }}
        >
          {name || (user ? `${user.fname} ${user.lname}` : "User")}
        </span>
      )}
    </div>
  );
}
