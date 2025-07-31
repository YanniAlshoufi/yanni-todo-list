"use client";

import { useState } from "react";

type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  min?: string;
  max?: string;
  className?: string;
};

export function DateInput({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  error,
  min,
  max,
  className = "",
}: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`text-foreground bg-background border-border placeholder:text-muted-foreground focus:ring-primary disabled:bg-muted disabled:text-muted-foreground hover:border-muted-foreground w-full rounded-md border px-3 py-2.5 text-sm transition-all duration-150 ease-in-out focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed ${error ? "border-destructive focus:ring-destructive" : ""} ${isFocused ? "shadow-sm" : ""} [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:dark:filter`}
        />
      </div>
      {error && (
        <p className="text-destructive mt-1 text-xs transition-opacity duration-150">
          {error}
        </p>
      )}
    </div>
  );
}
