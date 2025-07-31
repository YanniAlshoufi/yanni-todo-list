"use client";

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
};

export function TextArea({
  value,
  onChange,
  placeholder = "",
  disabled = false,
  error,
  rows = 3,
  maxLength,
  className = "",
}: TextAreaProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`text-foreground bg-background border-border placeholder:text-muted-foreground focus:ring-primary disabled:bg-muted disabled:text-muted-foreground hover:border-muted-foreground resize-vertical w-full rounded-md border px-3 py-2.5 text-sm transition-all duration-150 ease-in-out focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed ${error ? "border-destructive focus:ring-destructive" : ""} `}
        />
        {maxLength && (
          <div className="text-muted-foreground absolute right-2 bottom-2 text-xs">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
    </div>
  );
}
