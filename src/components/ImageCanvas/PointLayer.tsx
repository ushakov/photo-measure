import React, { useState } from 'react';
import { Layer, Circle, Text, Group, Line } from 'react-konva';
import type { Point } from '../../types';
import { COLORS, POINT_RADIUS, CROSSHAIR_SIZE } from '../../constants';

interface PointLayerProps {
  points: Point[];
  scale: number;
  onPointDrag: (pointId: string, x: number, y: number) => void;
  onPointClick: (pointId: string) => void;
  onPointDragEnd: (pointId: string, x: number, y: number) => void;
  isMobile?: boolean;
}

export const PointLayer: React.FC<PointLayerProps> = ({
  points,
  scale,
  onPointDrag,
  onPointClick,
  onPointDragEnd,
  isMobile = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  return (
    <Layer>
      {points.map((point) => {
        const color = point.type === 'calibration' ? COLORS.calibration : COLORS.measurement;
        const isHovered = hoveredPoint === point.id;

        // Calculate inverse scale to keep markers consistent size
        const inverseScale = 1 / scale;
        // Make touch targets larger on mobile
        const baseRadius = isMobile ? POINT_RADIUS * 1.5 : POINT_RADIUS;
        const scaledRadius = baseRadius * inverseScale;
        const scaledCrosshairSize = CROSSHAIR_SIZE * inverseScale;
        const scaledStrokeWidth = (isMobile ? 3 : 2) * inverseScale;
        const scaledFontSize = (isMobile ? 16 : 12) * inverseScale;

        // Use hover color if hovered
        const pointColor = isHovered ? color.pointHover : color.point;

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
            onTap={() => onPointClick(point.id)}
            onDragEnd={(e) => {
              onPointDragEnd(point.id, e.target.x(), e.target.y());
            }}
            onMouseEnter={() => setHoveredPoint(point.id)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Large invisible touch target for mobile */}
            {isMobile && (
              <Circle
                radius={scaledRadius * 2}
                fill="transparent"
                stroke="transparent"
                hitStrokeWidth={scaledRadius * 2}
              />
            )}

            {/* Crosshair lines */}
            <Line
              points={[-scaledCrosshairSize/2, 0, scaledCrosshairSize/2, 0]}
              stroke={pointColor}
              strokeWidth={scaledStrokeWidth}
            />
            <Line
              points={[0, -scaledCrosshairSize/2, 0, scaledCrosshairSize/2]}
              stroke={pointColor}
              strokeWidth={scaledStrokeWidth}
            />

            {/* Circle */}
            <Circle
              radius={scaledRadius}
              stroke={pointColor}
              strokeWidth={scaledStrokeWidth}
              fill="transparent"
            />

            {/* Label */}
            <Text
              text={point.label}
              x={scaledRadius + 5 * inverseScale}
              y={-10 * inverseScale}
              fontSize={scaledFontSize}
              fill={pointColor}
              fontStyle="bold"
            />
          </Group>
        );
      })}
    </Layer>
  );
};

