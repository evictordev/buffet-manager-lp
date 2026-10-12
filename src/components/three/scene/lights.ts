import { AmbientLight, Group, PointLight, SpotLight } from 'three'

/** Iluminação: luz principal quente com sombra + contraluzes latão e índigo. */
export function createLights(shadowMapSize: number): Group {
  const group = new Group()

  const key = new SpotLight(0xffe2b8, 900, 0, Math.PI / 6.5, 0.6, 2)
  // Vem do alto e da direita, atrás do cloche: é o lado da poça de latão do fundo do hero (.hero-glow),
  // então a sombra cai para a esquerda e um pouco para a frente, oposta à luz.
  key.position.set(7.5, 5.5, -0.5)
  key.target.position.set(0, 0.8, 0)
  key.castShadow = true
  key.shadow.mapSize.set(shadowMapSize, shadowMapSize)
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.03
  key.shadow.radius = 5
  key.shadow.camera.near = 3
  key.shadow.camera.far = 20

  const brass = new PointLight(0xe2b768, 90, 14, 2)
  brass.position.set(4.5, 2.4, -2.5) // mesmo lado da poça de latão do fundo
  const indigo = new PointLight(0x6366f1, 110, 14, 2)
  indigo.position.set(-4.5, 3, -2.5) // lado do índigo do fundo

  group.add(key, key.target, brass, indigo, new AmbientLight(0x8890d8, 0.15))
  return group
}
