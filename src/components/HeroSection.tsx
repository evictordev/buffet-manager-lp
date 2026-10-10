import { useLayoutEffect, useRef, type RefObject } from 'react'
import { ArrowRight, Banknote, CalendarDays, FileText, PlayCircle, Users, type LucideIcon } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useGsapScope } from '../hooks/useGsapScope'
import { BuffetScene } from './three/BuffetScene'
import { Button } from './ui/Button'
import { HeroCard } from './ui/HeroCard'
import { TextType } from './ui/TextType'

// Posições (≥ sm) em quatro cantos, deixando o centro livre para a peça 3D.
const CHIPS: { icon: LucideIcon; title: string; caption: string; position: string }[] = [
  { icon: CalendarDays, title: 'Eventos', caption: 'Organize e acompanhe', position: 'sm:left-0 sm:top-[8%]' },
  { icon: FileText, title: 'Orçamentos', caption: 'Propostas comerciais', position: 'sm:right-0 sm:top-[8%]' },
  { icon: Users, title: 'Profissionais', caption: 'Equipe centralizada', position: 'sm:left-0 sm:bottom-[8%]' },
  { icon: Banknote, title: 'Folha de pagamento', caption: 'Dados dos profissionais', position: 'sm:right-0 sm:bottom-[8%]' },
]

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)

  useGsapScope(ref, {
    reveals: false,
    // Flutuação e parallax: só em telas ≥ 768px e sem prefers-reduced-motion
    full: (root) => {
      const visual = root.querySelector('[data-hero-visual]')
      const chips = gsap.utils.toArray<HTMLElement>('[data-hero-chip]', root)

      chips.forEach((chip, i) => {
        gsap.to(chip, {
          y: i % 2 === 0 ? -4 : 4,
          duration: 3.6 + i * 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        })
      })

      if (visual) {
        gsap.to(visual, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      }
    },
  })

  useHeroEntrance(ref)

  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ink-950 pt-28 pb-16 sm:pt-32 lg:pb-24 lg:pt-40"
    >
      <div
        className="pointer-events-none absolute -left-40 top-0 size-[34rem] rounded-full bg-fuchsia-700/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-40 size-[34rem] rounded-full bg-indigo-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            data-hero-text
            className="text-4xl font-semibold leading-[1.08] text-balance sm:text-5xl lg:text-[3.5rem]"
          >
            <span className="sr-only">Seu buffet merece uma gestão à altura dos seus eventos.</span>
            <span aria-hidden="true">
              Seu buffet merece uma gestão à altura dos seus <TextType words={['eventos.', 'orçamentos.', 'clientes.']} />
            </span>
          </h1>
          <p data-hero-text className="mt-6 text-lg leading-relaxed text-mist-400">
            Gerencie eventos, orçamentos, contratos, profissionais e clientes em um só lugar. Simplifique sua rotina e
            tenha mais controle sobre cada detalhe do seu buffet.
          </p>
          <div data-hero-text className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#funcionalidades" size="lg">
              Conheça as funcionalidades
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button href="#demonstracao" variant="secondary" size="lg">
              <PlayCircle className="size-4" aria-hidden="true" />
              Veja como funciona
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl px-1 sm:px-6 lg:max-w-none lg:px-4">
          <div data-hero-visual className="relative h-[22rem] w-full sm:h-[28rem] lg:h-[34rem]">
            <BuffetScene />
          </div>

          {/* Mobile: grade 2×2 abaixo da cena. ≥ sm: cards ao redor da peça 3D. */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:contents">
            {CHIPS.map(({ icon, title, caption, position }) => (
              <div key={title} data-hero-chip className={`min-w-0 sm:absolute ${position}`}>
                <HeroCard icon={icon} title={title} caption={caption} />
              </div>
            ))}
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
        .from(gsap.utils.toArray('[data-hero-chip]', root), { opacity: 0, scale: 0.85, duration: 0.7, stagger: 0.12 }, 0.8)
    })
    return () => mm.revert()
  }, [scope])
}
