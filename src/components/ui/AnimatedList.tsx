import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Utensils } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export type UtensilRow = { name: string; quantity: string; price: string }

type Entry = { id: number; item: UtensilRow }

type Props = {
  /** Utensílios que vão surgindo, em ciclo. */
  items: UtensilRow[]
  /** Quantidade de cards visíveis ao mesmo tempo. */
  max?: number
  /** Intervalo entre cada novo card, em ms. */
  interval?: number
  className?: string
}

const CARD_H = 60
const GAP = 10

/**
 * Lista animada (referência: Animated List, Magic UI): um card novo entra no topo, os anteriores
 * descem e o mais antigo some. Só anima enquanto está na tela; com prefers-reduced-motion
 * mostra uma lista estática.
 */
export function AnimatedList({ items, max = 5, interval = 1800, className = '' }: Props) {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)
  const counter = useRef(1)
  const [list, setList] = useState<Entry[]>(() => [{ id: 0, item: items[0] }])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) {
      setList(items.slice(0, max).map((item, id) => ({ id, item })).reverse())
      return
    }
    const timer = window.setInterval(() => {
      if (!visibleRef.current || document.hidden) return
      const id = counter.current++
      setList((prev) => [{ id, item: items[id % items.length] }, ...prev].slice(0, max + 1))
    }, interval)
    return () => window.clearInterval(timer)
  }, [reduced, items, max, interval])

  return (
    <div
      ref={rootRef}
      role="list"
      aria-label="Lista de utensílios"
      className={`relative ${className}`}
      style={{ height: max * CARD_H + (max - 1) * GAP }}
    >
      {list.map((entry, index) => (
        <div
          key={entry.id}
          role="listitem"
          aria-hidden={index >= max}
          className="absolute inset-x-0 top-0 transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateY(${index * (CARD_H + GAP)}px)`, opacity: index >= max ? 0 : 1 }}
        >
          <div
            className="animated-list-in flex items-center gap-3 rounded-xl border border-white/10 bg-[#070a1c]/85 px-4 shadow-[0_14px_28px_-14px_rgb(0_0_0/0.85)] backdrop-blur-md sm:gap-4"
            style={{ height: CARD_H }}
          >
            <Utensils className="size-5 shrink-0 text-violet-300" strokeWidth={1.5} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-white sm:text-base">{entry.item.name}</span>
            <span className="shrink-0 rounded-md bg-white/[0.07] px-2 py-0.5 text-xs font-medium tabular-nums text-mist-100">
              {entry.item.quantity}
            </span>
            <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums text-mist-300 sm:w-24">
              {entry.item.price}
            </span>
            <MoreHorizontal className="size-5 shrink-0 text-mist-500" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  )
}
