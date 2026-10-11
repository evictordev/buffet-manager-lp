import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        // Sem número, todos os botões de contato abririam o WhatsApp sem destino: falha o build de produção.
        name: 'require-whatsapp-number',
        apply: 'build',
        buildStart() {
          if (mode === 'production' && !/\d/.test(env.VITE_WHATSAPP_NUMBER ?? '')) {
            this.error('VITE_WHATSAPP_NUMBER não configurado. Defina 55 + DDD + número (veja .env.example).')
          }
        },
      },
    ],
  }
})
