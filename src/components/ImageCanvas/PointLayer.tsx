import React from 'react';
import { Layer, Circle, Text, Group, Line } from 'react-konva';
import type { Point } from '../../types';
import { COLORS, POINT_RADIUS, CROSSHAIR_SIZE } from '../../constants';

interface PointLayerProps {
  points: Point[];
  scale: number;
  onPointDrag: (pointId: string, x: number, y: number) => void;
  onPointClick: (pointId: string) => void;
  onPointDragEnd: (pointId: string, x: number, y: number) => void;
}

export const PointLayer: React.FC<PointLayerProps> = ({
  points,
  scale,
  onPointDrag,
  onPointClick,
  onPointDragEnd,
}) => {
  return (
    <Layer>
      {points.map((point) => {
        const color = point.type === 'calibration' ? COLORS.calibration : COLORS.measurement;

        // Calculate inverse scale to keep markers consistent size
        const inverseScale = 1 / scale;
        const scaledRadius = POINT_RADIUS * inverseScale;
        const scaledCrosshairSize = CROSSHAIR_SIZE * inverseScale;
        const scaledStrokeWidth = 2 * inverseScale;
        const scaledFontSize = 12 * inverseScale;

        return (
          <Group
            key={point.id}
            x={point.x}
            y={point.y}
            draggable
            onDragMove={(e) => {
              onPointDrag(point.id, e.target.x(), e.target.y());
            }}
            onClick={() => onPointClick(point.id)}
            onDragEnd={(e) => {
              onPointDragEnd(point.id, e.target.x(), e.target.y());
            }}
          >
            {/* Crosshair lines */}
            <Line
              points={[-scaledCrosshairSize/2, 0, scaledCrosshairSize/2, 0]}
              stroke={color.point}
              strokeWidth={scaledStrokeWidth}
            />
            <Line
              points={[0, -scaledCrosshairSize/2, 0, scaledCrosshairSize/2]}
              stroke={color.point}
              strokeWidth={scaledStrokeWidth}
            />

            {/* Circle */}
            <Circle
              radius={scaledRadius}
              stroke={color.point}
              strokeWidth={scaledStrokeWidth}
              fill="transparent"
            />

            {/* Label */}
            <Text
              text={point.label}
              x={scaledRadius + 5 * inverseScale}
              y={-10 * inverseScale}
              fontSize={scaledFontSize}
              fill={color.point}
              fontStyle="bold"
            />
          </Group>
        );
      })}
    </Layer>
  );
};

