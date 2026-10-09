import { gsap } from './gsap'

/**
 * Revelações genéricas por atributos de dados (só transform e opacity):
 *  - data-reveal="up | left | right"  → o próprio elemento entra ao rolar
 *  - data-stagger                     → filhos com data-stagger-item entram em sequência
 *
 * Usa gsap.from: se o JS falhar antes de rodar, o conteúdo permanece visível.
 */
export function setupReveals(root: HTMLElement) {
  // Elementos dentro de um escopo aninhado (data-reveal-scope) pertencem a ele: animar duas vezes
  // faria o segundo gsap.from ler opacity 0 como estado final e o elemento ficaria invisível.
  const own = (el: Element) => {
    const owner = el.closest('[data-reveal-scope]')
    return !owner || owner === root
  }

  gsap.utils.toArray<HTMLElement>('[data-reveal]', root).filter(own).forEach((el) => {
    const dir = el.dataset.reveal
    gsap.from(el, {
      opacity: 0,
      x: dir === 'left' ? -40 : dir === 'right' ? 40 : 0,
      y: dir === 'left' || dir === 'right' ? 0 : 28,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-stagger]', root).filter(own).forEach((group) => {
    const items = group.querySelectorAll('[data-stagger-item]')
    if (!items.length) return
    gsap.from(items, {
      opacity: 0,
      y: 32,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 86%', once: true },
    })
  })
}
