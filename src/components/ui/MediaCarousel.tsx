import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselSlide = {
  label: string
  /** Recebe se o slide está ativo (usado para tocar/pausar vídeos). */
  render: (active: boolean) => ReactNode
}

type Props = {
  slides: CarouselSlide[]
  ariaLabel: string
  /** Slide ativo; controlado por quem renderiza, para as setas laterais poderem ficar fora do carrossel. */
  active: number
  onChange: (index: number) => void
}

/**
 * Carrossel de blocos: ao passar para o lado, o slide inteiro dá lugar ao próximo, um componente de cada vez
 * (animação em src/index.css). Slides inativos ficam inertes e escondidos para leitores de tela.
 * Aqui ficam os pontos e as setas do celular; as setas laterais (sm+) são do bloco que contém o carrossel.
 */
export function MediaCarousel({ slides, ariaLabel, active, onChange }: Props) {
  const count = slides.length
  const go = (i: number) => onChange((i + count) % count)

  const onKeyDown = (e: React.KeyboardEvent) => {
    // As setas dos controles do vídeo (buscar, volume) não trocam de slide
    if ((e.target as HTMLElement).closest('video')) return
    if (e.key === 'ArrowLeft') go(active - 1)
    if (e.key === 'ArrowRight') go(active + 1)
  }

  const dotArrow =
    'flex size-11 items-center justify-center rounded-full border border-white/15 bg-ink-800 text-white transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-brass-300/60 hover:bg-ink-700 hover:text-brass-300 hover:shadow-[0_8px_24px_-11px_rgb(226_183_104/0.35)]'

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

      <div className="mt-4 flex items-center justify-center gap-2">
        <button type="button" onClick={() => go(active - 1)} aria-label="Slide anterior" className={`${dotArrow} sm:hidden`}>
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ir para ${slide.label}`}
            aria-current={i === active}
            className="group flex h-11 items-center justify-center px-1.5"
          >
            <span
              aria-hidden="true"
              className={`h-2 rounded-full transition-all ${i === active ? 'w-6 bg-brass-300' : 'w-2 bg-ink-500 group-hover:bg-mist-500'}`}
            />
          </button>
        ))}
        <button type="button" onClick={() => go(active + 1)} aria-label="Próximo slide" className={`${dotArrow} sm:hidden`}>
          <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
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
        preload="none"
        poster={`${import.meta.env.BASE_URL}screenshots/dashboard.webp`}
        controls={reduced}
        className="aspect-video w-full bg-ink-900 object-contain"
      />
    </div>
  )
}
