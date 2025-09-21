import React, { useState, useEffect } from 'react';
import { Stage } from 'react-konva';
import { ImageLayer } from './ImageLayer';
import { PointLayer } from './PointLayer';
import { LineLayer } from './LineLayer';
import { OverlayLayer } from './OverlayLayer';
import type { AppState } from '../../types';

interface CanvasContainerProps {
  state: AppState;
  stageRef: React.RefObject<any>;
  onStageClick: (e: any) => void;
  onStageWheel: (e: any) => void;
  onStageDragStart: () => void;
  onStageDragEnd: (e: any) => void;
  onPointDrag: (pointId: string, x: number, y: number) => void;
  onPointClick: (pointId: string) => void;
  onPointDragEnd: (pointId: string, x: number, y: number) => void;
  isMobile?: boolean;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  state,
  stageRef,
  onStageClick,
  onStageWheel,
  onStageDragStart,
  onStageDragEnd,
  onPointDrag,
  onPointClick,
  onPointDragEnd,
  isMobile = false,
}) => {
  const { image } = state;
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Update stage size based on container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef) {
        const rect = containerRef.getBoundingClientRect();
        const newWidth = Math.max(300, rect.width - 16); // Account for padding
        const newHeight = Math.max(300, rect.height - 16);
        setStageSize({ width: newWidth, height: newHeight });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [containerRef]);

  // Touch gesture handling for mobile
  const handleTouchStart = (e: any) => {
    if (!isMobile) return;

    const touch2 = e.evt.touches[1];

    if (touch2) {
      // Two finger touch - prepare for pinch zoom
      const stage = e.target.getStage();
      stage.lastCenter = null;
      stage.lastDist = 0;
    }
  };

  const handleTouchMove = (e: any) => {
    if (!isMobile) return;

    e.evt.preventDefault();
    const touch = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch2) {
      // Pinch zoom
      const stage = e.target.getStage();
      const p1 = { x: touch.clientX, y: touch.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };

      if (!stage.lastCenter) {
        stage.lastCenter = getCenter(p1, p2);
        return;
      }

      const newCenter = getCenter(p1, p2);
      const newDist = getDistance(p1, p2);

      if (!stage.lastDist) {
        stage.lastDist = newDist;
      }

      const scale = stage.scaleX() * (newDist / stage.lastDist);
      const newScale = Math.max(0.1, Math.min(10, scale));

      const dx = newCenter.x - stage.lastCenter.x;
      const dy = newCenter.y - stage.lastCenter.y;

      stage.scaleX(newScale);
      stage.scaleY(newScale);
      stage.x(stage.x() + dx);
      stage.y(stage.y() + dy);

      stage.lastDist = newDist;
      stage.lastCenter = newCenter;
    }
  };

  const getCenter = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };

  const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  if (!image.url) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg min-h-[300px]">
        <div className="text-center p-4">
          <div className="text-gray-500 text-lg mb-2">No image loaded</div>
          <div className="text-gray-400 text-sm">Upload an image to start measuring</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setContainerRef}
      className="flex-1 relative bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[300px] touch-none"
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable={true}
        onClick={onStageClick}
        onTap={onStageClick}
        onWheel={onStageWheel}
        onDragStart={onStageDragStart}
        onDragEnd={onStageDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        scaleX={image.scale}
        scaleY={image.scale}
        x={image.offset.x}
        y={image.offset.y}
      >
        <ImageLayer image={image} />
        <LineLayer
          lines={state.lines}
          points={state.points}
          scale={image.scale}
          pixelsPerUnit={state.calibration.pixelsPerUnit}
          selectedUnit={state.selectedUnit}
        />
        <PointLayer
          points={state.points}
          scale={image.scale}
          onPointDrag={onPointDrag}
          onPointClick={onPointClick}
          onPointDragEnd={onPointDragEnd}
          isMobile={isMobile}
        />
        <OverlayLayer />
      </Stage>
    </div>
  );
};
