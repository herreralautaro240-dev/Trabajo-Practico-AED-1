"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateUserId, type User } from "@/lib/users"
import { Leaf, Lock, Mail, User as UserIcon, Recycle, Repeat } from "lucide-react"

type Mode = "login" | "register"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
  onLogin: (user: User) => void
  onRegister: (user: User) => void
}

export function AuthDialog({
  open,
  onOpenChange,
  users,
  onLogin,
  onRegister,
}: AuthDialogProps) {
  const [mode, setMode] = useState<Mode>("login")
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setMode("login")
      setNombre("")
      setEmail("lautaro@ecoswap.com")
      setPassword("ecoswap123")
      setError("")
    }
  }, [open])

  const switchMode = (next: Mode) => {
    setMode(next)
    setError("")
    if (next === "register") {
      setNombre("")
      setEmail("")
      setPassword("")
    } else {
      setEmail("lautaro@ecoswap.com")
      setPassword("ecoswap123")
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (mode === "login") {
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password,
      )
      if (!match) {
        setError("Email o contraseña incorrectos. Probá lautaro@ecoswap.com.")
        return
      }
      onLogin(match)
      onOpenChange(false)
      return
    }

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Completá todos los campos para registrarte.")
      return
    }
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("Ya existe una cuenta con ese email.")
      return
    }
    const newUser: User = {
      id: generateUserId(),
      nombre: nombre.trim(),
      email: email.trim(),
      password,
    }
    onRegister(newUser)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
        <DialogTitle className="sr-only">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Brand panel */}
          <aside className="relative hidden flex-col justify-between bg-primary p-8 text-primary-foreground md:flex">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
                <Leaf className="size-5" aria-hidden="true" />
              </span>
              <p className="font-heading text-lg font-bold">EcoSwap</p>
            </div>
            <div>
              <h2 className="text-balance font-heading text-2xl font-bold leading-tight">
                Sumate a la comunidad que reutiliza
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-primary-foreground/80">
                Alquilá lo que necesitás e intercambiá lo que ya no usás. Menos
                desperdicio, más comunidad.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Recycle className="size-4" aria-hidden="true" />
                  Publicá tus objetos en segundos
                </li>
                <li className="flex items-center gap-3">
                  <Repeat className="size-4" aria-hidden="true" />
                  Chateá directo con cada dueño
                </li>
              </ul>
            </div>
            <p className="text-xs text-primary-foreground/60">
              Demostración interactiva en memoria.
            </p>
          </aside>

          {/* Form panel */}
          <div className="p-6 sm:p-8">
            <div className="mb-6 inline-flex rounded-full border border-border bg-muted p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
                aria-pressed={mode === "login"}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
                aria-pressed={mode === "register"}
              >
                Registrarse
              </button>
            </div>

            <h3 className="font-heading text-xl font-bold">
              {mode === "login" ? "Bienvenido de nuevo" : "Creá tu cuenta"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Ingresá para publicar y gestionar tus objetos."
                : "Registrate para empezar a intercambiar."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="auth-nombre">Nombre completo</Label>
                  <div className="relative">
                    <UserIcon
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="auth-nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Camila Ruiz"
                      className="pl-9"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="auth-email">Email</Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-password">Contraseña</Label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full">
                {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </Button>

              {mode === "login" && (
                <p className="text-center text-xs text-muted-foreground">
                  Cuenta demo: lautaro@ecoswap.com / ecoswap123
                </p>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
