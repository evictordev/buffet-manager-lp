import {
  ACESFilmicToneMapping,
  Group,
  Material,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three'
import { gsap } from '../../../lib/gsap'
import { createCloche } from './cloche'
import { createEnvironment } from './environment'
import { createFood } from './food'
import { createLights } from './lights'
import { createPlate, createPlatter } from './platter'
import { createSteam } from './steam'

export type BuffetSceneOptions = {
  /** Sem loop nem parallax: renderiza a cena revelada uma vez. */
  reducedMotion: boolean
  /** Telas pequenas/dispositivos fracos: menos partículas, sombras e pixel ratio menores. */
  lowPower: boolean
}

export type BuffetSceneHandle = {
  setVisible(visible: boolean): void
  dispose(): void
}

const TARGET = new Vector3(0, 1.25, 0)
const FOV = 36
const LIFT_HEIGHT = 2.1

/** Monta a cena da cloche. Lança erro se o WebGL não estiver disponível. */
export function createBuffetScene(canvas: HTMLCanvasElement, opts: BuffetSceneOptions): BuffetSceneHandle {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const scene = new Scene()
  const envMap = createEnvironment(renderer)
  scene.environment = envMap
  scene.environmentIntensity = 0.75

  scene.add(createLights(opts.lowPower ? 1024 : 2048))
  scene.add(createPlatter())

  const dish = new Group()
  dish.add(createPlate(), createFood())
  scene.add(dish)

  const cloche = createCloche()
  scene.add(cloche)

  const steam = createSteam(opts.lowPower ? 26 : 48)
  dish.add(steam.points)

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60)

  // Estado animado pela timeline
  const state = { lift: opts.reducedMotion ? 1 : 0, steam: opts.reducedMotion ? 0.7 : 0 }
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  let distance = 9
  let height = 600
  let visible = false
  let raf = 0
  const startedAt = performance.now()

  function applyState() {
    const e = state.lift
    cloche.position.set(-0.55 * e, LIFT_HEIGHT * e, 0.25 * e)
    cloche.rotation.set(0.05 * e, 0, 0.32 * e)
  }

  function placeCamera() {
    const az = pointer.sx * 0.32
    const el = 0.3 - pointer.sy * 0.09
    camera.position.set(
      TARGET.x + distance * Math.cos(el) * Math.sin(az),
      TARGET.y + distance * Math.sin(el),
      TARGET.z + distance * Math.cos(el) * Math.cos(az),
    )
    camera.lookAt(TARGET)
  }

  function render() {
    const t = (performance.now() - startedAt) / 1000
    if (!opts.reducedMotion) {
      pointer.sx += (pointer.x - pointer.sx) * 0.05
      pointer.sy += (pointer.y - pointer.sy) * 0.05
      dish.rotation.y = t * 0.18
    }
    applyState()
    placeCamera()
    steam.update(opts.reducedMotion ? 6 : t, state.steam, height * 0.5)
    renderer.render(scene, camera)
  }

  function loop() {
    render()
    raf = requestAnimationFrame(loop)
  }

  function resize() {
    const parent = canvas.parentElement ?? canvas
    const w = Math.max(parent.clientWidth, 1)
    const h = Math.max(parent.clientHeight, 1)
    height = h
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Enquadramento: cabe a cloche levantada (altura) e a bandeja (largura)
    const tan = Math.tan((FOV * Math.PI) / 360)
    const fitH = 2.9 / tan
    const fitW = 2.55 / (tan * camera.aspect)
    distance = Math.max(fitH, fitW)
    camera.updateProjectionMatrix()
    if (!opts.reducedMotion && !visible) return
    render()
  }

  // Loop: fechada → levanta e revela com vapor → desce
  const timeline = gsap.timeline({ repeat: -1, paused: true })
  if (!opts.reducedMotion) {
    timeline
      .to(state, { lift: 0, steam: 0, duration: 0.01 })
      .to(state, { lift: 1, duration: 1.8, ease: 'power3.inOut' }, 1.2)
      .to(state, { steam: 1, duration: 1.6, ease: 'sine.inOut' }, 2.2)
      .to(state, { steam: 0.55, duration: 2.5, ease: 'sine.inOut' }, 4.4)
      .to(state, { steam: 0, duration: 1.1, ease: 'sine.in' }, 6.4)
      .to(state, { lift: 0, duration: 1.6, ease: 'power3.inOut' }, 6.9)
      .to(state, {}, 9.5)
  }

  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement ?? canvas)
  if (!opts.reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })
  resize()

  return {
    setVisible(v) {
      if (opts.reducedMotion || v === visible) {
        visible = v
        return
      }
      visible = v
      if (v) {
        timeline.play()
        raf = requestAnimationFrame(loop)
      } else {
        timeline.pause()
        cancelAnimationFrame(raf)
      }
    },
    dispose() {
      cancelAnimationFrame(raf)
      timeline.kill()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      steam.dispose()
      const textures = new Set<Texture>([envMap])
      scene.traverse((o) => {
        if (!(o instanceof Mesh)) return
        o.geometry.dispose()
        const mats: Material[] = Array.isArray(o.material) ? o.material : [o.material]
        for (const m of mats) {
          const map = (m as { map?: Texture | null }).map
          if (map) textures.add(map)
          m.dispose()
        }
      })
      textures.forEach((t) => t.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
