/**
 * Configurações centrais da landing page.
 * O destino dos botões de conversão vem de variáveis de ambiente (veja .env.example).
 */

const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')
const whatsappMessage =
  import.meta.env.VITE_WHATSAPP_MESSAGE ?? 'Olá! Quero conhecer o Buffet Manager.'

export const SITE = {
  name: 'Buffet Manager',
  description:
    'Sistema de gestão para buffets de eventos: eventos, orçamentos, contratos, profissionais, utensílios e clientes em um só lugar.',
  whatsappNumber,
  contactConfigured: whatsappNumber.length > 0,
}

/** Link do canal de contato (WhatsApp). Sem número configurado, o WhatsApp abre a escolha de contato. */
export const CONTACT_HREF = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

if (import.meta.env.DEV && !SITE.contactConfigured) {
  console.warn('[Buffet Manager] VITE_WHATSAPP_NUMBER não configurado. Veja .env.example.')
}

/** Endereço do sistema (login) para quem já é cliente. */
export const APP_HREF = 'https://app.buffetmaneger.tech'

/** Caminho das capturas de tela do sistema (public/screenshots/<nome>.webp). */
export const screenshot = (name: string) => `${import.meta.env.BASE_URL}screenshots/${name}.webp`

export const NAV_LINKS = [
  { id: 'funcionalidades', label: 'Funcionalidades' },
  { id: 'demonstracao', label: 'Demonstração' },
] as const
