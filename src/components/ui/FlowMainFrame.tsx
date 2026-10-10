import type { RefObject } from 'react'
import { screenshot } from '../../config/site'

type Props = {
  /** Título da imagem que está como principal; acompanha a imagem. */
  label: string
  /** Área da tela: alvo onde as imagens animadas pousam. */
  screenRef: RefObject<HTMLDivElement | null>
  /** Sem animação (prefers-reduced-motion), a imagem principal é exibida aqui mesmo. */
  staticImage?: { name: string; alt: string } | null
}

/** Moldura de navegador da imagem principal; a imagem em si é desenhada pela animação. */
export function FlowMainFrame({ label, screenRef, staticImage }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-500 bg-ink-800 shadow-device">
      <div className="flex items-center gap-1.5 border-b border-ink-600 bg-ink-700 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-ink-500" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-ink-500" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-ink-500" aria-hidden="true" />
        <span key={label} className="flow-title-in ml-3 text-xs font-medium text-mist-300">
          {label}
        </span>
      </div>
      <div ref={screenRef} className="relative aspect-[16/10] w-full overflow-hidden bg-ink-900">
        {staticImage ? (
          <img
            src={screenshot(staticImage.name)}
            alt={staticImage.alt}
            width={1600}
            height={1000}
            className="h-full w-full object-cover object-top"
          />
        ) : null}
      </div>
    </div>
  )
}
