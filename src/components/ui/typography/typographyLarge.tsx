import React from "react"
import { cn } from "@/lib/utils"

export interface TypographyLargeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TypographyLarge({ children, className, ...props }: TypographyLargeProps) {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </div>
  )
}
