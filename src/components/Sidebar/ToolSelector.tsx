import React from 'react';
import { Button } from '../ui';
import type { AppState } from '../../types';

interface ToolSelectorProps {
  activeMode: AppState['activeMode'];
  onModeChange: (mode: AppState['activeMode']) => void;
  hasImage: boolean;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeMode,
  onModeChange,
  hasImage,
}) => {
  const tools = [
    { mode: 'pan' as const, label: 'Pan & Zoom', icon: '🖱️' },
    { mode: 'calibrate' as const, label: 'Calibrate', icon: '📏' },
    { mode: 'measure' as const, label: 'Measure', icon: '📐' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Tools</h3>

      <div className="space-y-2">
        {tools.map((tool) => (
          <Button
            key={tool.mode}
            variant={activeMode === tool.mode ? 'primary' : 'outline'}
            size="md"
            className="w-full justify-start"
            onClick={() => onModeChange(tool.mode)}
            disabled={!hasImage}
          >
            <span className="mr-2">{tool.icon}</span>
            {tool.label}
          </Button>
        ))}
      </div>

      {!hasImage && (
        <p className="text-sm text-gray-500">
          Upload an image to enable tools
        </p>
      )}
    </div>
  );
};
