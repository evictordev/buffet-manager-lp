import { useRef } from 'react'
import { DIFFERENTIALS } from '../data/content'
import { TILE, TONE_CYCLE } from '../lib/tones'
import { useGsapScope } from '../hooks/useGsapScope'
import { SectionHeading } from './ui/SectionHeading'

export function DifferentialsSection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)

  return (
    <section id="diferenciais" ref={ref} aria-labelledby="diferenciais-title" className="bg-ink-900 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="diferenciais-title"
            align="left"
            eyebrow="Diferenciais"
            title="Um sistema feito para a administração de buffets"
            description="O Buffet Manager reúne as áreas do dia a dia em uma só interface, para que a informação certa esteja sempre ao alcance."
          />
        </div>

        <ul data-stagger className="grid gap-4">
          {DIFFERENTIALS.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              data-stagger-item
              className="flex items-start gap-5 rounded-2xl border border-ink-600 bg-ink-800 p-5 shadow-soft transition-colors hover:border-violet-400/50 sm:p-6"
            >
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-white ${TILE[TONE_CYCLE[index % TONE_CYCLE.length]]}`}
                aria-hidden="true"
              >
                <Icon className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold tabular-nums text-violet-300" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1 leading-relaxed text-mist-400">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
