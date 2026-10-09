import { CylinderGeometry, DoubleSide, Group, LatheGeometry, Mesh, MeshPhysicalMaterial, SphereGeometry, TorusGeometry, Vector2 } from 'three'

export const CLOCHE_RADIUS = 1.55
export const CLOCHE_HEIGHT = 1.35

/** Cloche prateada: domo de revolução, aro e puxador. A origem fica no centro da base. */
export function createCloche(): Group {
  const silver = new MeshPhysicalMaterial({
    color: 0xe4e8f2,
    metalness: 1,
    roughness: 0.1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.08,
    side: DoubleSide,
  })

  const profile: Vector2[] = []
  const steps = 56
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2)
    // Expoente < 1 deixa os ombros do domo mais "cheios", como numa cloche clássica
    profile.push(new Vector2(CLOCHE_RADIUS * Math.pow(Math.cos(a), 0.85), CLOCHE_HEIGHT * Math.sin(a)))
  }

  const group = new Group()
  const dome = new Mesh(new LatheGeometry(profile, 128), silver)
  const rim = new Mesh(new TorusGeometry(CLOCHE_RADIUS, 0.05, 20, 128), silver)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.02

  const neck = new Mesh(new CylinderGeometry(0.06, 0.09, 0.14, 24), silver)
  neck.position.y = CLOCHE_HEIGHT + 0.04
  const knob = new Mesh(new SphereGeometry(0.15, 40, 24), silver)
  knob.scale.y = 0.85
  knob.position.y = CLOCHE_HEIGHT + 0.18

  group.add(dome, rim, neck, knob)
  group.traverse((o) => {
    if (o instanceof Mesh) o.castShadow = true
  })
  return group
}
