# Development Plan: Image Measurement Tool

## Project Overview

This plan outlines the development of a web-based image measurement tool built with React, TypeScript, and Vite. The application allows users to upload images, calibrate measurements using known distances, and measure arbitrary distances between points.

---

## Technology Stack

- **Frontend Framework:** React 19.1.1
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 7.1.6
- **Styling:** Tailwind CSS (to be added)
- **Canvas Library:** React Konva (recommended for interactive graphics)
- **State Management:** React Context + useReducer (for complex state)
- **File Handling:** HTML5 File API

---

## Code Organization

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   ├── ImageCanvas/     # Canvas-related components
│   ├── Sidebar/         # Control panel components
│   └── common/          # Shared components
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── contexts/            # React contexts for state management
├── constants/           # Application constants
└── styles/              # Global styles and Tailwind config
```

### Component Architecture

```
App
├── ImageCanvas
│   ├── CanvasContainer
│   ├── ImageLayer
│   ├── PointLayer
│   ├── LineLayer
│   └── OverlayLayer
├── Sidebar
│   ├── ImageUpload
│   ├── ToolSelector
│   ├── CalibrationPanel
│   ├── MeasurementPanel
│   ├── UnitsSelector
│   └── ActionButtons
└── StatusBar
```

---

## Data Structures

### Core Types

```typescript
// Point representation
interface Point {
  id: string;
  x: number;  // Canvas coordinates
  y: number;  // Canvas coordinates
  type: 'calibration' | 'measurement';
  label: string; // e.g., "C1", "M1"
}

// Line representation
interface Line {
  id: string;
  startPointId: string;
  endPointId: string;
  type: 'calibration' | 'measurement';
  distance?: number; // Calculated distance in selected units
}

// Calibration data
interface Calibration {
  points: [Point, Point] | null;
  line: Line | null;
  actualDistance: number | null;
  pixelsPerUnit: number | null;
}

// Image data
interface ImageData {
  file: File | null;
  url: string | null;
  dimensions: { width: number; height: number } | null;
  scale: number; // Zoom level
  offset: { x: number; y: number }; // Pan offset
}

// Application state
interface AppState {
  image: ImageData;
  calibration: Calibration;
  points: Point[];
  lines: Line[];
  selectedUnit: MeasurementUnit;
  activeMode: 'calibrate' | 'measure' | 'pan';
  selectedPoints: string[]; // For creating measurement lines
}

// Measurement units
type MeasurementUnit = 'mm' | 'cm' | 'inches';

// Action types for reducer
type AppAction =
  | { type: 'SET_IMAGE'; payload: { file: File; url: string; dimensions: { width: number; height: number } } }
  | { type: 'SET_MODE'; payload: 'calibrate' | 'measure' | 'pan' }
  | { type: 'ADD_POINT'; payload: Point }
  | { type: 'UPDATE_POINT'; payload: { id: string; x: number; y: number } }
  | { type: 'DELETE_POINT'; payload: string }
  | { type: 'ADD_LINE'; payload: Line }
  | { type: 'DELETE_LINE'; payload: string }
  | { type: 'SET_CALIBRATION_DISTANCE'; payload: number }
  | { type: 'SET_UNIT'; payload: MeasurementUnit }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_PAN'; payload: { x: number; y: number } };
