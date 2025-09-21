import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppState, AppAction, Point, Line } from '../types';
import { generateId, generatePointLabel, calculatePixelDistance } from '../utils';
import { DEFAULT_UNIT, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from '../constants';

const initialState: AppState = {
  image: {
    file: null,
    url: null,
    dimensions: null,
    scale: DEFAULT_ZOOM,
    offset: { x: 0, y: 0 },
  },
  calibration: {
    points: null,
    line: null,
    actualDistance: null,
    pixelsPerUnit: null,
  },
  points: [],
  lines: [],
  selectedUnit: DEFAULT_UNIT,
  activeMode: 'pan',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_IMAGE':
      return {
        ...state,
        image: {
          ...state.image,
          file: action.payload.file,
          url: action.payload.url,
          dimensions: action.payload.dimensions,
          scale: DEFAULT_ZOOM,
          offset: { x: 0, y: 0 },
        },
      };

    case 'SET_MODE':
      return {
        ...state,
        activeMode: action.payload,
      };

    case 'ADD_POINT':
      const newState = {
        ...state,
        points: [...state.points, action.payload],
      };

      // Update calibration points if it's a calibration point
      if (action.payload.type === 'calibration') {
        const calibrationPoints = newState.points.filter(p => p.type === 'calibration');
        newState.calibration = {
          ...newState.calibration,
          points: calibrationPoints.slice(-2) as [Point, Point] | null, // Keep only last 2 points
        };

        // Auto-create calibration line when second point is added
        if (calibrationPoints.length === 2) {
          const line: Line = {
            id: generateId(),
            startPointId: calibrationPoints[0].id,
            endPointId: calibrationPoints[1].id,
            type: 'calibration',
          };
          newState.lines = [...newState.lines, line];
          newState.calibration.line = line;
        }
      }

      // Auto-create measurement lines for measurement points (pair 2nd to 1st, 4th to 3rd, etc.)
      if (action.payload.type === 'measurement') {
        const measurementPoints = newState.points.filter(p => p.type === 'measurement');

        // If we have an even number of measurement points, create a line
        if (measurementPoints.length % 2 === 0 && measurementPoints.length >= 2) {
          const lastTwoPoints = measurementPoints.slice(-2);
          const line: Line = {
            id: generateId(),
            startPointId: lastTwoPoints[0].id,
            endPointId: lastTwoPoints[1].id,
            type: 'measurement',
          };
          newState.lines = [...newState.lines, line];
        }
      }

      return newState;

    case 'UPDATE_POINT':
      const updatedPoints = state.points.map(point =>
        point.id === action.payload.id
          ? { ...point, x: action.payload.x, y: action.payload.y }
          : point
      );

      const updatedState = {
        ...state,
        points: updatedPoints,
      };

      // Update calibration points if a calibration point was updated
      const updatedPoint = updatedPoints.find(p => p.id === action.payload.id);
      if (updatedPoint?.type === 'calibration') {
        const calibrationPoints = updatedPoints.filter(p => p.type === 'calibration');
        updatedState.calibration = {
          ...updatedState.calibration,
          points: calibrationPoints.slice(-2) as [Point, Point] | null,
        };
      }

      return updatedState;

    case 'DELETE_POINT':
      const deletedPoint = state.points.find(p => p.id === action.payload);
      const filteredPoints = state.points.filter(point => point.id !== action.payload);
      const filteredLines = state.lines.filter(line =>
        line.startPointId !== action.payload && line.endPointId !== action.payload
      );

      const deleteState = {
        ...state,
        points: filteredPoints,
        lines: filteredLines,
      };

      // Update calibration points if a calibration point was deleted
      if (deletedPoint?.type === 'calibration') {
        const calibrationPoints = filteredPoints.filter(p => p.type === 'calibration');
        deleteState.calibration = {
          ...deleteState.calibration,
          points: calibrationPoints.length >= 2 ? calibrationPoints.slice(-2) as [Point, Point] : null,
          line: calibrationPoints.length < 2 ? null : deleteState.calibration.line,
          actualDistance: calibrationPoints.length < 2 ? null : deleteState.calibration.actualDistance,
          pixelsPerUnit: calibrationPoints.length < 2 ? null : deleteState.calibration.pixelsPerUnit,
        };
      }

      return deleteState;

    case 'ADD_LINE':
      const lineState = {
        ...state,
        lines: [...state.lines, action.payload],
      };

      // Update calibration line if it's a calibration line
      if (action.payload.type === 'calibration') {
        lineState.calibration = {
          ...lineState.calibration,
          line: action.payload,
        };
      }

      return lineState;

    case 'DELETE_LINE':
      const deletedLine = state.lines.find(l => l.id === action.payload);
      const deleteLineState = {
        ...state,
        lines: state.lines.filter(line => line.id !== action.payload),
      };

      // Update calibration line if a calibration line was deleted
      if (deletedLine?.type === 'calibration') {
        deleteLineState.calibration = {
          ...deleteLineState.calibration,
          line: null,
          actualDistance: null,
          pixelsPerUnit: null,
        };
      }

      return deleteLineState;

    case 'SET_CALIBRATION_DISTANCE':
      const calibrationPoints = state.calibration.points;
      if (calibrationPoints && calibrationPoints.length === 2) {
        const pixelDistance = calculatePixelDistance(calibrationPoints[0], calibrationPoints[1]);
        const pixelsPerUnit = pixelDistance / action.payload;

        return {
          ...state,
          calibration: {
            ...state.calibration,
            actualDistance: action.payload,
            pixelsPerUnit,
          },
        };
      }
      return state;

    case 'SET_UNIT':
      return {
        ...state,
        selectedUnit: action.payload,
      };


    case 'SET_ZOOM':
      return {
        ...state,
        image: {
          ...state.image,
          scale: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, action.payload)),
        },
      };

    case 'SET_PAN':
      return {
        ...state,
        image: {
          ...state.image,
          offset: action.payload,
        },
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        calibration: {
          points: null,
          line: null,
          actualDistance: null,
          pixelsPerUnit: null,
        },
        points: [],
        lines: [],
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addPoint: (x: number, y: number, type: 'calibration' | 'measurement') => void;
  updatePoint: (id: string, x: number, y: number) => void;
  deletePoint: (id: string) => void;
  addLine: (startPointId: string, endPointId: string, type: 'calibration' | 'measurement') => void;
  deleteLine: (id: string) => void;
  setCalibrationDistance: (distance: number) => void;
  setUnit: (unit: AppState['selectedUnit']) => void;
  setMode: (mode: AppState['activeMode']) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addPoint = useCallback((x: number, y: number, type: 'calibration' | 'measurement') => {
    const existingPoints = state.points.filter(p => p.type === type);
    const point: Point = {
      id: generateId(),
      x,
      y,
      type,
      label: generatePointLabel(type, existingPoints.length),
    };
    dispatch({ type: 'ADD_POINT', payload: point });
  }, [state.points]);

  const updatePoint = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: 'UPDATE_POINT', payload: { id, x, y } });
  }, []);

  const deletePoint = useCallback((id: string) => {
    dispatch({ type: 'DELETE_POINT', payload: id });
  }, []);

  const addLine = useCallback((startPointId: string, endPointId: string, type: 'calibration' | 'measurement') => {
    const line: Line = {
      id: generateId(),
      startPointId,
      endPointId,
      type,
    };
    dispatch({ type: 'ADD_LINE', payload: line });
  }, []);

  const deleteLine = useCallback((id: string) => {
    dispatch({ type: 'DELETE_LINE', payload: id });
  }, []);

  const setCalibrationDistance = useCallback((distance: number) => {
    dispatch({ type: 'SET_CALIBRATION_DISTANCE', payload: distance });
  }, []);

  const setUnit = useCallback((unit: AppState['selectedUnit']) => {
    dispatch({ type: 'SET_UNIT', payload: unit });
  }, []);

  const setMode = useCallback((mode: AppState['activeMode']) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    dispatch({ type: 'SET_PAN', payload: { x, y } });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    addPoint,
    updatePoint,
    deletePoint,
    addLine,
    deleteLine,
    setCalibrationDistance,
    setUnit,
    setMode,
    setZoom,
    setPan,
    clearAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
