import {
  BoxGeometry,
  DoubleSide,
  ExtrudeGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
} from 'three'
import { createFood } from './food'
import { createPlate } from './platter'

/** Algo que a cloche pode revelar. A origem fica no centro do topo da bandeja (y = 0). */
export type SceneItem = {
  group: Group
  /** Quanto vapor sai deste item (0 a 1). */
  steam: number
  /** Movimento do item ao longo do tempo (t em segundos). */
  animate(t: number): void
}

const FONT = '"Inter Variable", system-ui, sans-serif'

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function shadows(group: Group) {
  group.traverse((o) => {
    if (o instanceof Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
}

/** Pratos do buffet: o prato gourmet girando devagar. */
function createDishItem(): SceneItem {
  const group = new Group()
  group.add(createPlate(), createFood())
  return { group, steam: 1, animate: (t) => void (group.rotation.y = t * 0.18) }
}

/** Contratos: pilha de folhas com o contrato por cima, selo de cera e caneta. */
function createContractsItem(): SceneItem {
  const group = new Group()
  const W = 1.5
  const D = 2.0
  const H = 0.026

  const top = canvasTexture(600, 800, (ctx) => {
    ctx.fillStyle = '#f7f3ea'
    ctx.fillRect(0, 0, 600, 800)
    ctx.fillStyle = '#2b2a45'
    ctx.font = `700 40px ${FONT}`
    ctx.fillText('CONTRATO', 56, 100)
    ctx.fillRect(56, 124, 120, 5)
    ctx.fillStyle = '#c9c4b8'
    for (let i = 0; i < 12; i++) ctx.fillRect(56, 180 + i * 34, i % 4 === 3 ? 300 : 488, 9)
    ctx.strokeStyle = '#2b2a45'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(56, 700)
    ctx.lineTo(300, 700)
    ctx.stroke()
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(70, 676)
    ctx.bezierCurveTo(100, 620, 120, 700, 150, 650)
    ctx.bezierCurveTo(175, 612, 190, 690, 230, 660)
    ctx.stroke()
  })

  const paper = new MeshStandardMaterial({ color: 0xf1ece0, roughness: 0.85 })
  const topPaper = new MeshStandardMaterial({ map: top, roughness: 0.8 })
  const sheets = 6
  for (let i = 0; i < sheets; i++) {
    const isTop = i === sheets - 1
    const sheet = new Mesh(new BoxGeometry(W, H, D), isTop ? [paper, paper, topPaper, paper, paper, paper] : paper)
    sheet.position.set((i % 2 ? 0.03 : -0.03) * (i + 1) * 0.4, H / 2 + i * H, 0)
    sheet.rotation.y = isTop ? 0 : (((i * 37) % 11) - 5) * 0.018
    group.add(sheet)
  }
  const topY = sheets * H

  const waxMaterial = new MeshPhysicalMaterial({ color: 0xa5161c, roughness: 0.35, clearcoat: 0.8 })
  const seal = new Mesh(new CylinderGeometry(0.17, 0.19, 0.045, 32), waxMaterial)
  seal.position.set(0.36, topY + 0.02, 0.7)
  const sealRing = new Mesh(new TorusGeometry(0.11, 0.018, 12, 32), waxMaterial)
  sealRing.rotation.x = Math.PI / 2
  sealRing.position.set(0.36, topY + 0.046, 0.7)
  group.add(seal, sealRing)

  const pen = new Group()
  const body = new Mesh(new CylinderGeometry(0.035, 0.035, 0.95, 20), new MeshPhysicalMaterial({ color: 0x1c1b33, roughness: 0.3, clearcoat: 1 }))
  const tip = new Mesh(new CylinderGeometry(0.035, 0.008, 0.14, 20), new MeshPhysicalMaterial({ color: 0xd4a547, metalness: 1, roughness: 0.25 }))
  body.rotation.z = Math.PI / 2
  tip.rotation.z = Math.PI / 2
  tip.position.x = -0.54
  pen.add(body, tip)
  pen.position.set(0.1, topY + 0.04, 0.45)
  pen.rotation.y = -0.55
  group.add(pen)

  shadows(group)
  group.scale.setScalar(1.2)
  return { group, steam: 0, animate: (t) => void (group.rotation.y = Math.sin(t * 0.5) * 0.5) }
}

/** Eventos: calendário de mesa em "A", com a agenda do mês e os dias de evento marcados. */
function createCalendarItem(): SceneItem {
  const group = new Group()
  const W = 1.5
  const H = 1.1
  const LEAN = 0.3

  const face = canvasTexture(750, 550, (ctx) => {
    ctx.fillStyle = '#fbf8f2'
    ctx.fillRect(0, 0, 750, 550)
    ctx.fillStyle = '#c026d3'
    ctx.fillRect(0, 0, 750, 120)
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 54px ${FONT}`
    ctx.textBaseline = 'middle'
    ctx.fillText('Eventos', 44, 62)

    const colW = 750 / 7
    ctx.textAlign = 'center'
    ctx.fillStyle = '#8a86a8'
    ctx.font = `600 24px ${FONT}`
    ;['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((d, i) => ctx.fillText(d, colW * (i + 0.5), 152))

    const marks: Record<number, string> = { 4: '#c026d3', 11: '#4f46e5', 18: '#10b981', 25: '#f59e0b', 26: '#4f46e5' }
    for (let day = 1; day <= 30; day++) {
      const slot = day + 2
      const cx = colW * ((slot % 7) + 0.5)
      const cy = 205 + Math.floor(slot / 7) * 66
      if (marks[day]) {
        ctx.fillStyle = marks[day]
        ctx.beginPath()
        ctx.arc(cx, cy, 27, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
      } else {
        ctx.fillStyle = '#3a3857'
      }
      ctx.font = `600 28px ${FONT}`
      ctx.fillText(String(day), cx, cy + 1)
    }
  })

  const edge = new MeshStandardMaterial({ color: 0xf1ece0, roughness: 0.85 })
  const back = new MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.9 })
  const front = new MeshStandardMaterial({ map: face, roughness: 0.7 })
  const sinLean = Math.sin(LEAN)

  const panel = (frontSide: boolean) => {
    const pivot = new Group()
    const mesh = new Mesh(new BoxGeometry(W, H, 0.035), frontSide ? [edge, edge, edge, edge, front, back] : [edge, edge, edge, edge, back, back])
    mesh.position.y = H / 2
    pivot.add(mesh)
    pivot.position.z = (frontSide ? 1 : -1) * H * sinLean
    pivot.rotation.x = (frontSide ? -1 : 1) * LEAN
    return pivot
  }
  group.add(panel(true), panel(false))

  const ringMaterial = new MeshPhysicalMaterial({ color: 0xc9ccd6, metalness: 1, roughness: 0.25 })
  const ringY = H * Math.cos(LEAN)
  for (let i = 0; i < 9; i++) {
    const ring = new Mesh(new TorusGeometry(0.05, 0.011, 10, 24), ringMaterial)
    ring.position.set(-W / 2 + 0.14 + i * ((W - 0.28) / 8), ringY, 0)
    group.add(ring)
  }

  shadows(group)
  group.scale.setScalar(1.1)
  return { group, steam: 0, animate: (t) => void (group.rotation.y = Math.sin(t * 0.5) * 0.5) }
}

/** Utensílios: garfo e faca cruzados sobre um guardanapo dobrado, com uma concha ao lado. */
function createUtensilsItem(): SceneItem {
  const group = new Group()
  const steel = new MeshPhysicalMaterial({ color: 0xdfe3ea, metalness: 1, roughness: 0.22, clearcoat: 0.3 })
  const cloth = new MeshStandardMaterial({ color: 0x3f43b5, roughness: 0.92 })
  const clothFold = new MeshStandardMaterial({ color: 0x5559d1, roughness: 0.92 })

  // Guardanapo: base quadrada e uma dobra em faixa por cima
  const napkin = new Mesh(new BoxGeometry(1.35, 0.04, 1.35), cloth)
  napkin.position.y = 0.02
  napkin.rotation.y = 0.2
  const fold = new Mesh(new BoxGeometry(1.35, 0.035, 0.62), clothFold)
  napkin.add(fold)
  fold.position.set(0, 0.0375, 0.36)
  group.add(napkin)

  // Talheres: contornos 2D extrudados e deitados (comprimento no eixo x)
  const flat = (shape: Shape, y: number, rotY: number) => {
    const mesh = new Mesh(new ExtrudeGeometry(shape, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 }), steel)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = y
    mesh.rotation.z = rotY
    return mesh
  }

  const fork = new Shape()
  fork.moveTo(-0.95, -0.04)
  fork.lineTo(-0.05, -0.05)
  fork.bezierCurveTo(0.1, -0.05, 0.1, -0.17, 0.3, -0.17)
  fork.lineTo(0.42, -0.17)
  const tineW = 0.06
  const gap = (0.34 - tineW * 4) / 3
  for (let i = 0; i < 4; i++) {
    const y0 = -0.17 + i * (tineW + gap)
    fork.lineTo(0.95, y0)
    fork.lineTo(0.95, y0 + tineW)
    fork.lineTo(0.42, y0 + tineW)
    if (i < 3) fork.lineTo(0.42, y0 + tineW + gap)
  }
  fork.lineTo(0.3, 0.17)
  fork.bezierCurveTo(0.1, 0.17, 0.1, 0.05, -0.05, 0.05)
  fork.lineTo(-0.95, 0.04)
  fork.quadraticCurveTo(-1.0, 0, -0.95, -0.04)

  const knife = new Shape()
  knife.moveTo(-0.95, -0.045)
  knife.lineTo(-0.2, -0.045)
  knife.lineTo(0.75, -0.055)
  knife.quadraticCurveTo(1.0, -0.04, 0.96, 0.02)
  knife.quadraticCurveTo(0.8, 0.09, 0.5, 0.09)
  knife.lineTo(-0.2, 0.09)
  knife.lineTo(-0.2, 0.045)
  knife.lineTo(-0.95, 0.045)
  knife.quadraticCurveTo(-1.0, 0, -0.95, -0.045)

  group.add(flat(fork, 0.075, 0.5), flat(knife, 0.11, -0.5))

  // Concha apoiada na bandeja, atrás do guardanapo
  const ladle = new Group()
  const bowl = new Mesh(new SphereGeometry(0.21, 36, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), steel)
  ;(bowl.material as MeshPhysicalMaterial).side = DoubleSide
  bowl.position.y = 0.21
  const handle = new Mesh(new CylinderGeometry(0.022, 0.03, 1.08, 16), steel)
  handle.position.set(0.72, 0.13, 0)
  handle.rotation.z = -1.72
  ladle.add(bowl, handle)
  ladle.position.set(-0.55, 0, -0.85)
  ladle.rotation.y = 0.2
  group.add(ladle)

  shadows(group)
  group.scale.setScalar(1.3)
  return { group, steam: 0, animate: (t) => void (group.rotation.y = Math.sin(t * 0.5) * 0.5) }
}

/** Na ordem de SCENE_ITEMS. */
export function createItems(): SceneItem[] {
  return [createDishItem(), createContractsItem(), createCalendarItem(), createUtensilsItem()]
}
