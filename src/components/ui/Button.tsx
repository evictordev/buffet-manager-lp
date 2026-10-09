import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant
  size?: 'md' | 'lg'
  children: ReactNode
}

const variants: Record<Variant, string> = {
  // Igual ao botão principal do sistema: fundo branco, texto escuro
  primary: 'bg-white text-ink-950 shadow-soft hover:bg-mist-100',
  secondary: 'border border-ink-500 bg-ink-800/70 text-white hover:border-violet-400/60 hover:bg-ink-700',
}

const sizes = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

/** Link estilizado como botão. Links externos recebem rel/target seguros. */
export function Button({ variant = 'primary', size = 'md', className = '', href, children, ...rest }: Props) {
  const external = typeof href === 'string' && /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
