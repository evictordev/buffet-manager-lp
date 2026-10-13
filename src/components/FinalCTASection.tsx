import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { CONTACT_HREF } from '../config/site'
import { BRASS_RGB } from '../lib/tones'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useGsapScope } from '../hooks/useGsapScope'
import { Button } from './ui/Button'

export function FinalCTASection() {
  const ref = useRef<HTMLElement>(null)
  useGsapScope(ref)
  useClocheOpening(ref)

  return (
    <section
      id="contato"
      ref={ref}
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-ink-950 px-5 py-28 sm:px-8 sm:py-36"
      style={{ '--tone': BRASS_RGB, '--wash-x': '50%' } as CSSProperties}
    >
      {/* Fecho em latão: a luz quente do cloche */}
      <div className="tone-wash pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <Cloche />
        <h2 id="cta-title" className="text-[2rem] font-semibold leading-[1.1] text-balance sm:text-5xl">
          Teste o Buffet Manager por 1 mês, no seu próximo evento.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-mist-300">
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
        <div className="mt-10">
          <Button href={CONTACT_HREF} size="lg">
            Teste grátis por 1 mês
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Button>
          <p className="mt-4 text-sm text-mist-400">Sem cartão de crédito.</p>
        </div>
      </div>
    </section>
  )
}

/**
 * O gesto do hero, no fim da página: o cloche (em traço de latão) abre e a luz aparece por baixo.
 * O estado padrão do SVG já é o cloche aberto, então sem JS ou com prefers-reduced-motion ele fica estático e visível.
 */
function Cloche() {
  return (
    <div className="relative mx-auto mb-10 h-20 w-40" aria-hidden="true">
      <div
        data-cloche-glow
        className="absolute bottom-[9px] left-1/2 h-6 w-[100%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(240_212_154/0.22),rgb(226_183_104/0.06)_45%,transparent_70%)] blur-md"
      />
      <svg viewBox="0 0 120 70" fill="none" className="relative size-full overflow-visible text-brass-400">
        <g data-cloche-lid style={{ transform: 'translateY(-14px) rotate(-5deg)', transformOrigin: '22px 62px' }}>
          <path
            d="M20 62C20 38 38 25 60 25s40 13 40 37"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M16 62h88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="60" cy="20" r="3.5" fill="currentColor" />
        </g>
        <path d="M6 62h108" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Vapor: três fios finos que saem do vão entre a tampa e a bandeja; só aparecem com movimento permitido */}
        <g data-cloche-steam stroke="rgb(240 212 154)" strokeWidth="1.2" strokeLinecap="round" fill="none">
          <path data-steam opacity="0" d="M50 56c-3-5 3-8 0-13s3-8 0-13" />
          <path data-steam opacity="0" d="M66 56c3-5-3-8 0-13s-3-8 0-13" />
          <path data-steam opacity="0" d="M82 56c-3-5 3-8 0-13s3-8 0-13" />
        </g>
      </svg>
    </div>
  )
}

/** Quando o CTA entra na tela, o cloche passa de fechado para aberto, uma vez por visita. */
function useClocheOpening(scope: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return
    const lid = root.querySelector('[data-cloche-lid]')
    const glow = root.querySelector('[data-cloche-glow]')
    const steam = root.querySelectorAll('[data-steam]')
    if (!lid || !glow) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Parte do cloche fechado (tampa sobre a bandeja, sem luz) e abre quando o bloco chega à tela
      gsap.set(lid, { y: 0, rotation: 0, svgOrigin: '22 62' })
      gsap.set(glow, { opacity: 0, scaleX: 0.6 })
      gsap.set(steam, { opacity: 0, y: 4 })
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true }, defaults: { ease: 'power3.out' } })
        .to(lid, { y: -14, rotation: -5, duration: 1.1 }, 0.15)
        .to(glow, { opacity: 1, scaleX: 1, duration: 1.4 }, 0.3)

      // Vapor discreto: cada fio sobe, some e recomeça, defasado dos outros. Só corre enquanto o bloco está na tela.
      const rise = gsap.timeline({ paused: true, delay: 1.2 })
      steam.forEach((el, i) => {
        rise.to(
          el,
          {
            keyframes: [
              { opacity: 0.45, y: -4, duration: 1.1, ease: 'sine.out' },
              { opacity: 0, y: -16, duration: 2.1, ease: 'sine.in' },
            ],
            repeat: -1,
            repeatDelay: 0.4,
          },
          i * 0.9,
        )
      })
      ScrollTrigger.create({
        trigger: root,
        start: 'top 65%',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? rise.play() : rise.pause()),
      })
    })
    return () => mm.revert()
  }, [scope])
}
