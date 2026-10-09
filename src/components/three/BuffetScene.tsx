import { useEffect, useRef, useState } from 'react'
import { ChefHat } from 'lucide-react'
import type { BuffetSceneHandle } from './scene'
import { SCENE_ITEMS } from './scene-items'

/**
 * Cena 3D da cloche (Three.js). O Three é carregado sob demanda para não pesar o bundle inicial.
 * Renderiza só enquanto está visível e libera os recursos da GPU ao desmontar.
 */
export function BuffetScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [item, setItem] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let disposed = false
    let handle: BuffetSceneHandle | null = null
    let visible = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        handle?.setVisible(visible)
      },
      { rootMargin: '80px' },
    )
    observer.observe(canvas)

    import('./scene')
      .then(({ createBuffetScene }) => {
        if (disposed) return
        handle = createBuffetScene(canvas, {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          lowPower: window.matchMedia('(max-width: 767px)').matches,
          onItem: setItem,
        })
        handle.setVisible(visible)
        setReady(true)
      })
      .catch(() => {
        if (!disposed) setFailed(true)
      })

    return () => {
      disposed = true
      observer.disconnect()
      handle?.dispose()
    }
  }, [])

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Cloche prateada que se levanta e revela: ${SCENE_ITEMS[item].label}`}
        className={`size-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'} ${failed ? 'hidden' : ''}`}
      />
      {failed ? (
        <div className="flex size-full items-center justify-center" aria-hidden="true">
          <ChefHat className="size-24 text-violet-300/60" strokeWidth={1.2} />
        </div>
      ) : null}
    </div>
  )
}
