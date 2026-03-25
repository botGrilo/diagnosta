"use client";

import { LogOut } from "lucide-react";
import { logoutUser } from "@/actions/auth-actions";

export function LogoutButton() {
  return (
    <form action={logoutUser}>
      <button
        type="submit"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors duration-200"
        aria-label="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Cerrar Sesión</span>
      </button>
    </form>
  );
}
