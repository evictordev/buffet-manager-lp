import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  id?: string
}

/** Cabeçalho de seção em três níveis: título, subtítulo e descrição. */
export function SectionHeading({ title, subtitle, description, align = 'center', id }: Props) {
  const center = align === 'center'
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`} data-reveal>
      <h2 id={id} className="text-4xl font-semibold leading-tight sm:text-[2.75rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-xl font-medium leading-snug text-balance text-mist-100 sm:text-2xl">{subtitle}</p>
      ) : null}
      {description ? <p className="mt-4 text-base leading-relaxed text-mist-400 sm:text-lg">{description}</p> : null}
    </div>
  )
}
