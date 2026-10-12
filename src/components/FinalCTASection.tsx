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
        <div className="relative">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            Teste o Buffet Manager por 1 mês, no seu próximo evento.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist-300">
            Veja o orçamento, o contrato e a conferência de utensílios funcionando na sua rotina, sem pagar nada.
          </p>
          <ol className="mx-auto mt-8 grid max-w-2xl gap-3 text-left text-sm text-mist-300 sm:grid-cols-3">
            {['Toque no botão e chame no WhatsApp.', 'Combine com a gente o início do teste.', 'Use o sistema por 1 mês, grátis.'].map(
              (step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="font-semibold text-brass-400" aria-hidden="true">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ),
            )}
          </ol>
          <div className="mt-9">
            <Button href={CONTACT_HREF} size="lg">
              Pedir teste grátis no WhatsApp
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <p className="mt-4 text-sm text-mist-400">Sem cartão de crédito.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
