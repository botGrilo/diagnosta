import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Shield } from "lucide-react";
import { auth } from "@/auth";

export async function PublicNav() {
  // Verificamos si hay sesión en tiempo real desde el servidor
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      
      {/* 1. Logo dinámico: Si estás logueado te lleva al dashboard, si no, a la landing inicial */}
      <Link 
        href={session?.user ? "/dashboard" : "/"} 
        className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
      >
        <Shield className="text-primary h-7 w-7" />
        <span className="font-bold text-xl">Diagnosta</span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* 2. Botón dinámico: Dashboard vs Login */}
        {session?.user ? (
          <Link 
            href="/dashboard" 
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            Volver al Dashboard
          </Link>
        ) : (
          <Link 
            href="/?auth=login" 
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>

    </header>
  );
}
