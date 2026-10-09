import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { screenshot } from '../../config/site'

type Variant = 'laptop' | 'browser'

type Props = {
  /** Nome do arquivo em public/screenshots (sem extensão). */
  name: string
  alt: string
  label: string
  variant?: Variant
  priority?: boolean
  className?: string
}

/**
 * Moldura (notebook ou janela de navegador) para as capturas reais do sistema.
 * Se a captura não existir em public/screenshots, mostra um espaço reservado neutro,
 * sem desenhar interfaces fictícias.
 */
export function ScreenshotFrame({ name, alt, label, variant = 'laptop', priority = false, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  const screen = (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-900">
      {failed ? (
        <div
          role="img"
          aria-label={`Espaço reservado para a captura de tela: ${label}`}
          className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center"
        >
          <ImageOff className="size-7 text-mist-500" aria-hidden="true" />
          <p className="text-sm font-medium text-mist-300">{label}</p>
          {import.meta.env.DEV ? (
            <p className="text-xs text-mist-500">
              Adicione a captura em <code className="rounded bg-ink-700 px-1 py-0.5">public/screenshots/{name}.webp</code>
            </p>
          ) : null}
        </div>
      ) : (
        <img
          src={screenshot(name)}
          alt={alt}
          width={1600}
          height={1000}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      )}
    </div>
  )

  if (variant === 'browser') {
    return (
      <div className={`overflow-hidden rounded-2xl border border-ink-500 bg-ink-800 shadow-device ${className}`}>
        <div className="flex items-center gap-1.5 border-b border-ink-600 bg-ink-700 px-4 py-2.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-ink-500" />
          <span className="size-2.5 rounded-full bg-ink-500" />
          <span className="size-2.5 rounded-full bg-ink-500" />
        </div>
        {screen}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="rounded-[1.1rem] border border-ink-500 bg-ink-700 p-2 shadow-device sm:p-2.5">
        <div className="overflow-hidden rounded-lg">{screen}</div>
      </div>
      <div
        className="mx-auto -mt-px h-2.5 w-[106%] -translate-x-[2.8%] rounded-b-2xl border-x border-b border-ink-500 bg-gradient-to-b from-ink-600 to-ink-700 sm:h-3"
        aria-hidden="true"
      />
    </div>
  )
}
