"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CATEGORIAS,
  ETIQUETAS_SUGERIDAS,
  generateId,
  PRICE_STEP,
  type Modalidad,
  type Product,
} from "@/lib/products"
import { ImageIcon, Plus, Upload, X } from "lucide-react"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialProduct: Product | null
  currentUserId: string
  onSave: (product: Product) => void
}

const emptyForm: Product = {
  id: "",
  nombre: "",
  descripcion: "",
  categoria: CATEGORIAS[0],
  etiquetas: [],
  modalidad: "alquiler",
  costo_alquiler: 2000,
  estado_conservacion: 4,
  url_imagen: "",
  disponible: true,
  creador_id: "",
}

export function ProductFormDialog({
  open,
  onOpenChange,
  initialProduct,
  currentUserId,
  onSave,
}: ProductFormDialogProps) {
  const isEditing = Boolean(initialProduct)
  const [form, setForm] = useState<Product>(emptyForm)
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (open) {
      setForm(
        initialProduct ?? {
          ...emptyForm,
          id: generateId(),
          creador_id: currentUserId,
        },
      )
      setTagInput("")
    }
  }, [open, initialProduct, currentUserId])

  const update = <K extends keyof Product>(key: K, value: Product[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/^#/, "")
    if (tag && !form.etiquetas.includes(tag)) {
      update("etiquetas", [...form.etiquetas, tag])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    update(
      "etiquetas",
      form.etiquetas.filter((t) => t !== tag),
    )

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update("url_imagen", reader.result as string)
    reader.readAsDataURL(file)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) return
    onSave({
      ...form,
      costo_alquiler:
        form.modalidad === "intercambio" ? 0 : Number(form.costo_alquiler),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {isEditing ? "Editar objeto" : "Publicar un objeto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Modifica los campos del registro ${form.id}.`
              : "Completa los datos para añadir tu objeto al catálogo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              placeholder="Ej. Bicicleta urbana"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(e) => update("descripcion", e.target.value)}
              placeholder="Describe el objeto, su estado y para qué sirve..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) => update("categoria", v)}
              >
                <SelectTrigger id="categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modalidad">Modalidad</Label>
              <Select
                value={form.modalidad}
                onValueChange={(v) => update("modalidad", v as Modalidad)}
              >
                <SelectTrigger id="modalidad">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                  <SelectItem value="intercambio">Intercambio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.modalidad === "alquiler" && (
            <div className="space-y-2">
              <Label htmlFor="costo">Costo de alquiler (ARS/día)</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id="costo"
                  type="number"
                  min={0}
                  step={PRICE_STEP}
                  // Si el valor es 0, lo muestra vacío para que no moleste el cero inicial al borrar
                  value={form.costo_alquiler === 0 ? "" : form.costo_alquiler}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Si se borra todo, guarda un string vacío para permitir escribir fluidamente
                    update("costo_alquiler", val === "" ? "" : Number(val) as any);
                  }}
                  className="pl-7"
                />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Estado de conservación</Label>
              <span className="text-sm font-medium">
                {form.estado_conservacion} / 5
              </span>
            </div>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[form.estado_conservacion]}
              onValueChange={([v]) => update("estado_conservacion", v)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="etiquetas">Etiquetas</Label>
            <div className="flex gap-2">
              <Input
                id="etiquetas"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(tagInput)
                  }
                }}
                placeholder="Escribe y pulsa Enter"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => addTag(tagInput)}
                aria-label="Añadir etiqueta"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {form.etiquetas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.etiquetas.map((tag) => (
                  <Badge key={tag} variant="default" className="gap-1">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Quitar ${tag}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ETIQUETAS_SUGERIDAS.filter(
                (t) => !form.etiquetas.includes(t),
              ).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_imagen">Imagen</Label>
            <div className="relative">
              <ImageIcon
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="url_imagen"
                value={
                  form.url_imagen.startsWith("data:") ? "" : form.url_imagen
                }
                onChange={(e) => update("url_imagen", e.target.value)}
                placeholder="Pega una URL de foto..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted">
                <Upload className="size-4" aria-hidden="true" />
                Subir imagen local
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
              {form.url_imagen && (
                <img
                  src={form.url_imagen || "/placeholder.svg"}
                  alt="Vista previa"
                  className="size-12 rounded-md border border-border object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
            <div>
              <Label htmlFor="disponible" className="cursor-pointer">
                Disponible
              </Label>
              <p className="text-xs text-muted-foreground">
                Visible y reservable por la comunidad.
              </p>
            </div>
            <Switch
              id="disponible"
              checked={form.disponible}
              onCheckedChange={(v) => update("disponible", v)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar cambios" : "Publicar objeto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
