import React from 'react';
import { AppMode } from '../types';
import { Icons } from './Icon';

interface ModeToggleProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  disabled?: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange, disabled }) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 self-center md:self-auto">
      <button
        onClick={() => onModeChange(AppMode.STANDARD)}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentMode === AppMode.STANDARD
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Icons.Sparkles className="h-4 w-4" />
        <span className="hidden sm:inline">Standard</span>
      </button>
      <button
        onClick={() => onModeChange(AppMode.REASONING)}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentMode === AppMode.REASONING
            ? 'bg-white text-purple-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Icons.BrainCircuit className="h-4 w-4" />
        <span className="hidden sm:inline">Deep Reasoning</span>
      </button>
    </div>
  );
};

export default ModeToggle;
