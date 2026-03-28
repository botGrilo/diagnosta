"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SSEGlobalManager } from "@/components/providers/sse-global-manager"

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <SSEGlobalManager />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
