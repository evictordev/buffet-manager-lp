import {
  BufferGeometry,
  CanvasTexture,
  ConeGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  SphereGeometry,
} from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** Hash determinístico por posição: vértices coincidentes recebem o mesmo deslocamento. */
function hash(x: number, y: number, z: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

/** Esfera de superfície irregular, para legumes e purê com aparência orgânica. */
function organicBlob(radius: number, amount: number, detail = 3): BufferGeometry {
  let geo: BufferGeometry = new IcosahedronGeometry(radius, detail)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  geo = mergeVertices(geo)
  const pos = geo.getAttribute('position')
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const k = 1 + (hash(x, y, z) - 0.5) * amount
    pos.setXYZ(i, x * k, y * k, z * k)
  }
  geo.computeVertexNormals()
  return geo
}

/** Textura de carne grelhada: marrom com marcas diagonais de grelha. */
function steakTexture(): CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size * 0.7)
  grad.addColorStop(0, '#7a3a1c')
  grad.addColorStop(1, '#3e1b0b')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(20, 8, 2, 0.75)'
  ctx.lineWidth = 12
  ctx.lineCap = 'round'
  for (let i = -2; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(i * 60, size)
    ctx.lineTo(i * 60 + size * 0.7, 0)
    ctx.stroke()
  }
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(${hash(i, 1, 2) > 0.5 ? '255,200,140' : '10,4,0'},${0.04 + hash(i, 3, 4) * 0.08})`
    ctx.fillRect(hash(i, 5, 6) * size, hash(i, 7, 8) * size, 2, 2)
  }
  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

/** Prato gourmet: filé grelhado com molho, purê, brócolis, tomates-cereja e alecrim. A base fica em y ≈ 0.05. */
export function createFood(): Group {
  const group = new Group()
  const base = 0.05

  const sauce = new Mesh(
    new CylinderGeometry(0.62, 0.62, 0.012, 64),
    new MeshPhysicalMaterial({ color: 0x4a1409, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }),
  )
  sauce.position.set(0.08, base + 0.006, 0.05)

  const steak = new Mesh(
    new SphereGeometry(0.55, 64, 40),
    new MeshStandardMaterial({ map: steakTexture(), roughness: 0.55, metalness: 0.02 }),
  )
  steak.scale.set(1.1, 0.34, 0.78)
  steak.position.set(0.08, base + 0.17, 0.05)
  steak.rotation.y = 0.5

  const mash = new Mesh(
    organicBlob(0.36, 0.12),
    new MeshPhysicalMaterial({ color: 0xf1dfaa, roughness: 0.6, sheen: 0.6, sheenColor: 0xfff3c9 }),
  )
  mash.scale.set(1, 0.75, 1)
  mash.position.set(-0.62, base + 0.2, -0.32)

  const broccoli = new Group()
  const stem = new Mesh(new CylinderGeometry(0.05, 0.07, 0.22, 16), new MeshStandardMaterial({ color: 0x9bc25a, roughness: 0.6 }))
  stem.position.y = 0.11
  broccoli.add(stem)
  const floretMat = new MeshStandardMaterial({ color: 0x2f7a35, roughness: 0.75 })
  const florets: [number, number, number, number][] = [
    [0, 0.3, 0, 0.15],
    [-0.1, 0.24, 0.03, 0.1],
    [0.1, 0.25, -0.02, 0.11],
    [0.02, 0.24, 0.1, 0.1],
    [0.0, 0.25, -0.1, 0.1],
  ]
  for (const [x, y, z, r] of florets) {
    const m = new Mesh(organicBlob(r, 0.5, 2), floretMat)
    m.position.set(x, y, z)
    broccoli.add(m)
  }
  broccoli.position.set(0.7, base, -0.55)

  const tomatoMat = new MeshPhysicalMaterial({ color: 0xc8201a, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 })
  const tomatoes = [
    { x: -0.3, z: 0.78, r: 0.115 },
    { x: -0.05, z: 0.86, r: 0.1 },
  ].map(({ x, z, r }) => {
    const t = new Mesh(new SphereGeometry(r, 32, 24), tomatoMat)
    t.position.set(x, base + r * 0.95, z)
    return t
  })

  const rosemaryMat = new MeshStandardMaterial({ color: 0x2f5a2a, roughness: 0.8 })
  const rosemary = new Group()
  for (let i = 0; i < 4; i++) {
    const needle = new Mesh(new ConeGeometry(0.012, 0.34, 6), rosemaryMat)
    needle.rotation.set(Math.PI / 2 - 0.15, 0, -0.35 + i * 0.22)
    needle.position.set(i * 0.03, 0, -i * 0.01)
    rosemary.add(needle)
  }
  rosemary.position.set(0.05, base + 0.36, 0.0)

  group.add(sauce, steak, mash, broccoli, ...tomatoes, rosemary)
  group.traverse((o) => {
    if (o instanceof Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return group
}
