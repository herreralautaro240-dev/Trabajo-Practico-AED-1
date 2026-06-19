"use client"

import { Recycle, Repeat, Sparkles } from "lucide-react"

interface HeroProps {
  total: number
  disponibles: number
}

export function Hero({ total, disponibles }: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16">
      <div className="rounded-3xl border border-border bg-card px-6 py-10 md:px-12 md:py-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Mercado comunitario de reutilización
        </span>
        <h1 className="mt-5 max-w-2xl text-balance font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Dale una segunda vida a los objetos que ya no usas
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Alquila lo que necesitas por unos días o intercambia lo que te sobra.
          EcoSwap conecta a tu comunidad para reducir el desperdicio y ahorrar
          dinero.
        </p>

        <div className="mt-8 flex flex-wrap gap-6">
          <Stat
            icon={<Recycle className="size-5" aria-hidden="true" />}
            value={total}
            label="objetos en circulación"
          />
          <Stat
            icon={<Repeat className="size-5" aria-hidden="true" />}
            value={disponibles}
            label="disponibles ahora"
          />
        </div>
      </div>
    </section>
  )
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="font-heading text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
