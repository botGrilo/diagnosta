"use client";

import { useState, useTransition } from "react";
import { registerUser } from "@/actions/auth-actions";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const [error,   setError]        = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    if (fd.get("password") !== fd.get("confirm_password")) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    startTransition(async () => {
      const result = await registerUser(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">

      {/* Botón de tema — fixed top-right */}
      <ThemeToggle />

      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="flex flex-col items-center gap-2">
          <Shield className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Crear cuenta</h1>
          <p className="text-sm text-muted-foreground">Empieza a monitorear en 30 segundos</p>
        </div>

        <form
          onSubmit={handleSubmit}
          id="form-register"
          className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-name" className="text-xs font-medium text-muted-foreground">Nombre</label>
            <input
              id="reg-name" name="name" type="text" required autoComplete="name"
              placeholder="Goyo García"
              className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-email" className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              id="reg-email" name="email" type="email" required autoComplete="email"
              placeholder="tu@empresa.com"
              className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <input
              id="reg-password" name="password" type="password" required autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-medium text-muted-foreground">Confirmar contraseña</label>
            <input
              id="reg-confirm" name="confirm_password" type="password" required autoComplete="new-password"
              placeholder="Repite tu contraseña"
              className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <button
            id="btn-register"
            type="submit"
            disabled={pending}
            className="mt-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Creando cuenta..." : "Crear Cuenta Gratis"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
}
