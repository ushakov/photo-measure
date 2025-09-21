import React from 'react';
import { Layer, Circle, Text, Group, Line } from 'react-konva';
import type { Point } from '../../types';
import { COLORS, POINT_RADIUS, CROSSHAIR_SIZE } from '../../constants';

interface PointLayerProps {
  points: Point[];
  onPointDrag: (pointId: string, x: number, y: number) => void;
  onPointClick: (pointId: string) => void;
  onPointDragEnd: (pointId: string, x: number, y: number) => void;
}

export const PointLayer: React.FC<PointLayerProps> = ({
  points,
  onPointDrag,
  onPointClick,
  onPointDragEnd,
}) => {
  return (
    <Layer>
      {points.map((point) => {
        const color = point.type === 'calibration' ? COLORS.calibration : COLORS.measurement;

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
              points={[-CROSSHAIR_SIZE/2, 0, CROSSHAIR_SIZE/2, 0]}
              stroke={color.point}
              strokeWidth={2}
            />
            <Line
              points={[0, -CROSSHAIR_SIZE/2, 0, CROSSHAIR_SIZE/2]}
              stroke={color.point}
              strokeWidth={2}
            />

            {/* Circle */}
            <Circle
              radius={POINT_RADIUS}
              stroke={color.point}
              strokeWidth={2}
              fill="transparent"
            />

            {/* Label */}
            <Text
              text={point.label}
              x={POINT_RADIUS + 5}
              y={-10}
              fontSize={12}
              fill={color.point}
              fontStyle="bold"
            />
          </Group>
        );
      })}
    </Layer>
  );
};

