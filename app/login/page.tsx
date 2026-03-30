"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";
  // Email pre-rellenado cuando viene del registro
  const emailFromRegister = params.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email:    fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <Shield className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Diagnosta</h1>
        <p className="text-sm text-muted-foreground">Accede a tu consola de monitoreo</p>
      </div>

      {justRegistered && (
        <div className="bg-primary/10 border border-primary/20 text-primary rounded-lg px-4 py-3 text-sm text-center">
          ✅ Cuenta creada. Inicia sesión para continuar.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        id="form-login"
        className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground">Email</label>
          <input
            id="login-email" name="email" type="email" required autoComplete="email"
            placeholder="tu@empresa.com"
            defaultValue={emailFromRegister}
            className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-xs font-medium text-muted-foreground">Contraseña</label>
          <input
            id="login-password" name="password" type="password" required autoComplete="current-password"
            placeholder="••••••••"
            className="bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button
          id="btn-login"
          type="submit"
          disabled={loading}
          className="mt-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Verificando..." : "Iniciar Sesión"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <ThemeToggle />
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          ¿Sin cuenta?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
