import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { DEMO_SCREENS } from '../data/content'
import { TONE_RGB } from '../lib/tones'
import { gsap } from '../lib/gsap'
import { useGsapScope } from '../hooks/useGsapScope'
import { ScreenshotFrame } from './ui/ScreenshotFrame'
import { SectionHeading } from './ui/SectionHeading'

export function ProductDemoSection() {
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)
  const [active, setActive] = useState(0)
  // Reinicia o preenchimento ao clicar no trecho que já está ativo
  const [cycle, setCycle] = useState(0)
  const [hover, setHover] = useState(false)
  const [keyboardFocus, setKeyboardFocus] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [offscreen, setOffscreen] = useState(true)
  const paused = hover || keyboardFocus || hidden || offscreen

  const count = DEMO_SCREENS.length
  const next = () => setActive((i) => (i + 1) % count)
  const goTo = (i: number) => {
    setActive(i)
    setCycle((c) => c + 1)
  }

  // O avanço sai do fim da animação da linha do tempo; aqui só se decide quando ela deve estar parada
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    const el = ref.current
    const io = el ? new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { threshold: 0.3 }) : null
    if (el) io?.observe(el)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      io?.disconnect()
    }
  }, [])

  useGsapScope(ref, {
    full: (root) => {
      const device = root.querySelector('[data-demo-device]')
      if (!device) return
      // O notebook "chega" com profundidade conforme a seção entra na tela
      gsap.fromTo(
        device,
        { scale: 0.9, yPercent: 6 },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top 85%', end: 'center 60%', scrub: 0.6 },
        },
      )
    },
  })

  // Transição suave ao trocar de módulo (respeita prefers-reduced-motion)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!stageRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(stageRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
    return () => {
      tween.kill()
    }
  }, [active])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = count - 1
    let target = active
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = active === 0 ? last : active - 1
    else if (e.key === 'Home') target = 0
    else if (e.key === 'End') target = last
    else return
    e.preventDefault()
    goTo(target)
    document.getElementById(`demo-tab-${target}`)?.focus()
  }

  const current = DEMO_SCREENS[active]

  return (
    <section
      id="demonstracao"
      ref={ref}
      aria-labelledby="demo-title"
      className="relative isolate overflow-hidden bg-ink-950 py-20 sm:py-24"
      style={{ '--tone': TONE_RGB[current.tone], '--wash-x': '50%' } as CSSProperties}
    >
      {/* A luz da seção acompanha o módulo aberto */}
      <div className="tone-wash pointer-events-none absolute inset-x-0 bottom-0 top-1/3 -z-10 transition-opacity" aria-hidden="true" />
      <div
        className="mx-auto max-w-7xl px-5 sm:px-8"
        // Foco por teclado pausa a sequência; foco por clique não (senão ela pararia depois de qualquer clique)
        onFocusCapture={(e) => setKeyboardFocus((e.target as HTMLElement).matches(':focus-visible'))}
        onBlurCapture={() => setKeyboardFocus(false)}
      >
        <SectionHeading
          id="demo-title"
          title="Demonstração"
          subtitle="Veja o Buffet Manager em uso"
          description="Navegue pelos módulos e entenda como o sistema organiza a rotina antes de entrar em contato."
        />

        {/* Linha do tempo: um trecho por módulo; o ativo se preenche em 6s e, ao terminar, passa para o próximo */}
        <div
          role="tablist"
          aria-label="Módulos do sistema"
          onKeyDown={onKeyDown}
          className="mx-auto mt-10 flex max-w-3xl gap-1.5"
          data-reveal
        >
          {DEMO_SCREENS.map((screen, index) => {
            const selected = index === active
            const color = `rgb(${TONE_RGB[screen.tone]})`
            return (
              <button
                key={screen.name}
                id={`demo-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="demo-panel"
                aria-label={screen.label}
                tabIndex={selected ? 0 : -1}
                onClick={() => goTo(index)}
                className="group flex h-11 flex-1 items-center rounded-sm"
              >
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-ink-600 transition-[height,background-color] group-hover:bg-ink-500 group-focus-visible:h-1.5">
                  {index < active ? (
                    <span className="absolute inset-0 rounded-full" style={{ backgroundColor: color }} />
                  ) : null}
                  {selected ? (
                    <span
                      key={cycle}
                      className="timeline-fill absolute inset-0 rounded-full"
                      style={{ backgroundColor: color, animationPlayState: paused ? 'paused' : 'running' }}
                      onAnimationEnd={next}
                    />
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
        <p
          aria-live="polite"
          className="mt-1 text-center text-sm font-medium"
          style={{ color: `rgb(${TONE_RGB[current.tone]})` }}
        >
          {current.label}
        </p>

        <div
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`demo-tab-${active}`}
          tabIndex={0}
          className="mx-auto mt-10 max-w-5xl rounded-lg"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div data-demo-device>
            <div ref={stageRef}>
              <ScreenshotFrame key={current.name} name={current.name} alt={current.alt} label={current.label} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
