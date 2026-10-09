import { useLayoutEffect, useRef, type RefObject } from 'react'
import { ArrowRight, Banknote, CalendarDays, FileText, PlayCircle, Users, type LucideIcon } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { TILE, type Tone } from '../lib/tones'
import { useGsapScope } from '../hooks/useGsapScope'
import { BuffetScene } from './three/BuffetScene'
import { Button } from './ui/Button'

const CHIPS: { icon: LucideIcon; tone: Tone; title: string; caption: string; position: string }[] = [
  { icon: CalendarDays, tone: 'fuchsia', title: 'Eventos', caption: 'Organize e acompanhe', position: 'left-0 top-[10%] sm:-left-4' },
  { icon: FileText, tone: 'indigo', title: 'Orçamentos', caption: 'Propostas comerciais', position: 'right-0 top-[2%] sm:-right-3' },
  { icon: Banknote, tone: 'emerald', title: 'Folha de pagamento', caption: 'Dados dos profissionais', position: 'right-0 bottom-[18%] sm:-right-5' },
  { icon: Users, tone: 'amber', title: 'Profissionais', caption: 'Equipe centralizada', position: 'left-0 bottom-[6%] sm:-left-2' },
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
          y: i % 2 === 0 ? -10 : 10,
          duration: 2.6 + i * 0.35,
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
          <p
            data-hero-text
            className="inline-flex items-center gap-2 rounded-full border border-ink-500 bg-ink-800 px-3.5 py-1.5 text-sm font-medium text-mist-300"
          >
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Sistema de gestão para buffets de eventos
          </p>
          <h1
            id="hero-title"
            data-hero-text
            className="mt-6 text-4xl font-semibold leading-[1.08] text-balance sm:text-5xl lg:text-[3.5rem]"
          >
            Seu buffet mais organizado. Seus eventos sob controle.
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

          {CHIPS.map(({ icon: Icon, tone, title, caption, position }) => (
            <div
              key={title}
              data-hero-chip
              className={`absolute hidden items-center gap-3 rounded-xl border border-ink-500 bg-ink-800/90 px-3.5 py-2.5 shadow-float backdrop-blur sm:flex ${position}`}
            >
              <span className={`flex size-9 items-center justify-center rounded-lg text-white ${TILE[tone]}`} aria-hidden="true">
                <Icon className="size-[18px]" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs text-mist-400">{caption}</span>
              </span>
            </div>
          ))}
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
