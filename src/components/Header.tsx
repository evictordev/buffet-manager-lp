import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { APP_HREF, CONTACT_HREF, NAV_LINKS } from '../config/site'
import { FEATURE_GROUPS } from '../data/content'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { Button } from './ui/Button'
import { Logo } from './ui/Logo'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Dropdown de funcionalidades: fecha com Esc e ao clicar fora
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [menuOpen])

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
        solid ? 'bg-ink-950/85 shadow-[0_1px_0_0_var(--color-ink-700)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[72px]">
        <a href="#inicio" aria-label="Buffet Manager — voltar ao início" className="rounded-lg">
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ id, label }) => {
            const linkClass = `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              active === id ? 'bg-ink-700 text-white' : 'text-mist-400 hover:text-white'
            }`

            if (id !== 'funcionalidades') {
              return (
                <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={linkClass}>
                  {label}
                </a>
              )
            }

            return (
              <div
                key={id}
                ref={dropdownRef}
                className={`group relative flex items-center rounded-lg transition-colors ${active === id ? 'bg-ink-700' : ''}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setMenuOpen(true)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setMenuOpen(false)}
              >
                <a href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={`rounded-lg py-2 pl-3.5 pr-1.5 text-sm font-medium transition-colors group-hover:text-white ${
                    active === id ? 'text-white' : 'text-mist-400'
                  }`}
                >
                  {label}
                </a>
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls="menu-funcionalidades"
                  aria-label="Categorias de funcionalidades"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`mr-1 flex size-9 items-center justify-center rounded-lg transition-colors group-hover:text-white ${
                    active === id ? 'text-white' : 'text-mist-400'
                  }`}
                >
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>

                {menuOpen ? (
                  <div className="absolute left-0 top-full z-50 w-60 pt-2">
                    <ul
                      id="menu-funcionalidades"
                      className="rounded-xl border border-white/10 bg-ink-900/95 p-1.5 shadow-[0_18px_36px_-16px_rgb(0_0_0/0.85)] backdrop-blur-md"
                    >
                      {FEATURE_GROUPS.map((group) => (
                        <li key={group.id}>
                          <a
                            href={`#${group.id}`}
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-mist-300 transition-colors hover:bg-ink-700 hover:text-white"
                          >
                            {group.eyebrow}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={APP_HREF} target="_self" variant="secondary" className="hover:translate-y-0! max-md:hidden">
            Acessar
          </Button>
          <Button href={CONTACT_HREF} className="px-3 hover:translate-y-0! sm:px-4">
            Teste grátis<span className="hidden sm:inline"> por 1 mês</span>
            <ArrowRight className="cta-arrow hidden size-4 min-[400px]:block" aria-hidden="true" />
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-white hover:bg-ink-700 md:hidden"
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
                {id === 'funcionalidades' ? (
                  <ul className="mb-1 ml-3 border-l border-ink-600 pl-3">
                    {FEATURE_GROUPS.map((group) => (
                      <li key={group.id}>
                        <a
                          href={`#${group.id}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-2.5 text-sm text-mist-300 hover:bg-ink-700 hover:text-white"
                        >
                          {group.eyebrow}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Button href={APP_HREF} target="_self" variant="secondary" size="lg" className="mt-3 w-full hover:translate-y-0!">
            Acessar o sistema
          </Button>
          <Button href={CONTACT_HREF} size="lg" className="mt-3 w-full hover:translate-y-0!" onClick={() => setOpen(false)}>
            Teste grátis por 1 mês
            <ArrowRight className="cta-arrow size-4" aria-hidden="true" />
          </Button>
        </nav>
      ) : null}
    </header>
  )
}
