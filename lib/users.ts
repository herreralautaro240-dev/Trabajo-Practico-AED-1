export interface User {
  id: string
  nombre: string
  email: string
  password: string
}

export const SEED_USERS: User[] = [
  {
    id: "u-lautaro",
    nombre: "Lautaro Herrera",
    email: "lautaro@ecoswap.com",
    password: "ecoswap123",
  },
  {
    id: "u-martina",
    nombre: "Martina Gómez",
    email: "martina@ecoswap.com",
    password: "ecoswap123",
  },
  {
    id: "u-diego",
    nombre: "Diego Fernández",
    email: "diego@ecoswap.com",
    password: "ecoswap123",
  },
]

export const DEFAULT_USER_ID = "u-lautaro"

export function getInitials(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("")
}

export function generateUserId() {
  return "u-" + Math.random().toString(36).slice(2, 8)
}
