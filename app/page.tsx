"use client"

import { useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Filters, type FilterState } from "@/components/filters"
import { ProductCard } from "@/components/product-card"
import { ProductFormDialog } from "@/components/product-form-dialog"
import { AuthDialog } from "@/components/auth-dialog"
import { ChatPanel } from "@/components/chat-panel"
import { Button } from "@/components/ui/button"
import {
  CATEGORIAS,
  MAX_PRICE,
  SEED_PRODUCTS,
  type Product,
} from "@/lib/products"
import { SEED_USERS, type User } from "@/lib/users"
import {
  conversationKey,
  generateOwnerReply,
  messageId,
  type Conversation,
} from "@/lib/chat"
import { Leaf, PackageOpen } from "lucide-react"

export default function Page() {
  const [users, setUsers] = useState<User[]>(SEED_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS)

  const [authOpen, setAuthOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  // Chat state
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({})
  const [chatOpen, setChatOpen] = useState(false)
  const [activeChat, setActiveChat] = useState<{
    ownerId: string
    productId: string
  } | null>(null)
  const [typing, setTyping] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    query: "",
    priceRange: [0, MAX_PRICE],
    categorias: [],
    etiquetas: [],
  })

  const usersById = useMemo(() => {
    const map: Record<string, User> = {}
    users.forEach((u) => (map[u.id] = u))
    return map
  }, [users])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => p.etiquetas.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = filters.query.trim().toLowerCase()
      const matchesQuery =
        q === "" ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      const matchesPrice =
        p.costo_alquiler >= filters.priceRange[0] &&
        p.costo_alquiler <= filters.priceRange[1]
      const matchesCat =
        filters.categorias.length === 0 ||
        filters.categorias.includes(p.categoria)
      const matchesTags =
        filters.etiquetas.length === 0 ||
        filters.etiquetas.every((t) => p.etiquetas.includes(t))
      return matchesQuery && matchesPrice && matchesCat && matchesTags
    })
  }, [products, filters])

  // Auth handlers
  const handleLogin = (user: User) => setCurrentUser(user)
  const handleRegister = (user: User) => {
    setUsers((prev) => [...prev, user])
    setCurrentUser(user)
  }
  const handleLogout = () => {
    setCurrentUser(null)
    setChatOpen(false)
  }

  // Product handlers
  const openPublish = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (product: Product) => {
    setEditing(product)
    setFormOpen(true)
  }
  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      return exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev]
    })
  }
  const handleDelete = (product: Product) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)
    )
      return
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  // Chat handlers
  const activeConversation = activeChat
    ? conversations[conversationKey(activeChat.ownerId, activeChat.productId)]
    : undefined
  const activeProduct = activeChat
    ? products.find((p) => p.id === activeChat.productId)
    : undefined
  const activeOwner = activeChat ? usersById[activeChat.ownerId] : undefined

  const openChat = (product: Product) => {
    if (!currentUser) {
      setAuthOpen(true)
      return
    }
    const key = conversationKey(product.creador_id, product.id)
    setConversations((prev) => {
      if (prev[key]) return prev
      return {
        ...prev,
        [key]: {
          key,
          ownerId: product.creador_id,
          productId: product.id,
          messages: [],
        },
      }
    })
    setActiveChat({ ownerId: product.creador_id, productId: product.id })
    setChatOpen(true)
  }

  const handleSend = (text: string) => {
    if (!activeChat || !activeProduct || !activeOwner) return
    const key = conversationKey(activeChat.ownerId, activeChat.productId)

    setConversations((prev) => {
      const convo = prev[key]
      const userMsg = {
        id: messageId(),
        from: "me" as const,
        texto: text,
        timestamp: Date.now(),
      }
      return {
        ...prev,
        [key]: { ...convo, messages: [...convo.messages, userMsg] },
      }
    })

    // Simular respuesta automática del dueño
    setTyping(true)
    const reply = generateOwnerReply(
      activeOwner.nombre,
      activeProduct.nombre,
      activeProduct.modalidad,
      text,
    )
    window.setTimeout(() => {
      setConversations((prev) => {
        const convo = prev[key]
        if (!convo) return prev
        const ownerMsg = {
          id: messageId(),
          from: "owner" as const,
          texto: reply,
          timestamp: Date.now(),
        }
        return {
          ...prev,
          [key]: { ...convo, messages: [...convo.messages, ownerMsg] },
        }
      })
      setTyping(false)
    }, 1400)
  }

  return (
    <div className="min-h-screen">
      <Navbar
        currentUser={currentUser}
        onLogin={() => setAuthOpen(true)}
        onLogout={handleLogout}
        onPublish={openPublish}
      />

      <Hero
        total={products.length}
        disponibles={products.filter((p) => p.disponible).length}
      />

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {!currentUser && (
          <div className="mb-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-foreground">
              <Leaf className="size-4 text-primary" aria-hidden="true" />
              Iniciá sesión para publicar tus objetos, gestionar tus
              publicaciones y chatear con otros usuarios.
            </p>
            <Button size="sm" onClick={() => setAuthOpen(true)}>
              Iniciar sesión o registrarse
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Filters
              filters={filters}
              onChange={setFilters}
              maxPrice={MAX_PRICE}
              categorias={[...CATEGORIAS]}
              etiquetas={allTags}
              resultCount={filtered.length}
            />
          </div>

          <section aria-label="Catálogo de objetos">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 text-center">
                <PackageOpen
                  className="size-10 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-4 font-heading text-lg font-semibold">
                  No hay objetos que coincidan
                </p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Probá a ajustar los filtros o el rango de precio para ver más
                  resultados.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currentUserId={currentUser?.id ?? null}
                    owner={usersById[product.creador_id]}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onContact={openChat}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row md:px-6">
          <p className="flex items-center gap-2">
            <Leaf className="size-4 text-primary" aria-hidden="true" />
            Kambio — Reutiliza, no compres.
          </p>
          <p>Demostración interactiva en memoria.</p>
        </div>
      </footer>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {currentUser && (
        <ProductFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          initialProduct={editing}
          currentUserId={currentUser.id}
          onSave={handleSave}
        />
      )}

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        owner={activeOwner}
        product={activeProduct}
        messages={activeConversation?.messages ?? []}
        typing={typing}
        onSend={handleSend}
      />
    </div>
  )
}
