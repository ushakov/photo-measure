import React from 'react';
import { Button } from '../ui';

interface ActionButtonsProps {
  onFitToScreen: () => void;
  onClearAll: () => void;
  hasImage: boolean;
  hasMeasurements: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFitToScreen,
  onClearAll,
  hasImage,
  hasMeasurements,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Actions</h3>

      <div className="space-y-2">
        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={onFitToScreen}
          disabled={!hasImage}
        >
          Fit to Screen
        </Button>

        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={onClearAll}
          disabled={!hasMeasurements}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};
