import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CONTACT_HREF, NAV_LINKS } from '../config/site'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { Button } from './ui/Button'
import { Logo } from './ui/Logo'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  // Fundo do cabeçalho muda após rolar um pouco
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaca o link da seção visível (ScrollTrigger)
  useEffect(() => {
    const ctx = gsap.context(() => {
      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) setActive(id)
            else setActive((current) => (current === id ? null : current))
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  // Menu mobile: fecha com Esc e trava a rolagem do fundo
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid ? 'bg-ink-950/85 shadow-[0_1px_0_0_#171839] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[72px]">
        <a href="#inicio" aria-label="Buffet Manager — voltar ao início" className="rounded-lg">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active === id ? 'bg-ink-700 text-white' : 'text-mist-400 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={CONTACT_HREF} className="hidden sm:inline-flex">
            Conhecer o sistema
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-ink-700 md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-mobile"
          aria-label="Menu mobile"
          className="border-t border-ink-600 bg-ink-950 px-5 pb-6 pt-3 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3.5 text-base font-medium text-white hover:bg-ink-700"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={CONTACT_HREF} size="lg" className="mt-3 w-full" onClick={() => setOpen(false)}>
            Conhecer o sistema
          </Button>
        </nav>
      ) : null}
    </header>
  )
}
