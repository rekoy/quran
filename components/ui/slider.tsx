import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.SliderHTMLAttributes<HTMLInputElement> {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="range"
      className={cn("h-4 w-full appearance-none rounded-lg bg-primary/20 outline-none", className)}
      ref={ref}
      {...props}
    />
  )
})
Slider.displayName = "Slider"

export { Slider }
