## Photo Measure — Image Measurement Tool

Interactive web app to measure distances on images. Upload an image, calibrate with a known distance, and place measurement points; distances are computed and displayed instantly.

See [https://photo-measure.pages.dev/](https://photo-measure.pages.dev/) for a live demo.

### Features
- **Image upload**: Drag-and-drop or file picker
- **Pan & zoom**: Smooth wheel zoom and drag-to-pan; Fit to Screen
- **Calibration**: Place two points (C1/C2), enter real distance, pick units (mm/cm/in)
- **Measurement**: Add multiple points; lines auto-pair (M2↔M1, M4↔M3, ...)
- **Live results**: Distances labeled on canvas and listed in the sidebar
- **Editing**: Drag points; Clear All resets everything
- **Mobile-friendly**: Touch gestures and mobile sidebar

### Tech Stack
- React 19, TypeScript 5.8, Vite 7
- Tailwind CSS 4
- Konva + React Konva for canvas interactions

### Quick Start
1. Install dependencies:
   - `npm install`
2. Run the dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
4. Preview the production build:
   - `npm run preview`

### How to Use
1. **Upload**: Use the Image Upload panel to select an image.
2. **Calibrate**:
   - Switch to Calibrate mode.
   - Click twice on the image to place two calibration points (C1, C2).
   - Enter the known distance and choose units; pixels-per-unit is computed.
3. **Measure**:
   - Switch to Measure mode.
   - Click to place measurement points (M1, M2, M3...). Points auto-pair: M2 with M1, M4 with M3, etc.
   - Distances appear on the canvas and in the sidebar list. If calibration is missing, items show "Calibration required".
4. **Adjust**: Drag any point to refine. Distances update in real time.
5. **Fit / Reset**: Use Fit to Screen to re-center/scale; Clear All removes points/lines.

### Controls
- **Zoom**: Mouse wheel (pinch on touch devices)
- **Pan**: Drag empty canvas area
- **Move point**: Drag a point
- **Modes**: Use the sidebar Tool Selector (Calibrate / Measure)
- **Units**: Sidebar Units selector (global)

### Project Structure
```
src/
├─ components/
│  ├─ ImageCanvas/   # CanvasContainer, ImageLayer, PointLayer, LineLayer, OverlayLayer
│  └─ Sidebar/       # ImageUpload, ToolSelector, CalibrationPanel, MeasurementPanel, UnitsSelector, ActionButtons
├─ contexts/         # AppContext (state, reducer, actions)
├─ types/            # Shared TS types
├─ utils/            # formatDistance, calculateRealDistance, helpers
└─ constants/
```

### Status & Roadmap
- Core calibration and measurement flows are implemented (see `PLAN.md`, Phase 2–3 complete).
- UI/UX polish is ongoing; user feedback and loading/error states are in progress.
- Future ideas: undo/redo, export, advanced image adjustments, PWA, collaboration.

### Troubleshooting
- Distances show "Calibration required": Place calibration points and enter the known distance.
- Nothing happens on click: Ensure an image is uploaded and the correct tool is active.
- Large images: Use Fit to Screen; pan/zoom to navigate.

### Contributing
Issues and PRs are welcome. Please keep changes focused and typed. Follow existing code style.

### License
No license specified yet.
