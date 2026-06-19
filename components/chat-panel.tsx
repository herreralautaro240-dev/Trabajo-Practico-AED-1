"use client"

import { useEffect, useRef, useState } from "react"
import type { ChatMessage } from "@/lib/chat"
import type { Product } from "@/lib/products"
import { formatARS } from "@/lib/products"
import type { User } from "@/lib/users"
import { getInitials } from "@/lib/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, X } from "lucide-react"

interface ChatPanelProps {
  open: boolean
  onClose: () => void
  owner: User | undefined
  product: Product | undefined
  messages: ChatMessage[]
  typing: boolean
  onSend: (text: string) => void
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ChatPanel({
  open,
  onClose,
  owner,
  product,
  messages,
  typing,
  onSend,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setDraft("")
  }, [open, product?.id])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft("")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-foreground/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Chat con ${owner?.nombre ?? "el dueño"}`}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-semibold">
            {owner ? getInitials(owner.nombre) : "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold">
              {owner?.nombre ?? "Dueño"}
            </p>
            <p className="truncate text-xs text-primary-foreground/80">
              {product?.nombre}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 transition-colors hover:bg-primary-foreground/15"
            aria-label="Cerrar chat"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Product context */}
        {product && (
          <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
            <img
              src={product.url_imagen || "/placeholder.svg"}
              alt={product.nombre}
              className="size-10 rounded-md border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {product.modalidad === "alquiler"
                  ? `${formatARS(product.costo_alquiler)} /día`
                  : "Disponible para intercambio"}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4"
        >
          {messages.length === 0 && !typing && (
            <p className="mx-auto mt-8 max-w-[80%] text-balance text-center text-sm text-muted-foreground">
              Escribí tu primer mensaje para coordinar el{" "}
              {product?.modalidad === "intercambio" ? "intercambio" : "alquiler"}{" "}
              de este objeto.
            </p>
          )}

          {messages.map((m) => {
            const mine = m.from === "me"
            return (
              <div
                key={m.id}
                className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    mine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card text-card-foreground border border-border"
                  }`}
                >
                  {m.texto}
                </div>
                <span className="mt-1 px-1 text-[10px] text-muted-foreground">
                  {formatTime(m.timestamp)}
                </span>
              </div>
            )
          })}

          {typing && (
            <div className="flex items-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3">
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={send}
          className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Escribí un mensaje..."
            aria-label="Mensaje"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!draft.trim()}
            aria-label="Enviar mensaje"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </aside>
    </>
  )
}
