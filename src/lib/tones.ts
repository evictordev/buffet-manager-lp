/** Cores de destaque do sistema usadas nos ícones (classes completas para o Tailwind detectar). */
export type Tone = 'fuchsia' | 'indigo' | 'emerald' | 'amber' | 'violet'

export const TILE: Record<Tone, string> = {
  fuchsia: 'bg-fuchsia-600 shadow-[0_8px_24px_-8px_rgb(192_38_211/0.7)]',
  indigo: 'bg-indigo-600 shadow-[0_8px_24px_-8px_rgb(79_70_229/0.7)]',
  emerald: 'bg-emerald-500 shadow-[0_8px_24px_-8px_rgb(16_185_129/0.7)]',
  amber: 'bg-amber-500 shadow-[0_8px_24px_-8px_rgb(245_158_11/0.7)]',
  violet: 'bg-violet-600 shadow-[0_8px_24px_-8px_rgb(124_58_237/0.7)]',
}

export const TONE_CYCLE: Tone[] = ['fuchsia', 'indigo', 'emerald', 'amber']

/**
 * Luz de cada bloco: tripla RGB dos tons do sistema em versão clara (contraste sobre o navy),
 * usada como variável CSS `--tone` (ver `.tone-wash` e `.tone-card` em index.css).
 */
export const TONE_RGB: Record<Tone, string> = {
  indigo: '129 140 248',
  fuchsia: '232 121 249',
  violet: '167 139 250',
  emerald: '52 211 153',
  amber: '251 191 36',
}

/** Latão: luz do cloche, para o fecho da página. */
export const BRASS_RGB = '226 183 104'
