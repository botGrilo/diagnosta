"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// Componente compartido — úsalo en cualquier página, client o server
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 flex items-center justify-center h-9 w-9 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 shadow-sm transition-colors duration-300"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
