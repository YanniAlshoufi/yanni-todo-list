"use client";

import { useState } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  error,
  className = "",
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`text-foreground bg-background border-border focus:ring-primary disabled:bg-muted disabled:text-muted-foreground hover:border-muted-foreground w-full rounded-md border px-3 py-2.5 pr-10 text-sm transition-all duration-150 ease-in-out focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed ${error ? "border-destructive focus:ring-destructive" : ""} ${isFocused ? "shadow-sm" : ""} cursor-pointer appearance-none`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className={`h-4 w-4 transition-colors duration-150 ${
              disabled ? "text-muted-foreground" : "text-muted-foreground"
            } `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-destructive mt-1 text-xs transition-opacity duration-150">
          {error}
        </p>
      )}
    </div>
  );
}
