import {
  BadgeCheck,
  Banknote,
  CalendarClock,
  ListChecks,
  ListOrdered,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { Tone } from '../lib/tones'

export type FeatureItem = { icon: LucideIcon; title: string; text: string }

export type ShotRef = { name: string; alt: string; label: string }

export type FeatureGroup = {
  id: string
  eyebrow: string
  title: string
  description: string
  tone: Tone
  items: FeatureItem[]
  /** Captura principal. Sem captura, o bloco é exibido só com texto. */
  shot?: ShotRef
  /** Segunda captura, sobreposta à principal para dar profundidade. */
  secondaryShot?: ShotRef
  /** Capturas menores exibidas abaixo do bloco (grupo em destaque). */
  gallery?: ShotRef[]
  /** Vídeo exibido como último slide; com ele, as capturas viram um carrossel. */
  /** Botão de chamada para ação exibido sob a descrição do bloco. */
  cta?: { label: string }
  /** Troca a galeria pela animação de cards (a galeria vira as categorias). */
  flow?: boolean
  /** Exibe a descrição abaixo da imagem principal, em vez de junto ao título. */
  descriptionBelowImage?: boolean
  /** Lista animada de utensílios exibida no lugar da imagem (valores ilustrativos). */
  utensilList?: { name: string; quantity: string; price: string }[]
  video?: { src: string; alt: string; label: string }
  highlight?: boolean
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'dashboard',
    eyebrow: 'Dashboard',
    title: 'Tudo o que acontece no seu buffet, em uma só tela',
    description:
      'O dashboard é o ponto de partida da operação: reúne as informações relevantes do buffet em uma única tela, para você acompanhar o que importa sem abrir vários controles.',
    tone: 'indigo',
    items: [],
    shot: {
      name: 'dashboard-utensilios',
      alt: 'Painel de utensílios e perdas no dashboard do Buffet Manager',
      label: 'Utensílios e perdas',
    },
    secondaryShot: {
      name: 'dashboard',
      alt: 'Dashboard do Buffet Manager com indicadores e calendário de eventos',
      label: 'Dashboard',
    },
    cta: { label: 'Teste grátis por 1 mês' },
    video: {
      src: 'videos/dashboard.mp4',
      alt: 'Vídeo do dashboard do Buffet Manager em funcionamento',
      label: 'Dashboard em uso',
    },
  },
  {
    id: 'eventos',
    eyebrow: 'Gestão de eventos',
    title: 'Cada etapa do evento, do orçamento à conferência',
    description:
      'Do primeiro contato com o cliente até o dia da festa, acompanhe tudo em um mesmo fluxo. Menos papéis e mensagens soltas, mais clareza sobre o que já foi combinado e o que ainda falta.',
    tone: 'fuchsia',
    highlight: true,
    flow: true,
    items: [],
    shot: { name: 'eventos', alt: 'Tela de gestão de eventos do Buffet Manager', label: 'Gestão de eventos' },
    gallery: [
      { name: 'orcamentos', alt: 'Lista de orçamentos do Buffet Manager', label: 'Orçamentos' },
      { name: 'contratos', alt: 'Contratos assinados no Buffet Manager', label: 'Contratos' },
      { name: 'pacotes', alt: 'Detalhes de um pacote de eventos no Buffet Manager', label: 'Pacotes de eventos' },
    ],
  },
  {
    id: 'profissionais',
    eyebrow: 'Gestão de profissionais',
    title: 'Sua equipe organizada, com cada profissional na função certa',
    description:
      'Mantenha os dados, as funções e a disponibilidade da equipe à mão para montar cada evento com mais segurança e acompanhar as informações de pagamento.',
    tone: 'violet',
    descriptionBelowImage: true,
    items: [
      {
        icon: Users,
        title: 'Profissionais',
        text: 'Mantenha os dados da equipe centralizados.',
      },
      {
        icon: Banknote,
        title: 'Folha de Pagamento',
        text: 'Organize as informações de pagamento dos profissionais.',
      },
      {
        icon: CalendarClock,
        title: 'Disponibilidade',
        text: 'Acompanhe a disponibilidade da equipe.',
      },
      {
        icon: BadgeCheck,
        title: 'Cargos',
        text: 'Organize os cargos e as funções dos profissionais.',
      },
    ],
    shot: { name: 'folha-pagamento', alt: 'Folha de pagamento dos profissionais no Buffet Manager', label: 'Folha de pagamento' },
  },
  {
    id: 'utensilios',
    eyebrow: 'Catálogo de utensílios',
    title: 'Os recursos do buffet sempre catalogados',
    description:
      'Cadastre e organize os utensílios usados na operação. Com o catálogo em ordem, fica mais simples saber quais recursos estão disponíveis para cada evento.',
    tone: 'emerald',
    utensilList: [
      { name: 'Taças', quantity: '498 un.', price: 'R$ 6,00' },
      { name: 'Pratos', quantity: '475 un.', price: 'R$ 8,50' },
      { name: 'Garfos', quantity: '418 un.', price: 'R$ 3,50' },
      { name: 'Facas', quantity: '404 un.', price: 'R$ 3,50' },
      { name: 'Panelas de barro', quantity: '40 un.', price: 'R$ 45,00' },
      { name: 'Tampas de barro', quantity: '24 un.', price: 'R$ 18,00' },
      { name: 'Rechauds de barro', quantity: '8 un.', price: 'R$ 120,00' },
    ],
    items: [
      {
        icon: ListChecks,
        title: 'Cadastro de utensílios',
        text: 'Registre os itens utilizados na operação.',
      },
      {
        icon: ListOrdered,
        title: 'Catálogo organizado',
        text: 'Pesquise, ordene e acompanhe os recursos disponíveis.',
      },
    ],
    shot: { name: 'utensilios', alt: 'Gestão de utensílios do Buffet Manager', label: 'Catálogo de utensílios' },
  },
]

export const DEMO_SCREENS: (ShotRef & { tone: Tone })[] = [
  { name: 'dashboard', alt: 'Dashboard do Buffet Manager', label: 'Dashboard', tone: 'indigo' },
  { name: 'eventos', alt: 'Gestão de eventos no Buffet Manager', label: 'Eventos', tone: 'fuchsia' },
  { name: 'orcamentos', alt: 'Orçamentos no Buffet Manager', label: 'Orçamentos', tone: 'fuchsia' },
  { name: 'contratos', alt: 'Contratos no Buffet Manager', label: 'Contratos', tone: 'fuchsia' },
  { name: 'pacotes', alt: 'Pacotes de eventos no Buffet Manager', label: 'Pacotes', tone: 'fuchsia' },
  { name: 'folha-pagamento', alt: 'Folha de pagamento no Buffet Manager', label: 'Folha de pagamento', tone: 'violet' },
  { name: 'utensilios', alt: 'Gestão de utensílios no Buffet Manager', label: 'Utensílios', tone: 'emerald' },
  { name: 'dashboard-utensilios', alt: 'Utensílios e perdas no dashboard do Buffet Manager', label: 'Utensílios e perdas', tone: 'emerald' },
]
