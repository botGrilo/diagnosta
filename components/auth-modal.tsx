"use client";

import { useState, useTransition, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "@/actions/auth-actions";
import { Shield, Loader2, X } from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authQuery = searchParams.get("auth");

  const isOpen = authQuery === "login" || authQuery === "register";
  const mode = authQuery as "login" | "register";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Limpiar errores si el usuario cambia de login a registro
  useEffect(() => {
    setError(null);
  }, [mode]);

  if (!isOpen) return null;

  // Cerramos el modal limpiando la URL (quitando el ?auth=...)
  function closeModal() {
    router.push("/"); 
    setError(null);
    setSuccessMsg(null);
  }

  // Clicar fuera de la caja blanca cierra el modal
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) closeModal();
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setSuccessMsg(null);
    const fd = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: fd.get("email"),
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

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setSuccessMsg(null);
    const fd = new FormData(e.currentTarget);
    
    if (fd.get("password") !== fd.get("confirm_password")) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    startTransition(async () => {
      const result = await registerUser(fd);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccessMsg("Cuenta creada. Inicia sesión para continuar.");
        router.push("?auth=login"); // Pasa a modo login sin recargar la página
      }
    });
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl p-6 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        
        {/* Botón de la X para cerrar */}
        <button 
          onClick={closeModal} 
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cabecera del Modal */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <Shield className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {mode === "login" ? "Iniciar Sesión" : "Crear cuenta"}
          </h2>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "login" ? "Accede a tu consola de monitoreo" : "Empieza a monitorear en 30 segundos"}
          </p>
        </div>

        {/* Mensaje de Éxito al registrarse */}
        {successMsg && mode === "login" && (
          <div className="bg-primary/10 border border-primary/20 text-primary rounded-lg px-4 py-3 text-sm text-center">
            ✅ {successMsg}
          </div>
        )}
        
        {/* Error Global */}
        {error && (
          <p className="text-sm text-destructive text-center mb-[-10px]">{error}</p>
        )}

        {/* ---------- FORMULARIO LOGIN ---------- */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input name="email" type="email" required placeholder="tu@empresa.com"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
              <input name="password" type="password" required placeholder="Ingresa tu contraseña"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Sin cuenta? <button type="button" onClick={() => router.push("?auth=register")} className="text-primary font-semibold hover:underline">Regístrate gratis</button>
            </p>
          </form>
        )}

        {/* ---------- FORMULARIO REGISTRO ---------- */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Nombre</label>
              <input name="name" type="text" required placeholder="Goyo García"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input name="email" type="email" required placeholder="tu@empresa.com"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
              <input name="password" type="password" required placeholder="Mínimo 8"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Confirmar contraseña</label>
              <input name="confirm_password" type="password" required placeholder="Repite tu contraseña"
                className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" disabled={pending} className="mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta? <button type="button" onClick={() => router.push("?auth=login")} className="text-primary font-semibold hover:underline">Inicia sesión</button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
}
