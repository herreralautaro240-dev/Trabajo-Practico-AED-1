export type Modalidad = "alquiler" | "intercambio"

export interface Product {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  etiquetas: string[]
  modalidad: Modalidad
  costo_alquiler: number
  estado_conservacion: number // 1 al 5
  url_imagen: string
  disponible: boolean
  creador_id: string
}

// Rango de precios en pesos argentinos (ARS) por día
export const MAX_PRICE = 12000
export const PRICE_STEP = 500

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

export function formatARS(amount: number) {
  return currencyFormatter.format(amount)
}

export const CATEGORIAS = [
  "Movilidad",
  "Herramientas",
  "Camping",
  "Electrónica",
  "Libros",
  "Hogar",
] as const

export const ETIQUETAS_SUGERIDAS = [
  "eco",
  "exterior",
  "urbano",
  "vintage",
  "premium",
  "familiar",
  "profesional",
  "ligero",
  "reciclado",
  "compacto",
]

export function generateId() {
  return "ECO-" + Math.random().toString(36).slice(2, 7).toUpperCase()
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: "ECO-BIKE1",
    nombre: "Bicicleta urbana reacondicionada",
    descripcion:
      "Bicicleta de ciudad restaurada con cuadro de aluminio verde menta. Ideal para trayectos diarios y compras de fin de semana.",
    categoria: "Movilidad",
    etiquetas: ["urbano", "eco", "ligero"],
    modalidad: "alquiler",
    costo_alquiler: 2500,
    estado_conservacion: 4,
    url_imagen: "/products/bicicleta.png",
    disponible: true,
    creador_id: "u-lautaro",
  },
  {
    id: "ECO-DRIL1",
    nombre: "Taladro eléctrico inalámbrico",
    descripcion:
      "Taladro percutor con batería de litio y dos velocidades. Perfecto para proyectos de bricolaje y montaje de muebles.",
    categoria: "Herramientas",
    etiquetas: ["profesional", "compacto"],
    modalidad: "alquiler",
    costo_alquiler: 1800,
    estado_conservacion: 5,
    url_imagen: "/products/taladro.png",
    disponible: true,
    creador_id: "u-lautaro",
  },
  {
    id: "ECO-TENT1",
    nombre: "Carpa de camping para 2 personas",
    descripcion:
      "Carpa impermeable de montaje rápido con doble techo. Liviana y fácil de transportar para escapadas al aire libre.",
    categoria: "Camping",
    etiquetas: ["exterior", "familiar", "ligero"],
    modalidad: "alquiler",
    costo_alquiler: 3500,
    estado_conservacion: 4,
    url_imagen: "/products/carpa.png",
    disponible: true,
    creador_id: "u-martina",
  },
  {
    id: "ECO-CAM01",
    nombre: "Cámara analógica vintage",
    descripcion:
      "Cámara de carrete de los años 80 totalmente funcional. Para intercambiar con otros amantes de la fotografía analógica.",
    categoria: "Electrónica",
    etiquetas: ["vintage", "premium"],
    modalidad: "intercambio",
    costo_alquiler: 0,
    estado_conservacion: 3,
    url_imagen: "/products/camara.png",
    disponible: true,
    creador_id: "u-diego",
  },
  {
    id: "ECO-BOOK1",
    nombre: "Lote de libros de segunda mano",
    descripcion:
      "Colección de 8 novelas en muy buen estado. Disponible para intercambio por otros títulos de literatura.",
    categoria: "Libros",
    etiquetas: ["reciclado", "eco"],
    modalidad: "intercambio",
    costo_alquiler: 0,
    estado_conservacion: 4,
    url_imagen: "/products/libros.png",
    disponible: false,
    creador_id: "u-lautaro",
  },
  {
    id: "ECO-PROJ1",
    nombre: "Proyector de cine en casa",
    descripcion:
      "Proyector LED Full HD con entrada HDMI. Ideal para noches de película o presentaciones puntuales.",
    categoria: "Electrónica",
    etiquetas: ["premium", "familiar"],
    modalidad: "alquiler",
    costo_alquiler: 5000,
    estado_conservacion: 5,
    url_imagen: "/products/proyector.png",
    disponible: true,
    creador_id: "u-martina",
  },
]
