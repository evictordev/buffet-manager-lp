import { useRef } from 'react'
import { FEATURE_GROUPS } from '../data/content'
import { useGsapScope } from '../hooks/useGsapScope'
import { BlurText } from './ui/BlurText'
import { FeatureShowcase } from './FeatureShowcase'

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)

  return (
    <section id="funcionalidades" ref={ref} aria-labelledby="funcionalidades-title" className="bg-ink-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="relative flex flex-col items-center">
          <h2
            id="funcionalidades-title"
            className="relative max-w-3xl text-balance text-center text-4xl font-semibold leading-tight sm:text-[2.75rem]"
          >
            <BlurText
              text="A rotina do seu buffet, organizada do começo ao fim"
              delay={22}
              direction="bottom"
            />
          </h2>
        </div>

        <div className="mt-20 flex flex-col gap-20 sm:gap-28">
          {FEATURE_GROUPS.map((group, index) => (
            <FeatureShowcase key={group.id} group={group} reverse={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
