/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_WHATSAPP_MESSAGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
