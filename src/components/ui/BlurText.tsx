import { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  /** Intervalo entre letras, em ms. */
  delay?: number
  /** De onde as letras entram. */
  direction?: 'top' | 'bottom'
  className?: string
  /** Chamado uma vez, quando o texto entra na tela. */
  onVisible?: () => void
}

/**
 * Efeito "blur text" (React Bits), animando por letras: cada letra surge desfocada,
 * sobe e ganha nitidez em duas etapas. Dispara quando entra na tela, uma única vez.
 * Com prefers-reduced-motion, o texto aparece direto.
 */
export function BlurText({ text, delay = 60, direction = 'bottom', className = '', onVisible }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          onVisible?.()
          io.disconnect()
        }
      },
      // Só dispara quando o texto está de fato dentro da área visível
      { threshold: 0.5, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!visible || reduced) return
    const from = direction === 'top' ? -50 : 50
    const letters = ref.current?.querySelectorAll<HTMLElement>('[data-letter]')
    letters?.forEach((letter, i) => {
      letter.animate(
        [
          { filter: 'blur(10px)', opacity: 0, transform: `translateY(${from}px)` },
          { filter: 'blur(5px)', opacity: 0.5, transform: `translateY(${-from / 10}px)`, offset: 0.5 },
          { filter: 'blur(0px)', opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 700, delay: i * delay, easing: 'ease-out', fill: 'both' },
      )
    })
  }, [visible, reduced, direction, delay])

  return (
    <span ref={ref} aria-label={text} className={className}>
      {text.split(' ').map((word, w, words) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {word.split('').map((char, i) => (
            <span
              key={i}
              data-letter
              className="inline-block"
              // Antes de disparar, as letras ficam invisíveis (a animação assume depois)
              style={!visible && !reduced ? { opacity: 0 } : undefined}
            >
              {char}
            </span>
          ))}
          {w < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </span>
  )
}
