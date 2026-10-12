import { useEffect, useRef, useState, type RefObject } from 'react'
import { CalendarDays, FileSignature, FileText, Package, type LucideIcon } from 'lucide-react'
import { gsap } from '../../lib/gsap'
import { screenshot } from '../../config/site'

export type FlowImage = { name: string; alt: string; label: string }

const ICONS: Record<string, LucideIcon> = {
  eventos: CalendarDays,
  orcamentos: FileText,
  contratos: FileSignature,
  pacotes: Package,
}

const SHADOW_REST = '0 14px 30px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.14)'
const SHADOW_LEAD = '0 18px 36px -12px rgba(0,0,0,0.85), 0 0 0 1px rgba(232,121,249,0.75), 0 0 28px -8px rgba(232,121,249,0.5)'

const radius = (r: number) => `${r}px ${r}px ${r}px ${r}px`

const tween = (target: gsap.TweenTarget, vars: gsap.TweenVars) =>
  new Promise<void>((resolve) => {
    gsap.to(target, { ...vars, onComplete: () => resolve(), onInterrupt: () => resolve() })
  })

type Props = {
  /** images[0] é a imagem principal; as demais seguem na ordem da fileira de baixo. */
  images: FlowImage[]
  /** Moldura da imagem principal (alvo do card principal). */
  mainFrameRef: RefObject<HTMLDivElement | null>
  reduced: boolean
}

/**
 * Inspirado no Card Swap (React Bits). As quatro imagens começam empilhadas em perspectiva
 * sobre a moldura principal; cada uma vai para o seu lugar (três descem para a fileira de baixo,
 * a principal se alinha na moldura). A partir daí a fileira vira um carrossel: a primeira da
 * fila sobe e vira a principal, e a principal desce para o fim da fila. Os títulos acompanham
 * as imagens. Com prefers-reduced-motion, mostra o estado final estático.
 */
