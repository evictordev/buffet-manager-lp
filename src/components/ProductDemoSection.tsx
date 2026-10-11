import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { DEMO_SCREENS } from '../data/content'
import { gsap } from '../lib/gsap'
import { useGsapScope } from '../hooks/useGsapScope'
import { ScreenshotFrame } from './ui/ScreenshotFrame'
import { SectionHeading } from './ui/SectionHeading'

export function ProductDemoSection() {
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)
  const [active, setActive] = useState(0)

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
    const last = DEMO_SCREENS.length - 1
    let next = active
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    else return
    e.preventDefault()
    setActive(next)
    document.getElementById(`demo-tab-${next}`)?.focus()
  }

  const current = DEMO_SCREENS[active]

  return (
    <section id="demonstracao" ref={ref} aria-labelledby="demo-title" className="overflow-hidden bg-ink-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="demo-title"
          title="Demonstração"
          subtitle="Veja o Buffet Manager em uso"
          description="Navegue pelos módulos e entenda como o sistema organiza a rotina antes de entrar em contato."
        />

        <div
          role="tablist"
          aria-label="Módulos do sistema"
          onKeyDown={onKeyDown}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2"
          data-reveal
        >
          {DEMO_SCREENS.map((screen, index) => {
            const selected = index === active
            return (
              <button
                key={screen.name}
                id={`demo-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="demo-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? 'border-white bg-white text-ink-950'
                    : 'border-ink-500 bg-ink-800 text-mist-300 hover:border-brass-400/50 hover:bg-ink-700 hover:text-white'
                }`}
              >
                {screen.label}
              </button>
            )
          })}
        </div>

        <div
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`demo-tab-${active}`}
          tabIndex={0}
          className="mx-auto mt-12 max-w-5xl rounded-lg"
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
