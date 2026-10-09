import { ChefHat } from 'lucide-react'
import { SITE } from '../../config/site'

/** Marca igual à da tela de login do sistema: chapéu de chef em círculo claro. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-full bg-mist-100 text-ink-950" aria-hidden="true">
        <ChefHat className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-white">{SITE.name}</span>
    </span>
  )
}
