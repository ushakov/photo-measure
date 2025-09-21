import React, { useRef, useCallback } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { CanvasContainer } from './components/ImageCanvas';
import {
  ImageUpload,
  ToolSelector,
  CalibrationPanel,
  MeasurementPanel,
  UnitsSelector,
  ActionButtons
} from './components/Sidebar';
import './App.css';

const AppContent: React.FC = () => {
  const {
    state,
    dispatch,
    addPoint,
    updatePoint,
    setCalibrationDistance,
    setUnit,
    setMode,
    setZoom,
    setPan,
    clearAll,
  } = useApp();

  const stageRef = useRef<any>(null);
  const isDraggingRef = useRef(false);

  const handleImageUpload = useCallback((file: File, url: string, dimensions: { width: number; height: number }) => {
    dispatch({ type: 'SET_IMAGE', payload: { file, url, dimensions } });
  }, [dispatch]);

  const handleStageClick = useCallback((e: any) => {
    if (!state.image.url) return;

    // Don't add points if we were dragging (panning)
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const transformed = stage.getAbsoluteTransform().copy().invert().point(pointerPosition);

    if (state.activeMode === 'calibrate') {
      const calibrationPoints = state.points.filter(p => p.type === 'calibration');
      if (calibrationPoints.length < 2) {
        addPoint(transformed.x, transformed.y, 'calibration');
      }
    } else if (state.activeMode === 'measure') {
      addPoint(transformed.x, transformed.y, 'measurement');
    }
  }, [state.image.url, state.activeMode, state.points, addPoint]);

  const handleStageWheel = useCallback((e: any) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = Math.max(0.1, Math.min(10, oldScale * Math.pow(1.1, -e.evt.deltaY / 100)));

    setZoom(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setPan(newPos.x, newPos.y);
  }, [setZoom, setPan]);

  const handleStageDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleStageDragEnd = useCallback((e: any) => {
    // Only handle stage drag end if the target is the stage itself, not a child element
    if (e.target === e.target.getStage()) {
      const stage = e.target;
      setPan(stage.x(), stage.y());
    }
    isDraggingRef.current = false;
  }, [setPan]);

  const handlePointDrag = useCallback((pointId: string, x: number, y: number) => {
    updatePoint(pointId, x, y);
  }, [updatePoint]);

  const handlePointClick = useCallback((_pointId: string) => {
    // Handle point selection logic here if needed
  }, []);

  const handlePointDragEnd = useCallback((pointId: string, x: number, y: number) => {
    updatePoint(pointId, x, y);
  }, [updatePoint]);

  const handleFitToScreen = useCallback(() => {
    if (!state.image.dimensions || !stageRef.current) return;

    const stage = stageRef.current;
    const container = stage.container().parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageWidth = state.image.dimensions.width;
    const imageHeight = state.image.dimensions.height;

    const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
    const x = (containerWidth - imageWidth * scale) / 2;
    const y = (containerHeight - imageHeight * scale) / 2;

    setZoom(scale);
    setPan(x, y);
  }, [state.image.dimensions, setZoom, setPan]);

  const hasImage = !!state.image.url;
  const hasMeasurements = state.points.length > 0 || state.lines.length > 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Image Measurement Tool</h1>
        <p className="text-sm text-gray-600 mt-1">
          Upload an image, calibrate with a known distance, and measure anything
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 p-6">
          <CanvasContainer
            state={state}
            stageRef={stageRef}
            onStageClick={handleStageClick}
            onStageWheel={handleStageWheel}
            onStageDragStart={handleStageDragStart}
            onStageDragEnd={handleStageDragEnd}
            onPointDrag={handlePointDrag}
            onPointClick={handlePointClick}
            onPointDragEnd={handlePointDragEnd}
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-8">
            <ImageUpload onImageUpload={handleImageUpload} />

            <ToolSelector
              activeMode={state.activeMode}
              onModeChange={setMode}
              hasImage={hasImage}
            />

            <CalibrationPanel
              calibration={state.calibration}
              selectedUnit={state.selectedUnit}
              onDistanceChange={setCalibrationDistance}
              onUnitChange={setUnit}
              activeMode={state.activeMode}
            />

            <MeasurementPanel
              lines={state.lines}
              points={state.points}
              selectedUnit={state.selectedUnit}
              pixelsPerUnit={state.calibration.pixelsPerUnit}
              onClearAll={clearAll}
              activeMode={state.activeMode}
            />

            <UnitsSelector
              selectedUnit={state.selectedUnit}
              onUnitChange={setUnit}
            />

            <ActionButtons
              onFitToScreen={handleFitToScreen}
              onClearAll={clearAll}
              hasImage={hasImage}
              hasMeasurements={hasMeasurements}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
