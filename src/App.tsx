import React, { useRef, useCallback, useState, useEffect } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Image Measurement Tool</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1 hidden sm:block">
              Upload an image, calibrate with a known distance, and measure anything
            </p>
          </div>

          {/* Mobile sidebar toggle */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <div className={`flex-1 p-2 md:p-6 transition-all duration-300 ${isMobile && sidebarOpen ? 'opacity-50' : ''}`}>
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
            isMobile={isMobile}
          />
        </div>

        {/* Desktop Sidebar */}
        {!isMobile && (
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
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto z-50 transform transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Tools</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close sidebar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

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
          </>
        )}
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
