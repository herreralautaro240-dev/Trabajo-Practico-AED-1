export interface ChatMessage {
  id: string
  from: "me" | "owner"
  texto: string
  timestamp: number
}

export interface Conversation {
  key: string
  ownerId: string
  productId: string
  messages: ChatMessage[]
}

export function conversationKey(ownerId: string, productId: string) {
  return `${ownerId}::${productId}`
}

export function messageId() {
  return "m-" + Math.random().toString(36).slice(2, 9)
}

// Simulación de respuesta automática del dueño según el contexto del mensaje
export function generateOwnerReply(
  ownerName: string,
  productName: string,
  modalidad: "alquiler" | "intercambio",
  userText: string,
): string {
  const text = userText.toLowerCase()
  const firstName = ownerName.split(" ")[0]

  if (/(hola|buenas|buen día|qué tal|que tal)/.test(text)) {
    return `¡Hola! Soy ${firstName}. Gracias por tu interés en "${productName}". ¿En qué te puedo ayudar?`
  }
  if (/(disponible|disponibilidad|libre|fecha|cuándo|cuando)/.test(text)) {
    return `Sí, "${productName}" está disponible. Decime para qué fechas lo necesitás y lo coordinamos.`
  }
  if (/(precio|cuánto|cuanto|costo|sale|vale|barato)/.test(text)) {
    return modalidad === "alquiler"
      ? `El precio publicado es por día, pero si lo tomás por varios días te hago un descuento. ¿Cuántos días serían?`
      : `Este objeto es para intercambio. ¿Qué tendrías para ofrecer a cambio?`
  }
  if (/(intercambio|cambio|canje|trueque)/.test(text)) {
    return `¡Me encanta la idea del intercambio! Contame qué tenés y vemos si llegamos a un acuerdo.`
  }
  if (/(dónde|donde|zona|barrio|retiro|entrega|envío|envio)/.test(text)) {
    return `Estoy en zona céntrica y podemos coordinar la entrega o el retiro sin problema. ¿Te queda cómodo?`
  }
  if (/(gracias|genial|perfecto|dale|listo|ok)/.test(text)) {
    return `¡Genial! Quedo atento entonces. Cualquier cosa me escribís por acá.`
  }
  return `Gracias por tu mensaje sobre "${productName}". En breve te paso todos los detalles. ¿Querés coordinar para verlo?`
}
