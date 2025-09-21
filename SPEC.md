## Project Specification: Image Measurement Tool

**Project Goal:** To provide a web-based tool for users to upload an image, calibrate it using a known distance, and then accurately measure distances between arbitrary points on the image.

---

### 1. User Stories

**Core Functionality:**

*   **AS A user, I want to upload an image** so that I can begin analyzing it.
*   **AS A user, I want to pan and zoom the uploaded image** so that I can inspect specific areas in detail.
*   **AS A user, I want to select two points on the image representing a known distance (e.g., a ruler)** so that the application can calibrate measurements.
*   **AS A user, I want to enter the actual distance between the two calibration points** so that the application can calculate the pixel-to-unit ratio.
*   **AS A user, I want to add multiple measurement points on the image** so that I can define the start and end of distances I want to measure.
*   **AS A user, I want measurement points to automatically pair** (2nd with 1st, 4th with 3rd, etc.) so that the application can calculate and display distances without manual line creation.
*   **AS A user, I want to see the calculated distance displayed next to the line connecting two measurement points** so that I can easily read the results.
*   **AS A user, I want to be able to move existing measurement points (both calibration and measurement)** so that I can refine my selections.
*   **AS A user, I want to delete specific measurement points or lines** so that I can correct errors or remove unnecessary data.
*   **AS A user, I want to select the unit of measurement (e.g., mm, cm, inches)** so that my measurements are in a familiar and appropriate scale.

**Enhancements (Phase 2/Future):**

*   **AS A user, I want to undo/redo actions** so that I can easily recover from mistakes.
*   **AS A user, I want to export my measurements (e.g., CSV, JSON)** so that I can use the data in other applications.
*   **AS A user, I want to adjust the brightness/contrast of the image** so that I can see features more clearly.

---

### 2. Features

**2.1 Image Handling:**

*   **Image Upload:**
    *   Drag-and-drop support for image files (JPEG, PNG).
    *   Standard file input button.
    *   Client-side image loading (no server upload required initially).
*   **Image Display:**
    *   Dynamic canvas or SVG for rendering the image and overlays.
    *   Responsive resizing to fit browser window.
*   **Pan & Zoom:**
    *   Mouse wheel or pinch gesture for zooming in/out.
    *   Click-and-drag for panning the image.
    *   "Fit to Screen" button/option. This functionality is always available when an image is loaded, regardless of the active "tool" (Calibrate/Measure).
    *   Pan functionality is available in all modes (Calibrate, Measure, and Pan) for improved usability.

**2.2 Calibration Tool:**

*   **Calibration Mode Activation:** Dedicated button (e.g., "Calibrate").
*   **Point Selection:**
    *   Click on the image to place the first calibration point.
    *   Click again to place the second calibration point.
    *   Visual representation of points and connecting line.
*   **Point Adjustment:** Calibration points can be clicked and dragged to reposition them after initial placement.
*   **Distance Input:**
    *   Text field to enter the actual known distance between the two selected calibration points.
    *   Dropdown for selecting units (mm, cm, inches).
*   **Calibration Calculation:**
    *   Calculates pixels-per-unit ratio based on user input.

**2.3 Measurement Tool:**

*   **Measurement Mode Activation:** Dedicated button (e.g., "Measure").
*   **Point Placement:**
    *   Click on the image to add a new measurement point.
    *   Points are incrementally numbered (e.g., M1, M2) or clearly distinguishable.
*   **Automatic Line Creation:**
    *   Lines are automatically created between measurement points using an auto-pairing system.
    *   When an even number of measurement points exist, a line connects the last two points placed.
    *   Pairing pattern: M2↔M1, M4↔M3, M6↔M5, etc.
    *   **Workflow Example:** Place M1 → Place M2 (line auto-creates M1↔M2) → Place M3 → Place M4 (line auto-creates M3↔M4)
*   **Line Drawing:**
    *   Automatically draws lines between paired measurement points.
