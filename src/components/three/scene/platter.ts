import { Group, LatheGeometry, Mesh, MeshPhysicalMaterial, TorusGeometry, Vector2 } from 'three'

/** Bandeja escura de metal onde o prato repousa. O topo fica em y = 0. */
export function createPlatter(): Mesh {
  const profile = [
    new Vector2(0, -0.14),
    new Vector2(2.2, -0.14),
    new Vector2(2.34, -0.1),
    new Vector2(2.38, -0.04),
    new Vector2(2.33, 0),
    new Vector2(0, 0),
  ]
  const mesh = new Mesh(
    new LatheGeometry(profile, 128),
    new MeshPhysicalMaterial({ color: 0x14152f, metalness: 0.8, roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25, envMapIntensity: 0.3 }),
  )
  mesh.receiveShadow = true
  return mesh
}

/** Prato de porcelana com filete dourado. O fundo toca a bandeja em y = 0; a superfície útil fica em ~0.05. */
export function createPlate(): Group {
  const porcelain = new MeshPhysicalMaterial({ color: 0xf7f4ee, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 })
  const gold = new MeshPhysicalMaterial({ color: 0xd4a547, metalness: 1, roughness: 0.25 })

  const profile = [
    new Vector2(0, 0),
    new Vector2(0.85, 0),
    new Vector2(1.15, 0.03),
    new Vector2(1.36, 0.14),
    new Vector2(1.43, 0.2),
    new Vector2(1.41, 0.21),
    new Vector2(1.3, 0.12),
    new Vector2(1.05, 0.07),
    new Vector2(0.9, 0.05),
    new Vector2(0, 0.05),
  ]
  const group = new Group()
  const body = new Mesh(new LatheGeometry(profile, 128), porcelain)
  const ring = new Mesh(new TorusGeometry(1.425, 0.014, 12, 128), gold)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.205

  group.add(body, ring)
  group.traverse((o) => {
    if (o instanceof Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return group
}
