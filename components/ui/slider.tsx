"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(e.target.value)
      onValueChange?.([value])
      onChange?.(e)
    }

    return (
      <input
        type="range"
        className={cn("h-4 w-full appearance-none rounded-lg bg-primary/20 outline-none", className)}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
Slider.displayName = "Slider"

export { Slider }
