import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Points, ShaderMaterial } from 'three'

export type Steam = {
  points: Points
  /** t em segundos; intensity 0–1; pixelScale = altura do canvas em px para dimensionar os pontos. */
  update(t: number, intensity: number, pixelScale: number): void
  dispose(): void
}

function puffTexture(): CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

/** Vapor: partículas macias que sobem, ondulam e se dissipam. A posição é calculada na GPU. */
export function createSteam(count: number): Steam {
  const seeds = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    seeds[i * 3] = Math.random() // fase
    seeds[i * 3 + 1] = Math.random() * Math.PI * 2 // ângulo
    seeds[i * 3 + 2] = 0.6 + Math.random() * 0.8 // variação de velocidade/tamanho
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 3))

  const texture = puffTexture()
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uScale: { value: 300 },
      uMap: { value: texture },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aSeed;
      uniform float uTime;
      uniform float uScale;
      varying float vLife;
      void main() {
        float life = fract(uTime * 0.16 * aSeed.z + aSeed.x);
        vLife = life;
        float h = life * 2.1;
        float swirl = aSeed.y + life * 5.0;
        vec3 p = vec3(
          cos(swirl) * (0.12 + life * 0.38) * aSeed.z,
          0.55 + h,
          sin(swirl) * (0.12 + life * 0.38) * aSeed.z
        );
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = (0.5 + life * 2.2) * aSeed.z * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uIntensity;
      varying float vLife;
      void main() {
        float fade = smoothstep(0.0, 0.15, vLife) * (1.0 - smoothstep(0.55, 1.0, vLife));
        float a = texture2D(uMap, gl_PointCoord).a * fade * uIntensity * 0.9;
        gl_FragColor = vec4(vec3(0.95, 0.93, 1.0) * a, a);
      }
    `,
  })

  const points = new Points(geometry, material)
  points.frustumCulled = false

  return {
    points,
    update(t, intensity, pixelScale) {
      material.uniforms.uTime.value = t
      material.uniforms.uIntensity.value = intensity
      material.uniforms.uScale.value = pixelScale
      points.visible = intensity > 0.002
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      texture.dispose()
    },
  }
}
