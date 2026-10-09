import { useRef } from 'react'
import { FEATURE_GROUPS } from '../data/content'
import { useGsapScope } from '../hooks/useGsapScope'
import { FeatureShowcase } from './FeatureShowcase'
import { SectionHeading } from './ui/SectionHeading'

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)

  return (
    <section id="funcionalidades" ref={ref} aria-labelledby="funcionalidades-title" className="bg-ink-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="funcionalidades-title"
          eyebrow="Funcionalidades"
          title="Tudo o que a rotina do buffet precisa, organizado por área"
          description="Cada grupo de recursos foi pensado para uma parte da operação, com telas do próprio sistema."
        />

        <nav aria-label="Categorias de funcionalidades" className="mt-8 flex flex-wrap justify-center gap-2" data-reveal>
          {FEATURE_GROUPS.map(({ id, eyebrow }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-ink-500 bg-ink-800 px-4 py-2 text-sm font-medium text-mist-300 transition-colors hover:border-violet-400/60 hover:bg-ink-700 hover:text-white"
            >
              {eyebrow}
            </a>
          ))}
        </nav>

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {FEATURE_GROUPS.map((group, index) => (
            <FeatureShowcase key={group.id} group={group} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
