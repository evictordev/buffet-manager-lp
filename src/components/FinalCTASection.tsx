import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { CONTACT_HREF } from '../config/site'
import { useGsapScope } from '../hooks/useGsapScope'
import { Button } from './ui/Button'

export function FinalCTASection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)

  return (
    <section id="contato" ref={ref} aria-labelledby="cta-title" className="bg-ink-950 px-5 py-20 sm:px-8 sm:py-24">
      <div
        data-reveal
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-ink-500 bg-ink-800 px-6 py-16 text-center sm:px-14 sm:py-20"
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-fuchsia-700/30 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full bg-indigo-600/30 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            Leve a gestão do seu buffet para um novo nível.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist-300">
            Organize sua operação, acompanhe seus eventos e tenha mais controle sobre a rotina do seu negócio com o
            Buffet Manager.
          </p>
          <div className="mt-9">
            <Button href={CONTACT_HREF} size="lg">
              Quero conhecer o Buffet Manager
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
