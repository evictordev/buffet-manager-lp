import { CONTACT_HREF, NAV_LINKS, SITE } from '../config/site'
import { Logo } from './ui/Logo'

const linkClass = 'text-mist-400 transition-colors hover:text-white'

export function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm leading-relaxed text-mist-400">
            Sistema de gestão para buffets de eventos: eventos, orçamentos, contratos, profissionais, utensílios e
            clientes em um só lugar.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="font-sans text-sm font-semibold tracking-normal">Navegação</h2>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={linkClass}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-normal">Contato</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href={CONTACT_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Falar pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-700">
        <p className="mx-auto max-w-7xl px-5 py-6 text-sm text-mist-500 sm:px-8">
          © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
