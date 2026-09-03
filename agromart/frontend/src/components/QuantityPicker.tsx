import React from 'react';

interface QuantityPickerProps {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantityPicker: React.FC<QuantityPickerProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max) onChange(value + 1);
  };

  const paddingClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <div className={`inline-flex items-center bg-surface-container-low border border-outline-variant/50 rounded-lg font-semibold ${paddingClass}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="text-primary hover:text-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors p-0.5"
      >
        <span className="material-symbols-outlined text-base">remove</span>
      </button>
      <span className="mx-3 text-on-surface w-6 text-center font-semibold select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="text-primary hover:text-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors p-0.5"
      >
        <span className="material-symbols-outlined text-base">add</span>
      </button>
    </div>
  );
};
