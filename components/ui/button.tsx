import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { useLanguage } from "@/app/contexts/LanguageContext"

const buttonVariants = {
  default:
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  outline:
    "inline-flex items-center justify-center rounded-md border border-input text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
  link: "inline-flex items-center text-sm underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
}

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const { language } = useLanguage()

    // This function would need a proper implementation based on your translation structure
    const getTranslatedText = (text: string) => {
      // For now, just return the original text
      return text
    }

    return (
      <Comp
        className={cn(buttonVariants[variant], buttonSizes[size], className)}
        ref={ref}
        {...props}
        lang={language}
        dir={language === "ar" ? "rtl" : "ltr"} // Add direction attribute for RTL languages
      >
        {typeof children === "string" ? getTranslatedText(children) : children}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button }
