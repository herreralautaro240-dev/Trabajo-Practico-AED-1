"use client"

import { Button } from "@/components/ui/button"
import type { User } from "@/lib/users"
import { getInitials } from "@/lib/users"
import { Leaf, LogIn, LogOut, Plus } from "lucide-react"

interface NavbarProps {
  currentUser: User | null
  onLogin: () => void
  onLogout: () => void
  onPublish: () => void
}

export function Navbar({
  currentUser,
  onLogin,
  onLogout,
  onPublish,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="font-heading text-lg font-bold tracking-tight">
              Kambio
            </p>
            <p className="text-xs text-muted-foreground">Reutiliza, no compres</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Button
                onClick={onPublish}
                className="gap-2"
                aria-label="Publicar objeto"
              >
                <Plus className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Publicar objeto</span>
              </Button>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
                <span
                  className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
                  aria-hidden="true"
                >
                  {getInitials(currentUser.nombre)}
                </span>
                <span className="hidden text-sm font-medium sm:inline">
                  {currentUser.nombre}
                </span>
                <button
                  onClick={onLogout}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            </>
          ) : (
            <Button onClick={onLogin} className="gap-2">
              <LogIn className="size-4" aria-hidden="true" />
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
