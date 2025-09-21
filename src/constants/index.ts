// Application constants

export const MEASUREMENT_UNITS = {
  mm: 'mm',
  cm: 'cm',
  inches: 'inches'
} as const;

export const TOOL_MODES = {
  calibrate: 'calibrate',
  measure: 'measure',
  pan: 'pan'
} as const;

export const POINT_TYPES = {
  calibration: 'calibration',
  measurement: 'measurement'
} as const;

export const LINE_TYPES = {
  calibration: 'calibration',
  measurement: 'measurement'
} as const;

// Visual constants
export const POINT_RADIUS = 12;
export const POINT_STROKE_WIDTH = 2;
export const LINE_STROKE_WIDTH = 2;
export const CROSSHAIR_SIZE = 24;

// Colors
export const COLORS = {
  calibration: {
    point: '#ef4444', // red-500
    line: '#ef4444',
    pointHover: '#dc2626', // red-600
  },
  measurement: {
    point: '#3b82f6', // blue-500
    line: '#3b82f6',
    pointHover: '#2563eb', // blue-600
  },
  background: '#f8fafc', // slate-50
  text: '#1e293b', // slate-800
} as const;

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
] as const;

// Default values
export const DEFAULT_ZOOM = 1;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 10;
export const ZOOM_STEP = 0.1;

export const DEFAULT_UNIT = 'cm' as const;
