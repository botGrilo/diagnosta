"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Bypass a Next.js 15.2 (Turbopack + React 19): 
  // No renderizamos el inyector de scripts prohibido en el servidor.
  // Solo lo activamos cuando la página ya aterrizó en el navegador del cliente.
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
