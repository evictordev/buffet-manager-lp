import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselSlide = {
  label: string
  /** Recebe se o slide está ativo (usado para tocar/pausar vídeos). */
  render: (active: boolean) => ReactNode
}

type Props = { slides: CarouselSlide[]; ariaLabel: string }

/**
 * Carrossel de blocos inteiros: ao passar para o lado, o slide inteiro (texto e imagens)
 * dá lugar ao próximo, um componente de cada vez (animação em src/index.css). Slides inativos ficam inertes e escondidos para leitores de tela.
 */
export function MediaCarousel({ slides, ariaLabel }: Props) {
  const [active, setActive] = useState(0)
  const count = slides.length
  const go = (i: number) => setActive((i + count) % count)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(active - 1)
    if (e.key === 'ArrowRight') go(active + 1)
  }

  const arrow =
    'absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-950/70 text-white backdrop-blur transition-colors hover:border-violet-300/50 hover:bg-ink-950/90'

  return (
    <div role="group" aria-roledescription="carrossel" aria-label={ariaLabel} onKeyDown={onKeyDown} className="relative">
      <div className="carousel-stage grid overflow-x-clip">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}: ${slide.label}`}
            aria-hidden={i !== active}
            inert={i !== active}
            data-state={i === active ? 'active' : i < active ? 'before' : 'after'}
            className="carousel-slide col-start-1 row-start-1 flex flex-col justify-center"
          >
            {slide.render(i === active)}
          </div>
        ))}
      </div>

      <button type="button" onClick={() => go(active - 1)} aria-label="Slide anterior" className={`${arrow} left-0 sm:-left-5 lg:-left-7 2xl:-left-20`}>
        <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => go(active + 1)} aria-label="Próximo slide" className={`${arrow} right-0 sm:-right-5 lg:-right-7 2xl:-right-20`}>
        <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>

      <div className="mt-8 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir para ${slide.label}`}
            aria-current={i === active}
            className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-violet-300' : 'w-2 bg-ink-500 hover:bg-mist-500'}`}
          />
        ))}
      </div>
    </div>
  )
}

/** Vídeo em moldura de navegador. Toca (mudo, em loop) só quando o slide está ativo. */
export function VideoSlide({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (active && !reduced) void video.play().catch(() => {})
    else video.pause()
  }, [active, reduced])

  return (
    <div data-carousel-item style={{ '--i': 0 } as React.CSSProperties} className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-ink-500 bg-ink-800 shadow-device">
      <div className="flex items-center gap-1.5 border-b border-ink-600 bg-ink-700 px-4 py-2.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-ink-500" />
        <span className="size-2.5 rounded-full bg-ink-500" />
        <span className="size-2.5 rounded-full bg-ink-500" />
      </div>
      <video
        ref={ref}
        src={src}
        aria-label={alt}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduced}
        className="aspect-[16/10] w-full bg-ink-900 object-cover object-top"
      />
    </div>
  )
}
