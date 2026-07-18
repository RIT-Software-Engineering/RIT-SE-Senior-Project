import React from "react";

import "./../../../css/utils/profile.css";

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
    const hue = (hash * 58) % 360;
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

  const highlightCircle =
    !actualIsStudent || ["admin", "coach"].includes(user?.role);

  return (
    <div
      className={`profile-wrapper${pill ? " profile-wrapper-pill" : ""}${
        clickable ? " profile-wrapper-clickable" : ""
      }`}
      style={{
        backgroundColor: pill ? pillColor : "transparent",
        ...style,
      }}
    >
      <div
        className={`profile-circle ${className}`}
        style={{
          "--profile-size": sizes[size]?.width || sizes["small"].width,
          "--profile-font-size":
            sizes[size]?.fontSize || sizes["small"].fontSize,
          backgroundColor:
            actualIsStudent && !["admin", "coach"].includes(user?.role)
              ? randColorFromName(user?.fname || name.split(" ")[0] || "User")
              : "var(--bg-secondary)",
          border: highlightCircle
            ? `2px solid ${randColorFromName(user?.fname || name.split(" ")[0] || "User")}`
            : "none",
        }}
      >
        {bgImage ? (
          <img src={bgImage} alt="Profile Background" className="profile-img" />
        ) : (
          <div
            className={`profile-initials${
              highlightCircle ? " profile-initials-highlighted" : ""
            }`}
          >
            {generateInitials(user, name)}
          </div>
        )}
      </div>
      {showFullName && (
        <span
          className={`profile-name${
            textUnderlined ? " profile-name-underlined" : ""
          }${size === "tiny" ? " profile-name-truncated" : ""}`}
        >
          {name || (user ? `${user.fname} ${user.lname}` : "User")}
        </span>
      )}
    </div>
  );
}
