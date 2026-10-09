import { AmbientLight, Group, PointLight, SpotLight } from 'three'

/** Iluminação: luz principal quente com sombra + contraluzes fúcsia e índigo da identidade do site. */
export function createLights(shadowMapSize: number): Group {
  const group = new Group()

  const key = new SpotLight(0xffe2b8, 900, 0, Math.PI / 6.5, 0.6, 2)
  key.position.set(3.5, 8.5, 5)
  key.target.position.set(0, 0.8, 0)
  key.castShadow = true
  key.shadow.mapSize.set(shadowMapSize, shadowMapSize)
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  key.shadow.radius = 5
  key.shadow.camera.near = 3
  key.shadow.camera.far = 20

  const fuchsia = new PointLight(0xd946ef, 110, 14, 2)
  fuchsia.position.set(-4.5, 2.4, -2.5)
  const indigo = new PointLight(0x6366f1, 130, 14, 2)
  indigo.position.set(4.5, 3, -2.5)

  group.add(key, key.target, fuchsia, indigo, new AmbientLight(0x8890d8, 0.15))
  return group
}
