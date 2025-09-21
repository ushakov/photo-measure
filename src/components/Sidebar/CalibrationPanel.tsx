import React from 'react';
import { Input, Select } from '../ui';
import { MEASUREMENT_UNITS } from '../../constants';
import type { AppState } from '../../types';

interface CalibrationPanelProps {
  calibration: AppState['calibration'];
  selectedUnit: AppState['selectedUnit'];
  onDistanceChange: (distance: number) => void;
  onUnitChange: (unit: AppState['selectedUnit']) => void;
  activeMode: AppState['activeMode'];
}

export const CalibrationPanel: React.FC<CalibrationPanelProps> = ({
  calibration,
  selectedUnit,
  onDistanceChange,
  onUnitChange,
  activeMode,
}) => {
  const unitOptions = Object.entries(MEASUREMENT_UNITS).map(([key, value]) => ({
    value: key,
    label: value.toUpperCase(),
  }));

  const isCalibrated = calibration.pixelsPerUnit !== null;
  const hasTwoPoints = calibration.points && calibration.points.length === 2;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Calibration</h3>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          {activeMode === 'calibrate' ? (
            <div className="space-y-1">
              <p>Click on two points representing a known distance</p>
              <p className="text-xs text-gray-500">
                Points placed: {calibration.points ? calibration.points.length : 0}/2
              </p>
            </div>
          ) : (
            <p>Switch to Calibrate mode to set measurement scale</p>
          )}
        </div>

        {hasTwoPoints && (
          <div className="space-y-3">
            <Input
              label="Known Distance"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter distance"
              value={calibration.actualDistance || ''}
              onChange={(e) => onDistanceChange(parseFloat(e.target.value) || 0)}
            />

            <Select
              label="Unit"
              options={unitOptions}
              value={selectedUnit}
              onChange={(e) => onUnitChange(e.target.value as AppState['selectedUnit'])}
            />
          </div>
        )}

        {isCalibrated && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="text-sm text-green-800">
              <div className="font-medium">Calibrated</div>
              <div className="text-xs">
                {calibration.pixelsPerUnit?.toFixed(2)} pixels per {selectedUnit}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
