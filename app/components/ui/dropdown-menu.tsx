"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom",
          className,
        )}
        {...props}
      />
    )
  },
)
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:animate-slide-in-from-top data-[side=left]:animate-slide-in-from-right data-[side=right]:animate-slide-in-from-left data-[side=top]:animate-slide-in-from-bottom",
          className,
        )}
        {...props}
      />
    )
  },
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        onClick={(e) => {
          if (onClick) {
            onClick(e)
          }
        }}
        {...props}
      />
    )
  },
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
  },
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  },
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
