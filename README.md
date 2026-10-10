# Buffet Manager — Landing page

React + TypeScript + Tailwind CSS v4 + GSAP/ScrollTrigger + Lucide, com Vite.
Visual no tema escuro do sistema (fundo navy, cartões fuchsia/indigo/emerald/amber).

## Rodar

```bash
npm install
cp .env.example .env   # preencha VITE_WHATSAPP_NUMBER
npm run dev
npm run build          # typecheck + build de produção
```

## O que ainda precisa de ajuste

1. **Contato**: `VITE_WHATSAPP_NUMBER` (somente dígitos, com 55 + DDD). Sem número, o botão abre o WhatsApp sem contato definido.
2. **Captura de Clientes**: ainda não existe. O bloco "Gestão de clientes" aparece só com texto. Para incluir uma imagem, salve `public/screenshots/clientes.webp` (1600×1000) e adicione `shot: { name: 'clientes', ... }` em `src/data/content.ts`.
3. **Cores**: as cores foram estimadas das capturas. Para usar os hex exatos do sistema, ajuste `@theme` em `src/index.css`.
4. **Logotipo**: `src/components/ui/Logo.tsx` reproduz a marca da tela de login (chapéu de chef). Troque pelo arquivo oficial, se houver.
5. **Domínio**: ao publicar, adicione `canonical`, `og:url` e `og:image` no `index.html`.

## Capturas de tela

Ficam em `public/screenshots/*.webp` (1600×1000). Para trocar uma, substitua o arquivo mantendo o nome:
`dashboard`, `dashboard-utensilios`, `eventos`, `orcamentos`, `contratos`, `pacotes`, `folha-pagamento`, `utensilios`.
Se algum arquivo faltar, a página mostra um espaço reservado neutro.

## Estrutura

```
src/
  components/   Header, HeroSection, FeaturesSection, FeatureShowcase,
                ProductDemoSection, FinalCTASection, Footer, ui/
  data/content.ts   textos e recursos (baseados nas funcionalidades reais)
  config/site.ts    nome, contato, navegação, caminho das capturas
  hooks/useGsapScope.ts   escopo GSAP com matchMedia e limpeza automática
  lib/              registro do ScrollTrigger, revelações por data-attributes, cores dos ícones
```

## Animações

- Só `transform` e `opacity`; `gsap.from` mantém o conteúdo visível se algo falhar.
- `prefers-reduced-motion: reduce` desativa todas as animações.
- Abaixo de 768px ficam só as revelações simples (sem parallax nem flutuação).
- Tudo é desfeito na desmontagem (`gsap.matchMedia().revert()`).
