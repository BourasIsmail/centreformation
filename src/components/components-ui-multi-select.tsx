"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (option: Option) => {
    const newValue = value.some((item) => item.value === option.value)
      ? value.filter((item) => item.value !== option.value)
      : [...value, option];
    onChange(newValue);
  };

  const handleRemove = (optionToRemove: Option, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(value.filter((option) => option.value !== optionToRemove.value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-start h-auto min-h-[2.5rem] font-normal",
            !value.length && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 py-1">
            {value.length === 0 && placeholder}
            {value.map((option) => (
              <Badge
                variant="secondary"
                key={option.value}
                className="rounded-sm bg-muted hover:bg-muted"
              >
                {option.label}
                <span
                  className="ml-1 rounded-sm outline-none hover:bg-muted-foreground/20 cursor-pointer"
                  onClick={(e) => handleRemove(option, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleRemove(option, e as unknown as React.MouseEvent);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <ScrollArea className="h-[300px] p-1">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent rounded-sm",
                value.some((item) => item.value === option.value) && "bg-accent"
              )}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(option);
                }
              }}
              tabIndex={0}
              role="option"
              aria-selected={value.some((item) => item.value === option.value)}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-sm border",
                  value.some((item) => item.value === option.value)
                    ? "bg-primary border-primary"
                    : "border-input"
                )}
              >
                {value.some((item) => item.value === option.value) && (
                  <span className="text-primary-foreground text-xs">✓</span>
                )}
              </div>
              <span>{option.label}</span>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
