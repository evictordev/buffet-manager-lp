import type { LucideIcon } from 'lucide-react'
import type { PointerEvent } from 'react'

type HeroCardProps = {
  icon: LucideIcon
  title: string
  caption: string
}

/**
 * Card compacto do hero: uma única superfície de vidro escuro, borda fina e
 * um brilho lilás que segue o ponteiro no hover (referência: Magic Card).
 */
export function HeroCard({ icon: Icon, title, caption }: HeroCardProps) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div onPointerMove={onMove} className="hero-card w-full min-w-0 sm:w-max sm:max-w-[16rem]">
      <Icon className="relative size-5 shrink-0 text-violet-200/90" strokeWidth={1.25} aria-hidden="true" />
      <span className="relative min-w-0 leading-tight">
        <span className="block text-sm font-medium tracking-tight text-white">{title}</span>
        <span className="mt-0.5 block text-xs text-mist-400">{caption}</span>
      </span>
    </div>
  )
}
