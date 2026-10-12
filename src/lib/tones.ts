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
/** Latão: a luz do cloche. Cor única de todos os blocos. */
export const BRASS_RGB = '226 183 104'

/**
 * Luz de cada bloco. Todos os tons usam o latão: os blocos mantêm as chaves por tom (para o código não mudar),
 * mas o site tem uma só cor de destaque. Para voltar a ter uma cor por bloco, troque os valores abaixo.
 */
export const TONE_RGB: Record<Tone, string> = {
  indigo: BRASS_RGB,
  fuchsia: BRASS_RGB,
  violet: BRASS_RGB,
  emerald: BRASS_RGB,
  amber: BRASS_RGB,
}
