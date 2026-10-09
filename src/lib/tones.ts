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
