"use client"

import { formatARS, type Product } from "@/lib/products"
import type { User } from "@/lib/users"
import { getInitials } from "@/lib/users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Pencil, Repeat, Star, Tag, Trash2 } from "lucide-react"

interface ProductCardProps {
  product: Product
  currentUserId: string | null
  owner: User | undefined
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onContact: (product: Product) => void
}

export function ProductCard({
  product,
  currentUserId,
  owner,
  onEdit,
  onDelete,
  onContact,
}: ProductCardProps) {
  const isAlquiler = product.modalidad === "alquiler"
  const isOwner = currentUserId != null && product.creador_id === currentUserId
  const isLoggedIn = currentUserId != null

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.url_imagen || "/placeholder.svg"}
          alt={product.nombre}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <Badge
            className={
              isAlquiler
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground"
            }
          >
            {isAlquiler ? (
              <Tag className="size-3" aria-hidden="true" />
            ) : (
              <Repeat className="size-3" aria-hidden="true" />
            )}
            {isAlquiler ? "Alquiler" : "Intercambio"}
          </Badge>
        </span>
        {!product.disponible && (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/55">
            <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-foreground">
              No disponible
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-semibold leading-snug text-balance">
            {product.nombre}
          </h3>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            {product.id}
          </span>
        </div>

        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">
          {product.categoria}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.descripcion}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.etiquetas.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Owner row */}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="flex size-6 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground"
            aria-hidden="true"
          >
            {owner ? getInitials(owner.nombre) : "?"}
          </span>
          <span>
            {isOwner ? "Tu publicación" : owner?.nombre ?? "Usuario EcoSwap"}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div
            className="flex items-center gap-1"
            aria-label={`Estado ${product.estado_conservacion} de 5`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${
                  i < product.estado_conservacion
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-right">
            {isAlquiler ? (
              <span className="font-heading text-lg font-bold">
                {formatARS(product.costo_alquiler)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  /día
                </span>
              </span>
            ) : (
              <span className="font-heading text-sm font-bold text-accent-foreground">
                A intercambio
              </span>
            )}
          </p>
        </div>

        {/* Action area: owner can edit/delete, others contact */}
        {isOwner ? (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => onEdit(product)}
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(product)}
              aria-label={`Eliminar ${product.nombre}`}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <Button
            className="mt-4 w-full gap-2"
            onClick={() => onContact(product)}
            disabled={!isLoggedIn}
            title={
              isLoggedIn ? undefined : "Iniciá sesión para contactar al dueño"
            }
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {isLoggedIn ? "Contactar al dueño" : "Iniciá sesión para contactar"}
          </Button>
        )}
      </div>
    </article>
  )
}
