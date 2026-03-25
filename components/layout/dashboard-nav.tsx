import Link from "next/link";
import { Shield, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "@/auth";

// Función para obtener iniciales del nombre
function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardNav({ user }: { user: any }) {
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border bg-background">
      <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none">
        <Shield className="text-primary h-7 w-7" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Diagnosta</h1>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/dashboard/endpoints"
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-full px-3 py-1.5 hover:border-primary/40 transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
          Endpoints
        </Link>
                <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity focus:outline-none">
              {getInitials(user?.name)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border border-border">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{user?.name || "Admin"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }} className="w-full">
                <button type="submit" className="flex w-full items-center gap-2 text-sm text-destructive hover:text-destructive/90 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
