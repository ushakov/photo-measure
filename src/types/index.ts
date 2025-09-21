// Core type definitions for the image measurement tool

// Point representation
export interface Point {
  id: string;
  x: number;  // Canvas coordinates
  y: number;  // Canvas coordinates
  type: 'calibration' | 'measurement';
  label: string; // e.g., "C1", "M1"
}

// Line representation
export interface Line {
  id: string;
  startPointId: string;
  endPointId: string;
  type: 'calibration' | 'measurement';
  distance?: number; // Calculated distance in selected units
}

// Calibration data
export interface Calibration {
  points: [Point, Point] | null;
  line: Line | null;
  actualDistance: number | null;
  pixelsPerUnit: number | null;
}

// Image data
export interface ImageData {
  file: File | null;
  url: string | null;
  dimensions: { width: number; height: number } | null;
  scale: number; // Zoom level
  offset: { x: number; y: number }; // Pan offset
}

// Application state
export interface AppState {
  image: ImageData;
  calibration: Calibration;
  points: Point[];
  lines: Line[];
  selectedUnit: MeasurementUnit;
  activeMode: 'calibrate' | 'measure' | 'pan';
  selectedPoints: string[]; // For creating measurement lines
}

// Measurement units
export type MeasurementUnit = 'mm' | 'cm' | 'inches';

// Action types for reducer
export type AppAction =
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
