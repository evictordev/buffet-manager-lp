import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  id?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'center', id }: Props) {
  const center = align === 'center'
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`} data-reveal>
      <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold leading-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-mist-400">{description}</p> : null}
    </div>
  )
}