*   **Distance Display:**
    *   Displays the calculated distance for each defined line segment, using the calibrated ratio and selected units.
    *   Text labels positioned near their respective lines.
*   **Point Manipulation:**
    *   Click-and-drag to reposition existing measurement points.
    *   Context menu or dedicated button to delete a selected point or line.

**2.4 User Interface Controls:**

*   **Units Selector:** Global dropdown for measurement units (mm, cm, inches) affecting all measurements.
*   **Clear All:** Button to remove all calibration and measurement points/lines.
*   **Tool Selection:** Clearly visible buttons or a toolbar for switching between interaction modes (e.g., "Calibrate," "Measure"). Lines are created automatically, so no separate "Define Lines" tool is needed. Pan/Zoom is inherently available.

---

### 3. Design (UI/UX)

**3.1 Layout:**

*   **Main Canvas Area (Left/Center):** Dominant space for the image display, pan/zoom, and point overlays.
*   **Sidebar/Control Panel (Right):**
    *   Image upload controls.
    *   Tool selection buttons (Calibrate, Measure).
    *   Calibration input fields (for actual distance and units).
    *   A section displaying a list of current measurements with their values (optional, but useful for complex projects).
    *   Global unit selector.
    *   Action buttons (Clear All).

**3.2 Visual Cues & Interaction:**

*   **Point Representation:**
    *   The best form for a point (both calibration and measurement) is an **empty circle with distinct crosshairs inside**.
    *   Calibration points: E.g., red empty circle with red crosshairs.
    *   Measurement points: E.g., blue empty circle with blue crosshairs.
    *   Hover effect on points (e.g., change color, glow, or thicker outline) to indicate interactivity.
    *   Points should have unique identifiers (e.g., C1, C2 for calibration; M1, M2 for measurement) displayed near them.
*   **Line Representation:**
    *   Calibration line: Distinct color (e.g., dashed red line).
    *   Measurement lines: Distinct color (e.g., solid blue line).
    *   Distance text clearly legible and positioned near the line it corresponds to.
*   **Active Tool Indication:** The currently active tool (Calibrate, Measure) should be visually highlighted (e.g., button change color, icon change). Pan/Zoom is assumed to be an always-on interaction.
*   **Feedback Messages:** Small, non-intrusive messages for user actions (e.g., "Image uploaded successfully," "Please place two calibration points").
*   **Cursor Changes:** Cursor should change to indicate current mode (e.g., crosshair for adding points, grab hand for panning, default pointer for dragging existing points).

#### 3.5 Branding

*   **Favicon:** Include a custom SVG favicon representing measurement (crosshair + ruler).

**3.3 Responsiveness:**

*   The layout should adapt gracefully to different screen sizes, prioritizing the image display area.
*   Controls in the sidebar might stack or become a top bar on smaller screens.
*   **Good user experience on a phone screen (mobile-first approach) is a must**, ensuring touch gestures for pan/zoom and point placement/adjustment are intuitive and responsive.

**3.4 Technology Stack (Recommendations):**

*   **Frontend Framework:** React
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Image Drawing, Pan & Zoom Library:** For robust image manipulation, interactive drawing of points and lines, and handling pan/zoom on a canvas: **React Konva** (a React wrapper for the Konva.js canvas library) or **Fabric.js** are excellent choices. They provide granular control over shapes, events, and performance for interactive graphics.

#### 3.6 PWA & Installability

- **Plugin**: Use `vite-plugin-pwa` to inject the Web App Manifest and auto-register the Service Worker.
- **Icons**: Generate Android/Maskable and Apple touch icons from `public/favicon.svg` during build via the integrated assets generation.
- **Manifest**: App name `Photo Measure`, short name `PhotoMeasure`, `display: standalone`, theme color `#0ea5e9`.
- **Index**: Keep only the favicon link in `index.html`; the plugin injects the manifest and registration.