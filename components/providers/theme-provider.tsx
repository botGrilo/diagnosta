"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  // En Next.js 16 / React 19, no usamos el hack de 'mounted'.
  // Delegamos la prevención de FOUC directamente a next-themes aprovechando suppressHydrationWarning.
  // Esto evita el error: "Encountered a script tag while rendering React component".
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

