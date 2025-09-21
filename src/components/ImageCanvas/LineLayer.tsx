import React from 'react';
import { Layer, Line as KonvaLine, Text } from 'react-konva';
import type { Line, Point } from '../../types';
import { COLORS } from '../../constants';
import { formatDistance } from '../../utils';

interface LineLayerProps {
  lines: Line[];
  points: Point[];
  scale: number;
}

export const LineLayer: React.FC<LineLayerProps> = ({ lines, points, scale }) => {
  const getPointById = (id: string): Point | undefined => {
    return points.find(p => p.id === id);
  };

  return (
    <Layer>
      {lines.map((line) => {
        const startPoint = getPointById(line.startPointId);
        const endPoint = getPointById(line.endPointId);

        if (!startPoint || !endPoint) return null;

        const color = line.type === 'calibration' ? COLORS.calibration : COLORS.measurement;
        const isDashed = line.type === 'calibration';

        // Calculate inverse scale to keep line width and text consistent size
        const inverseScale = 1 / scale;
        const scaledStrokeWidth = 2 * inverseScale;
        const scaledFontSize = 12 * inverseScale;
        const scaledDash = isDashed ? [10 * inverseScale, 5 * inverseScale] : undefined;

        // Calculate distance for measurement lines
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2;

        return (
          <React.Fragment key={line.id}>
            <KonvaLine
              points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
              stroke={color.line}
              strokeWidth={scaledStrokeWidth}
              dash={scaledDash}
            />

            {/* Distance label for measurement lines */}
            {line.type === 'measurement' && line.distance !== undefined && (
              <Text
                x={midX}
                y={midY - 10 * inverseScale}
                text={formatDistance(line.distance, 'cm')} // TODO: Use actual unit from state
                fontSize={scaledFontSize}
                fill={color.line}
                fontStyle="bold"
                align="center"
                offsetX={20 * inverseScale} // Approximate text width offset
              />
            )}
          </React.Fragment>
        );
      })}
    </Layer>
  );
};
