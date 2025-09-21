import React from 'react';
import { Button } from '../ui';
import { formatDistance } from '../../utils';
import type { AppState } from '../../types';

interface MeasurementPanelProps {
  lines: AppState['lines'];
  points: AppState['points'];
  selectedUnit: AppState['selectedUnit'];
  onClearAll: () => void;
  activeMode: AppState['activeMode'];
}

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  lines,
  points,
  selectedUnit,
  onClearAll,
  activeMode,
}) => {
  const measurementLines = lines.filter(line => line.type === 'measurement');
  const measurementPoints = points.filter(point => point.type === 'measurement');

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
              {measurementLines.map((line, index) => (
                <div key={line.id} className="bg-gray-50 p-2 rounded text-sm">
                  <div className="font-medium text-gray-700">
                    Line {index + 1}
                  </div>
                  {line.distance !== undefined && (
                    <div className="text-blue-600">
                      {formatDistance(line.distance, selectedUnit)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
