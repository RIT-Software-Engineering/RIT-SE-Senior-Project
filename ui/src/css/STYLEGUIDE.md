# CSS Styling & Organization Guide

Welcome to the CSS styling documentation. **This is essential reading for anyone contributing to the stylesheets of this project.**

Maintaining consistent, clean, and well-organized CSS is critical for scalability, maintainability, and collaboration. **All CSS contributions _must_ adhere to the structure and practices outlined below.** Please read carefully before making any changes.

Inline CSS is allowed, but reference variables.css whenever possible.

---

## 🔧 CSS Directory Structure & Responsibilities

Our CSS is separated by _functionality_, not by page or feature. This ensures a clean, modular, and scalable architecture.

### 1. `base/`

> Foundational styles and design tokens shared across all files.

- **`variables.css`**  
  Contains global CSS variables — colors, fonts, layout sizes, paddings, spacings, etc.  
  These are the _source of truth_ for style values used project-wide. Always reference variables instead of hardcoding values.

  _\*side note: one off values can be hardcoded, there are instances of this in some files._

---

### 2. `components/`

> Styles that directly affect the appearance of individual UI components visible to the user.

- **`proposal.css`** – Rows, status actions, and table cell (`td.attachments`) styling.
- **`gantt.css`** – Full Gantt chart styling: `.gantt`, `.sidebar`, `.gantt-col`, `.gantt-header`, etc.
- **`calendar.css`** – Calendar UI: day grid, date cells, headers, nav buttons, and interactivity.
- **`modal.css`** – Modal windows and shared Semantic UI elements (`.ui.modal`, `.ui.segment`, `.ui.button`, etc).
- **`announcement.css`** – Banner design, header formatting, and related layout.

---

### 3. `containers/`

> Styles for layout wrappers or parent elements that organize other components.

- **`accordion.css`** – Nested layout and spacing styles for accordion elements.
- **`header.css`** – Top nav bar layout, navigation buttons, and mobile-friendly adjustments.
- **`footer.css`** – Footer spacing, layout, version info, and general appearance.

---

### 4. `utils/`

> Reusable helper classes and global styling utilities.

- **`helpers.css`** – Utility classes like `.hidden`, `.spacer`, `.fake-a`, font overrides, etc.
- **`responsive.css`** – All media queries and screen size-based layout adjustments.  
  Responsive rules **must** live here for consistency.

---

## 🌙 Dark Mode

All dark mode styles must be placed **at the bottom of their respective CSS files**.  
This ensures:

- Readability: easy to find and update.
- Separation of concerns: light and dark themes live within the same file context.
- Maintainability: minimizes fragmentation across multiple stylesheets.

---

## ✅ Contribution Guidelines

- **Follow the folder structure.** Do not create new folders unless absolutely necessary and approved.
- **Use variables from `base/variables.css`** instead of hardcoding values.
- **Avoid duplication.** Check `utils/` for existing helper classes before creating new ones.
- **Dark mode goes last.** Always append dark styling to the bottom of the correct file.
- **Test responsiveness.** Use classes and media queries defined in `responsive.css` when needed.

---

Maintaining a well-structured CSS system is everyone's responsibility. Following this guide ensures we keep our UI consistent, readable, and easy to maintain over time.

Thanks for your attention and contributions!
