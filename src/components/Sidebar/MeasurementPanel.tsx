import React from 'react';
import { Button } from '../ui';
import { formatDistance, calculateRealDistance } from '../../utils';
import type { AppState } from '../../types';

interface MeasurementPanelProps {
  lines: AppState['lines'];
  points: AppState['points'];
  selectedUnit: AppState['selectedUnit'];
  pixelsPerUnit: number | null;
  onClearAll: () => void;
  activeMode: AppState['activeMode'];
}

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  lines,
  points,
  selectedUnit,
  pixelsPerUnit,
  onClearAll,
  activeMode,
}) => {
  const measurementLines = lines.filter(line => line.type === 'measurement');
  const measurementPoints = points.filter(point => point.type === 'measurement');

  const getPointById = (id: string) => points.find(p => p.id === id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Measurements</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          disabled={measurementLines.length === 0 && measurementPoints.length === 0}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          {activeMode === 'measure' ? (
            <div className="space-y-1">
              <p>Click to place measurement points</p>
              <p className="text-xs text-gray-500">
                Points: {measurementPoints.length}
              </p>
            </div>
          ) : (
            <p>Switch to Measure mode to add measurement points</p>
          )}
        </div>

        {measurementLines.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Distance Measurements</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {measurementLines.map((line) => {
                const startPoint = getPointById(line.startPointId);
                const endPoint = getPointById(line.endPointId);

                let distance: number | null = null;
                if (startPoint && endPoint && pixelsPerUnit) {
                  distance = calculateRealDistance(startPoint, endPoint, pixelsPerUnit);
                }

                return (
                  <div key={line.id} className="bg-gray-50 p-2 rounded text-sm flex justify-between flex-row">
                    <div className="font-medium text-gray-700">
                      {startPoint?.label} - {endPoint?.label}
                    </div>
                    {distance !== null ? (
                      <div className="text-blue-600">
                        {formatDistance(distance, selectedUnit)}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-xs">
                        Calibration required
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
