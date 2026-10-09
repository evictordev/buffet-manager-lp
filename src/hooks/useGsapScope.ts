import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { setupReveals } from '../lib/reveals'

type Options = {
  /** Animações extras, só para telas médias/grandes e sem prefers-reduced-motion. */
  full?: (root: HTMLElement) => void
  /** Revelações genéricas (data-reveal / data-stagger). Padrão: ligado. */
  reveals?: boolean
}

/**
 * Registra animações GSAP dentro de um escopo e desfaz tudo na desmontagem.
 *  - prefers-reduced-motion: reduce → nenhuma animação, conteúdo estático e visível
 *  - telas < 768px → apenas revelações simples
 *  - telas ≥ 768px → revelações + animações extras (parallax, flutuação)
 */
export function useGsapScope(scope: RefObject<HTMLElement | null>, { full, reveals = true }: Options = {}) {
  useLayoutEffect(() => {
    const root = scope.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        wide: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
      },
      (context) => {
        const { motion, wide } = context.conditions as { motion: boolean; wide: boolean }
        if (!motion) return
        if (reveals) setupReveals(root)
        if (wide && full) full(root)
      },
    )

    return () => mm.revert()
    // O setup é estático por componente; não reexecutar a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
