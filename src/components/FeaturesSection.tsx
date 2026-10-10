import { useRef, useState } from 'react'
import { FEATURE_GROUPS } from '../data/content'
import { useGsapScope } from '../hooks/useGsapScope'
import { BlurText } from './ui/BlurText'
import { FeatureShowcase } from './FeatureShowcase'

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)
  const [titleIn, setTitleIn] = useState(false)

  return (
    <section id="funcionalidades" ref={ref} aria-labelledby="funcionalidades-title" className="bg-ink-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative flex flex-col items-center">
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 h-40 w-[28rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[90px] transition-opacity duration-1000 ${titleIn ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden="true"
          />
          <h2
            id="funcionalidades-title"
            className="relative text-center text-4xl font-semibold leading-none tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]"
          >
            <BlurText text="Funcionalidades" delay={60} direction="bottom" onVisible={() => setTitleIn(true)} />
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
