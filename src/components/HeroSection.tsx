import { useLayoutEffect, useRef, type RefObject } from 'react'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { CONTACT_HREF } from '../config/site'
import { gsap } from '../lib/gsap'
import { BuffetScene } from './three/BuffetScene'
import { Button } from './ui/Button'
import { TextType } from './ui/TextType'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)

  useHeroEntrance(ref)

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-ink-950 pt-28 pb-16 sm:pt-32 lg:pb-16 lg:pt-28"
    >
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-ink-900"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            data-hero-text
            className="text-5xl font-semibold leading-[1.08] text-balance sm:text-6xl lg:text-7xl"
          >
            <span className="sr-only">Chega de planilha e papel solto para controlar seus orçamentos, contratos e utensílios.</span>
            <span aria-hidden="true">
              Chega de planilha e papel solto para controlar seus <TextType words={['orçamentos.', 'contratos.', 'utensílios.']} />
            </span>
          </h1>
          <p data-hero-text className="mt-6 text-lg leading-relaxed text-mist-400">
            Do orçamento ao contrato, da equipe do dia da festa à conferência dos utensílios: um único fluxo para o seu
            buffet.
          </p>
          <div data-hero-text className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={CONTACT_HREF} size="lg">
              Teste grátis por 1 mês
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button href="#demonstracao" variant="secondary" size="lg">
              <PlayCircle className="size-4" aria-hidden="true" />
              Veja como funciona
            </Button>
          </div>
          <p data-hero-text className="mt-4 text-sm text-mist-500">
            1 mês grátis, sem cartão de crédito. O botão abre uma conversa no WhatsApp.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-2xl px-1 sm:px-6 lg:max-w-none lg:px-4">
          <div data-hero-visual className="relative h-[22rem] w-full sm:h-[28rem] lg:h-[34rem]">
            <BuffetScene />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Animação de entrada do hero. Respeita prefers-reduced-motion e é desfeita na desmontagem. */
function useHeroEntrance(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(gsap.utils.toArray('[data-hero-text]', root), { opacity: 0, y: 24, duration: 0.8, stagger: 0.12 })
        .from(root.querySelector('[data-hero-visual]'), { opacity: 0, y: 48, scale: 0.97, duration: 1.1 }, 0.25)
    })
    return () => mm.revert()
  }, [scope])
}