```

### State Management Strategy

- **Main App State:** React Context + useReducer for global state
- **Canvas State:** Local state for canvas-specific interactions (hover, drag)
- **UI State:** Local state for form inputs and temporary UI states

---

## Development Phases

### Phase 1: Foundation & Basic UI (Week 1)

**Goal:** Set up the basic application structure and image upload functionality.

#### Tasks:
- [x] **T001: Project Setup**
  - [x] Install dependencies: Tailwind CSS, React Konva
  - [x] Configure Tailwind CSS
  - [x] Set up project structure

- [x] **T002: Basic Layout**
  - [x] Create main app layout (canvas area + sidebar)
  - [x] Implement responsive design foundation
  - [x] Add basic UI components (buttons, inputs, dropdowns)

- [x] **T003: Image Upload**
  - [x] Implement drag-and-drop image upload
  - [x] Add file input fallback
  - [x] Display uploaded image on canvas
  - [x] Handle image loading and error states

- [x] **T004: Basic Canvas Setup**
  - [x] Set up React Konva stage
  - [x] Implement basic image rendering
  - [x] Add pan and zoom functionality
  - [x] Add "Fit to Screen" functionality

#### Deliverables:
- Functional image upload with drag-and-drop
- Basic canvas with pan/zoom capabilities
- Responsive layout structure
- Image display with proper scaling

### Phase 2: Calibration System (Week 2)

**Goal:** Implement the calibration tool for setting measurement scale.

#### Tasks:
- [ ] **T005: Calibration Mode**
  - [ ] Add tool selection (Calibrate/Measure modes)
  - [ ] Implement calibration point placement (2 points max)
  - [ ] Visual representation of calibration points and line

- [ ] **T006: Point Interaction**
  - [ ] Click-and-drag functionality for calibration points
  - [ ] Hover effects and visual feedback
  - [ ] Point deletion/replacement capability

- [ ] **T007: Calibration Input**
  - [ ] Distance input field
  - [ ] Units selector (mm, cm, inches)
  - [ ] Real-time calculation of pixels-per-unit ratio

- [ ] **T008: Visual Design**
  - [ ] Implement point design (empty circle with crosshairs)
  - [ ] Calibration line styling (dashed red line)
  - [ ] Point labels (C1, C2)

#### Deliverables:
- Working calibration tool with 2-point placement
- Draggable calibration points
- Distance input and unit conversion
- Pixels-per-unit calculation system

### Phase 3: Measurement System (Week 3)

**Goal:** Implement the measurement tool for arbitrary distance measurements.

#### Tasks:
- [ ] **T009: Measurement Mode**
  - [ ] Switch to measurement mode
  - [ ] Multiple measurement point placement
  - [ ] Point numbering system (M1, M2, M3, etc.)

- [ ] **T010: Line Creation**
  - [ ] Point selection system for creating measurement lines
  - [ ] Multiple measurement lines support
  - [ ] Line management (creation/deletion)

- [ ] **T011: Distance Calculation**
  - [ ] Real-time distance calculation using calibration
  - [ ] Display distance labels on measurement lines
  - [ ] Unit conversion for measurements

- [ ] **T012: Point Management**
  - [ ] Drag functionality for measurement points
  - [ ] Point and line deletion
  - [ ] Visual feedback for selections

#### Deliverables:
- Multiple measurement point placement
- Measurement line creation between any two points
- Real-time distance calculations
- Interactive point manipulation

### Phase 4: Enhanced UI/UX (Week 4)

**Goal:** Polish the user interface and improve user experience.

#### Tasks:
- [ ] **T013: Visual Polish**
  - [ ] Refine point and line styling
  - [ ] Improve hover and selection states
  - [ ] Better cursor feedback
  - [ ] Enhanced visual hierarchy

- [ ] **T014: User Feedback**
  - [ ] Status messages and notifications
  - [ ] Loading states
  - [ ] Error handling and validation
  - [ ] Help tooltips

- [ ] **T015: Mobile Optimization**
  - [ ] Touch gesture support
  - [ ] Mobile-responsive sidebar
  - [ ] Touch-friendly point manipulation
  - [ ] Responsive canvas interactions

- [ ] **T016: Advanced Features**
  - [ ] Measurement list in sidebar
  - [ ] Clear all functionality
  - [ ] Better tool state management
  - [ ] Keyboard shortcuts

#### Deliverables:
- Polished, professional UI
- Mobile-responsive design
- Comprehensive user feedback
- Enhanced accessibility

### Phase 5: Testing & Optimization (Week 5)

**Goal:** Ensure reliability, performance, and cross-browser compatibility.

#### Tasks:
- [ ] **T017: Testing**
  - [ ] Unit tests for utility functions
  - [ ] Integration tests for core workflows
  - [ ] Cross-browser testing
  - [ ] Mobile device testing

- [ ] **T018: Performance Optimization**
  - [ ] Canvas rendering optimization
  - [ ] Image loading optimization
  - [ ] Memory management for large images
  - [ ] Debounced user interactions

- [ ] **T019: Error Handling**
  - [ ] Robust error boundaries
  - [ ] File format validation
  - [ ] Edge case handling
  - [ ] Graceful failure recovery

- [ ] **T020: Documentation**
  - [ ] Code documentation
  - [ ] User guide/help system
  - [ ] Deployment instructions

#### Deliverables:
- Thoroughly tested application
- Optimized performance
- Comprehensive error handling
- Complete documentation

---

## Key Implementation Details

### Canvas Coordinate System
- Use React Konva's coordinate system
- Implement conversion between canvas coordinates and image coordinates
- Handle scaling and panning transformations

### State Management Patterns
- Use reducer pattern for complex state updates
- Implement optimistic updates for smooth UX
- Separate concerns between UI state and measurement data

### Performance Considerations
- Lazy load canvas layers
- Debounce pan/zoom events
- Optimize re-renders with React.memo and useMemo
- Handle large images efficiently

### Mobile Touch Interactions
- Implement touch events for point manipulation
- Add pinch-to-zoom gestures
- Optimize touch targets for finger interaction
- Handle touch vs mouse event differences

---

## Future Enhancements (Phase 6+)

### Advanced Features
- Undo/redo functionality
- Export measurements (CSV, JSON)
- Image brightness/contrast adjustment
- Multiple calibration standards
- Angle measurements
- Area calculations

### Technical Improvements
- Web Workers for image processing
- Progressive Web App (PWA) features
- Cloud storage integration
- Real-time collaboration
- Advanced image formats support

---

## Dependencies to Add

```json
{
  "dependencies": {
    "konva": "^9.2.0",
    "react-konva": "^18.2.10"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## Success Metrics

- **Functionality:** All user stories from SPEC.md implemented
- **Performance:** Smooth interactions on 1920x1080 images
- **Compatibility:** Works on Chrome, Firefox, Safari, Edge
- **Mobile:** Fully functional on mobile devices
- **Accuracy:** Measurement accuracy within 0.1% of actual values
- **Usability:** Intuitive interface requiring minimal learning curve

This plan provides a structured approach to building the image measurement tool while maintaining code quality, user experience, and technical excellence.
