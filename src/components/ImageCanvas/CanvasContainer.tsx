import React from 'react';
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
}) => {
  const { image } = state;

  if (!image.url) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No image loaded</div>
          <div className="text-gray-400 text-sm">Upload an image to start measuring</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Stage
        ref={stageRef}
        width={800}
        height={600}
        draggable={true}
        onClick={onStageClick}
        onWheel={onStageWheel}
        onDragStart={onStageDragStart}
        onDragEnd={onStageDragEnd}
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
        />
        <OverlayLayer />
      </Stage>
    </div>
  );
};
