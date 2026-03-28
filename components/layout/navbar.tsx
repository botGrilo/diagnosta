"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Shield, Settings, LogOut, LayoutDashboard, Play, Activity, Globe } from "lucide-react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "@/actions/auth-actions"
import { usePathname } from "next/navigation"
import { RedGlobal } from "../dashboard/red-global"

/**
 * Navbar Maestro de Diagnosta
 * Fuente única de verdad para la navegación global.
 */

function getInitials(name: string | null | undefined): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Lado Izquierdo: Branding */}
        <Link href="/" className="flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all focus:outline-none group">
          <Shield className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
          <span className="text-lg font-bold text-foreground tracking-tighter hidden sm:inline-block">
            Diagnosta
          </span>
        </Link>

        {/* Lado Derecho: Acciones y Usuario */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          <nav className="hidden md:flex items-center gap-4">
            {pathname !== "/status/global" && <RedGlobal />}
          </nav>


          <ThemeToggle />

          {isLoading ? (
            <div className="h-8 w-32 rounded-lg bg-muted animate-pulse hidden sm:block" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Acceso rápido SRE */}
              <div className="hidden xs:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 text-foreground border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-all",
                    pathname === "/dashboard" && "bg-atleta/10 text-atleta border-atleta/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                  )}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-atleta" />
                  Panel
                </Link>
                <Link
                  href="/dashboard/endpoints"
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 text-foreground border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-all",
                    pathname === "/dashboard/endpoints" && "bg-atleta/10 text-atleta border-atleta/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                  )}
                >
                  <Activity className="h-3.5 w-3.5 text-atleta" />
                  Monitores
                </Link>
                <Link
                  href={`/status/${session?.user?.name?.replace(/\s+/g, '').toLowerCase() || 'admin'}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2 hover:bg-primary/20 transition-all shadow-[0_0_20px_rgba(45,212,191,0.1)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  En Vivo
                </Link>
              </div>

              {/* Menú de Usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
                    {getInitials(session?.user?.name)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl border-border bg-card">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Panel de Control
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/endpoints" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Endpoints
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer group"
                    onSelect={() => logoutUser()}
                  >
                    <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/status/admin" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors hidden xs:flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5" />
                Demo
              </Link>
              <Link 
                href="/?auth=login" 
                className="text-sm font-semibold bg-primary text-primary-foreground px-4 sm:px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
