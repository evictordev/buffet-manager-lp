import type { RefObject } from 'react'
import { screenshot } from '../../config/site'

type Props = {
  label: string
  /** Moldura inteira: alvo onde a imagem principal animada pousa. */
  frameRef: RefObject<HTMLDivElement | null>
  /** Sem animação (prefers-reduced-motion), a imagem principal é exibida aqui mesmo. */
  staticImage?: { name: string; alt: string } | null
}

/**
 * Espaço reservado da imagem principal. Com a animação, ele fica invisível: o molde (moldura de
 * navegador) viaja junto com cada imagem, então nada aparece vazio. Mesma proporção das imagens
 * animadas (16:11, barra de título com 1/11 da altura).
 */
export function FlowMainFrame({ label, frameRef, staticImage }: Props) {
  return (
    <div
      ref={frameRef}
      className={`flex aspect-[16/11] w-full flex-col overflow-hidden rounded-2xl border border-ink-500 bg-ink-800 shadow-device ${
        staticImage ? '' : 'invisible'
      }`}
    >
      <div className="flex h-[9.0909%] shrink-0 items-center gap-1.5 border-b border-ink-600 bg-ink-700 px-4">
        <span className="size-2.5 rounded-full bg-ink-500" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-ink-500" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-ink-500" aria-hidden="true" />
        <span className="ml-3 text-xs font-medium text-mist-300">{label}</span>
      </div>
      {staticImage ? (
        <img
          src={screenshot(staticImage.name)}
          alt={staticImage.alt}
          width={1600}
          height={1000}
          className="min-h-0 w-full flex-1 object-cover object-top"
        />
      ) : (
        <div className="min-h-0 flex-1" />
      )}
    </div>
  )
}
