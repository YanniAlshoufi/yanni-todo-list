"use client";

import { useState } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: CheckboxProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="sr-only"
        />
        <div
          onClick={() => !disabled && onChange(!checked)}
          className={`relative flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-all duration-150 ease-in-out ${
            checked
              ? "bg-primary border-primary"
              : "bg-background border-border"
          } ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "hover:border-muted-foreground"
          } ${isFocused ? "ring-primary ring-opacity-20 ring-2" : ""} `}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-white transition-opacity duration-150"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <label
          onClick={() => !disabled && onChange(!checked)}
          className={`text-foreground ml-3 text-sm ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} transition-colors duration-150`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
