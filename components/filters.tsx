"use client"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { formatARS, PRICE_STEP } from "@/lib/products"
import { Search, SlidersHorizontal, X } from "lucide-react"

export interface FilterState {
  query: string
  priceRange: [number, number]
  categorias: string[]
  etiquetas: string[]
}

interface FiltersProps {
  filters: FilterState
  onChange: (next: FilterState) => void
  maxPrice: number
  categorias: string[]
  etiquetas: string[]
  resultCount: number
}

export function Filters({
  filters,
  onChange,
  maxPrice,
  categorias,
  etiquetas,
  resultCount,
}: FiltersProps) {
  const toggle = (key: "categorias" | "etiquetas", value: string) => {
    const list = filters[key]
    const next = list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value]
    onChange({ ...filters, [key]: next })
  }

  const hasActive =
    filters.query !== "" ||
    filters.categorias.length > 0 ||
    filters.etiquetas.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice

  const reset = () =>
    onChange({
      query: "",
      priceRange: [0, maxPrice],
      categorias: [],
      etiquetas: [],
    })

  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
          <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
          Filtros
        </h2>
        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 gap-1 px-2 text-xs text-muted-foreground"
          >
            <X className="size-3" aria-hidden="true" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="buscador">Buscar</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="buscador"
              value={filters.query}
              onChange={(e) => onChange({ ...filters, query: e.target.value })}
              placeholder="Nombre o descripción..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Costo de alquiler (ARS/día)</Label>
          </div>
          <p className="text-sm font-medium text-foreground">
            {formatARS(filters.priceRange[0])} – {formatARS(filters.priceRange[1])}
          </p>
          <Slider
            min={0}
            max={maxPrice}
            step={PRICE_STEP}
            value={filters.priceRange}
            onValueChange={(value) =>
              onChange({ ...filters, priceRange: value as [number, number] })
            }
          />
          <p className="text-xs text-muted-foreground">
            Los intercambios ({formatARS(0)}) se incluyen en el rango.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Categorías</Label>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => {
              const active = filters.categorias.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggle("categorias", cat)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  }`}
                  aria-pressed={active}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Etiquetas</Label>
          <div className="flex flex-wrap gap-2">
            {etiquetas.map((tag) => {
              const active = filters.etiquetas.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggle("etiquetas", tag)}
                  aria-pressed={active}
                >
                  <Badge
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        <p className="border-t border-border pt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{resultCount}</span>{" "}
          objeto{resultCount === 1 ? "" : "s"} encontrado
          {resultCount === 1 ? "" : "s"}
        </p>
      </div>
    </aside>
  )
}