export function EventFlow({ images, mainFrameRef, reduced }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const glowRefs = useRef<(HTMLSpanElement | null)[]>([])
  const visibleRef = useRef(false)

  const slotCount = images.length - 1
  // Imagens (por índice) em cada posição da fileira, da esquerda para a direita
  const [row, setRow] = useState<number[]>(() => Array.from({ length: slotCount }, (_, k) => k + 1))

  // Só anima enquanto o componente está na tela
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const root = rootRef.current
    const mainEl = mainFrameRef.current
    if (!root || !mainEl) return

    const n = images.length
    const cards = cardRefs.current.slice(0, n) as HTMLDivElement[]
    const slots = slotRefs.current.slice(0, slotCount) as HTMLDivElement[]
    if (cards.some((c) => !c) || slots.some((s) => !s)) return

    let cancelled = false
    let epoch = 0
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)))

    // ---- Medidas (sempre refeitas, pois a página rola e redimensiona) ----
    const measure = (el: Element) => {
      const rr = root.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return { x: r.left - rr.left + r.width / 2, y: r.top - rr.top + r.height / 2, w: r.width, h: r.height }
    }

    const mainPose = () => {
      const m = measure(mainEl)
      return { x: m.x, y: m.y, scale: 1, rotationX: 0, rotationY: 0, opacity: 1, borderRadius: radius(16) }
    }

    const slotPose = (k: number) => {
      const m = measure(mainEl)
      const c = measure(slots[k])
      const scale = c.w / m.w
      return { x: c.x, y: c.y, scale, rotationX: 0, rotationY: 0, opacity: 1, borderRadius: radius(8 / scale) }
    }

    // Pilha em perspectiva sobre a moldura principal; pos 0 = frente
    const stackPose = (pos: number) => {
      const m = measure(mainEl)
      const scale = 0.76 - pos * 0.05
      return {
        x: m.x + pos * 36 - ((n - 1) * 36) / 2,
        y: m.y - pos * 26 + ((n - 1) * 26) / 2,
        scale,
        rotationX: 12,
        rotationY: -16,
        opacity: 1 - pos * 0.12,
        borderRadius: radius(16),
      }
    }

    // ---- Estado lógico ----
    type Where = { t: 'stack'; pos: number } | { t: 'slot'; k: number } | { t: 'main' }
    let where: Where[] = []
    let stage: 'intro' | 'loop' = 'intro'
    let mainIdx = 0
    let rowIdx: number[] = []

    const poseFor = (w: Where) => (w.t === 'main' ? mainPose() : w.t === 'slot' ? slotPose(w.k) : stackPose(w.pos))

    const placeAll = () => {
      const m = measure(mainEl)
      cards.forEach((card, i) => {
        const w = where[i]
        gsap.set(card, {
          width: m.w,
          height: m.h,
          xPercent: -50,
          yPercent: -50,
          transformPerspective: 1000,
          boxShadow: SHADOW_REST,
          zIndex: w.t === 'stack' ? 20 - w.pos : 5,
          ...poseFor(w),
        })
      })
    }

    const resetToStart = () => {
      stage = 'intro'
      mainIdx = 0
      rowIdx = Array.from({ length: slotCount }, (_, k) => k + 1)
      setRow(rowIdx)
      // Pilha: Orçamentos na frente, ..., imagem principal por último
      where = images.map((_, i) => ({ t: 'stack', pos: i === 0 ? n - 1 : i - 1 }))
      glowRefs.current.forEach((g) => g && gsap.set(g, { opacity: 0 }))
      placeAll()
    }

    resetToStart()

    const ready = async (my: number) => {
      while (!cancelled && my === epoch && (!visibleRef.current || document.hidden)) await wait(400)
      return !cancelled && my === epoch
    }

    const glow = (k: number) => {
      const g = glowRefs.current[k]
      if (g) gsap.fromTo(g, { opacity: 1 }, { opacity: 0, duration: 1.4, ease: 'power2.out' })
    }

    // 1) Introdução: cada imagem vai para o seu lugar, em sequência rápida e sobreposta
    //    (a próxima já sai enquanto a anterior ainda está descendo)
    async function intro(my: number) {
      const alive = () => !cancelled && my === epoch
      // Pilha, frente primeiro: Orçamentos, Contratos, Pacotes e, por último, a imagem principal
      const remaining = [...images.keys()].filter((i) => i > 0).concat(0)
      const pending: Promise<void>[] = []

      for (let img = 1; img < n; img++) {
        if (!(await ready(my))) return
        const el = cards[img]
        const k = img - 1

        // Destaque breve do card da frente
        gsap.set(el, { zIndex: 40 })
        await tween(el, { scale: stackPose(0).scale * 1.04, boxShadow: SHADOW_LEAD, duration: 0.2, ease: 'power2.out' })
        if (!alive()) return

        // Desce, perde a inclinação e desliza até o lugar; a próxima avança para a frente
        const p = slotPose(k)
        remaining.shift()
        where[img] = { t: 'slot', k }
        const landing = Promise.all([
          tween(el, { y: p.y, duration: 0.7, ease: 'power2.inOut' }),
          tween(el, { x: p.x, duration: 0.65, delay: 0.1, ease: 'power3.out' }),
          tween(el, {
            rotationX: 0,
            rotationY: 0,
            scale: p.scale,
            borderRadius: p.borderRadius,
            boxShadow: SHADOW_REST,
            duration: 0.75,
            ease: 'power2.inOut',
          }),
        ]).then(() => {
          if (!alive()) return
          gsap.set(el, { zIndex: 5 })
          glow(k)
        })
        pending.push(landing)
        remaining.forEach((c, pos) => {
          where[c] = { t: 'stack', pos }
          gsap.set(cards[c], { zIndex: 20 - pos })
          pending.push(tween(cards[c], { ...stackPose(pos), duration: 0.6, delay: 0.1, ease: 'power2.out' }))
        })
        await wait(220)
        if (!alive()) return
      }

      // A imagem principal, última da pilha, se alinha na moldura
      where[0] = { t: 'main' }
      pending.push(tween(cards[0], { ...mainPose(), boxShadow: SHADOW_REST, duration: 0.7, ease: 'power2.inOut', delay: 0.1 }))
      await Promise.all(pending)
      if (!alive()) return
      gsap.set(cards[0], { zIndex: 5 })
      stage = 'loop'
      await wait(1200)
    }

    // 2) Carrossel em fileira: a primeira da fila sobe, a principal desce para o fim
    async function step(my: number) {
      const alive = () => !cancelled && my === epoch
      if (!(await ready(my))) return
      const up = rowIdx[0]
      const down = mainIdx
      const nextRow = [...rowIdx.slice(1), down]

      // Os títulos da fileira mudam junto com o movimento
      setRow(nextRow)

      gsap.set(cards[up], { zIndex: 40 })
      gsap.set(cards[down], { zIndex: 35 })
      const moves: Promise<void>[] = [
        tween(cards[up], { ...mainPose(), duration: 1.2, ease: 'power3.inOut' }),
        tween(cards[down], { ...slotPose(slotCount - 1), duration: 1.2, ease: 'power3.inOut' }),
      ]
      rowIdx.slice(1).forEach((img, i) => {
        moves.push(tween(cards[img], { ...slotPose(i), duration: 1.0, ease: 'power3.inOut' }))
      })
      mainIdx = up
      rowIdx = nextRow
      where[up] = { t: 'main' }
      rowIdx.forEach((img, k) => (where[img] = { t: 'slot', k }))
      await Promise.all(moves)
      if (!alive()) return
      cards.forEach((c) => gsap.set(c, { zIndex: 5 }))
      glow(slotCount - 1)
      await wait(2400)
    }

    async function run() {
      await wait(150)
      while (!cancelled) {
        const my = epoch
        if (stage === 'intro') await intro(my)
        else await step(my)
      }
    }
    void run()

    // Se o layout mudar, reposiciona tudo no estado atual, sem recomeçar a animação
    const ro = new ResizeObserver(() => {
      epoch++
      gsap.killTweensOf(cards)
      if (stage === 'intro') resetToStart()
      else placeAll()
    })
    ro.observe(root)
    ro.observe(mainEl)

    return () => {
      cancelled = true
      ro.disconnect()
      timers.forEach(clearTimeout)
      gsap.killTweensOf(cards)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Organização automática: gestão de eventos, orçamentos, contratos e pacotes de eventos"
      className="relative z-10"
    >
      {/* Imagens animadas (voam entre a moldura principal e a fileira) */}
      {!reduced ? (
        <div className="pointer-events-none absolute left-0 top-0" aria-hidden="true">
          {images.map((img, i) => (
            <div
              key={img.name}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="absolute left-0 top-0"
            >
              <CardFace image={img} />
            </div>
          ))}
        </div>
      ) : null}

      {/* Fileira de baixo; os títulos acompanham as imagens */}
      <div className="grid grid-cols-3 gap-3 pt-10 sm:gap-5 sm:pt-12">
        {row.map((imgIdx, k) => {
          const img = images[imgIdx]
          const Icon = ICONS[img.name]
          return (
            <section
              key={k}
              className="relative rounded-xl border border-white/10 bg-gradient-to-b from-ink-800/80 to-ink-950/80 p-2.5 sm:p-5"
            >
              <span
                ref={(el) => {
                  glowRefs.current[k] = el
                }}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-xl border border-[rgb(var(--tone)/0.7)] opacity-0 shadow-[0_0_28px_-6px_rgb(var(--tone)/0.45)]"
              />
              <h4
                key={img.name}
                className="flow-title-in relative flex items-center gap-2 text-base font-medium leading-tight text-white max-sm:sr-only"
              >
                {Icon ? (
                  <Icon className="size-4 shrink-0 text-[rgb(var(--tone))] sm:size-5" strokeWidth={1.5} aria-hidden="true" />
                ) : null}
                {img.label}
              </h4>
              <div
                ref={(el) => {
                  slotRefs.current[k] = el
                }}
                className="relative aspect-[16/11] w-full rounded-md border border-dashed border-white/10 sm:mt-4"
              >
                {reduced ? <CardFace image={img} small /> : null}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

/** Card = imagem dentro do seu próprio molde (moldura de navegador): o molde viaja com a imagem. */
function CardFace({ image, small = false }: { image: FlowImage; small?: boolean }) {
  if (small) {
    return (
      <div className="h-full w-full overflow-hidden rounded-md border border-white/15 bg-ink-800">
        <img
          src={screenshot(image.name)}
          alt={image.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      </div>
    )
  }
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden border border-ink-500 bg-ink-800"
      style={{ borderRadius: 'inherit' }}
    >
      <div className="flex h-[9.0909%] shrink-0 items-center gap-1.5 border-b border-ink-600 bg-ink-700 px-4">
        <span className="size-2.5 rounded-full bg-ink-500" />
        <span className="size-2.5 rounded-full bg-ink-500" />
        <span className="size-2.5 rounded-full bg-ink-500" />
        <span className="ml-3 whitespace-nowrap text-xs font-medium text-mist-300">{image.label}</span>
      </div>
      <img
        src={screenshot(image.name)}
        alt=""
        width={1600}
        height={1000}
        loading="lazy"
        decoding="async"
        className="min-h-0 w-full flex-1 object-cover object-top"
      />
    </div>
  )
}
