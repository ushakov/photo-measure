import React from 'react';
import { Select } from '../ui';
import { MEASUREMENT_UNITS } from '../../constants';
import type { AppState } from '../../types';

interface UnitsSelectorProps {
  selectedUnit: AppState['selectedUnit'];
  onUnitChange: (unit: AppState['selectedUnit']) => void;
}

export const UnitsSelector: React.FC<UnitsSelectorProps> = ({
  selectedUnit,
  onUnitChange,
}) => {
  const unitOptions = Object.entries(MEASUREMENT_UNITS).map(([key, value]) => ({
    value: key,
    label: value.toUpperCase(),
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Units</h3>

      <Select
        label="Measurement Unit"
        options={unitOptions}
        value={selectedUnit}
        onChange={(e) => onUnitChange(e.target.value as AppState['selectedUnit'])}
      />

      <div className="text-sm text-gray-600">
        This unit will be used for all measurements and calibration.
      </div>
    </div>
  );
};
