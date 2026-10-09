import { useRef } from 'react'
import { BENEFITS } from '../data/content'
import { TILE, TONE_CYCLE } from '../lib/tones'
import { useGsapScope } from '../hooks/useGsapScope'
import { SectionHeading } from './ui/SectionHeading'

export function BenefitsSection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)

  return (
    <section id="beneficios" ref={ref} aria-labelledby="beneficios-title" className="bg-ink-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="beneficios-title"
          eyebrow="Benefícios"
          title="Menos improviso, mais clareza na operação"
          description="Um sistema pensado para a rotina de quem administra um buffet de eventos."
        />

        <ul data-stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              data-stagger-item
              className="rounded-2xl border border-ink-600 bg-ink-800 p-6 shadow-soft transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-violet-400/50"
            >
              <span
                className={`flex size-11 items-center justify-center rounded-xl text-white ${TILE[TONE_CYCLE[index % TONE_CYCLE.length]]}`}
                aria-hidden="true"
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-mist-400">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
