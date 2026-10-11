---
name: Buffet Manager
description: Landing escura e calma, em navy profundo com acento de latão, que mostra o sistema real de gestão de buffets.
colors:
  ink-950: "#03031a"
  ink-900: "#07071f"
  ink-800: "#0e0f29"
  ink-700: "#171839"
  ink-600: "#23254d"
  ink-500: "#343766"
  mist-100: "#eef0ff"
  mist-300: "#c3c7e6"
  mist-400: "#9ba0c8"
  mist-500: "#7e84b0"
  white: "#ffffff"
  fuchsia-600: "#c026d3"
  indigo-600: "#4f46e5"
  emerald-500: "#10b981"
  amber-500: "#f59e0b"
  violet-600: "#7c3aed"
  brass-300: "#f0d49a"
  brass-400: "#e2b768"
  brass-500: "#c9963f"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque Variable, Inter Variable, ui-sans-serif, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
rounded:
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.mist-100}"
  button-secondary:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.ink-700}"
---

# Design System: Buffet Manager

## Overview

**Creative North Star: "O Salão à Meia-Luz"**

Um salão de festas à noite: o fundo é navy profundo, a luz é o latão quente do cloche e da comida, e o que está iluminado é o sistema real, com suas capturas de tela. A página é escura, sofisticada e calma. Confiança vem de contraste limpo e movimento suave, não de ruído.

A hierarquia é tipográfica e tonal. Títulos em Bricolage Grotesque, texto em Inter, camadas de navy separadas por tom e borda fina. As cores de destaque do sistema (fuchsia, indigo, emerald, amber, violet) aparecem como ícones e acentos, nunca como fundos de seção.

**Key Characteristics:**
- Tema escuro único, `color-scheme: dark`.
- Profundidade por camadas tonais, bordas finas, não por sombras pesadas.
- Botão principal branco sobre navy: o ponto mais claro da tela é a ação.
- Movimento com GSAP e curvas suaves, sempre com alternativa para `prefers-reduced-motion`.

## Colors

Navy quase preto como base, névoa lavanda para texto, cores de destaque do sistema usadas em pequenas doses.

### Primary
- **Branco de Ação** (#ffffff): fundo do botão principal e títulos. É a cor mais forte da página; usada onde o olhar deve parar.

### Secondary
- **Latão** (#f0d49a brass-300, #e2b768 brass-400, #c9963f brass-500): a luz quente do cloche e da comida. Anel de foco, ícones de lista, ponto ativo do carrossel, destaque da palavra digitada e bordas em hover. É o único acento de interface.
- **Violeta do Sistema** (#7c3aed): ícones de profissionais (tom do sistema, não de interface).

### Tertiary
- **Fúcsia** (#c026d3): eventos; seleção de texto.
- **Índigo** (#4f46e5): dashboard.
- **Esmeralda** (#10b981): utensílios.
- **Âmbar** (#f59e0b): quarto tom do ciclo de ícones.

### Neutral
- **Noite Profunda** (#03031a, ink-950): fundo da página.
- **Navy Fundo** (#07071f, ink-900) e **Navy Cartão** (#0e0f29, ink-800): superfícies elevadas.
- **Navy Realce** (#171839, ink-700): hover e estado ativo.
- **Navy Borda** (#23254d, ink-600) e (#343766, ink-500): divisores e bordas.
- **Névoa Clara** (#eef0ff, mist-100), **Névoa** (#c3c7e6, mist-300), **Névoa Média** (#9ba0c8, mist-400), **Névoa Apagada** (#7e84b0, mist-500): do texto de apoio ao rótulo discreto.

### Named Rules
**The Acento Pequeno Rule.** Fúcsia, índigo, esmeralda, âmbar e violeta ficam em ícones, brilhos e pequenos acentos. Nunca preenchem uma seção inteira.

**The Um Branco Rule.** O branco sólido é reservado ao botão principal e aos títulos. Se mais nada na tela é branco sólido, a ação se destaca sozinha.

## Typography

**Display Font:** Bricolage Grotesque Variable (com Inter Variable, sans-serif)
**Body Font:** Inter Variable (com system-ui, sans-serif)

**Character:** Bricolage dá personalidade e calor aos títulos; Inter mantém o texto corrente neutro e legível sobre fundo escuro.

### Hierarchy
- **Display** (600, 2.75rem no desktop, 2.25rem no mobile, 1.25): título de seção (h2).  Tracking -0.02em.
- **Headline** (600, 2.25rem no desktop, 1.75rem no mobile, 1.25): frase de benefício de cada bloco de funcionalidade (h3). 1.75rem no mobile mantém títulos longos em 3 linhas a partir de 360px.
- **Title** (500, 1.5rem no desktop, 1.25rem no mobile, 1.375): subtítulo de seção em mist-100.
- **Body** (400, 1.125rem, 1.625): descrição em mist-400; 1rem no mobile.
- **Label** (500, 0.875rem): links de navegação, botões e rótulos.

### Named Rules
**The Três Níveis Rule.** Seção abre com título, subtítulo e descrição, nessa ordem e com esse peso decrescente.

## Layout

Contêiner centralizado de até 80rem (max-w-7xl) com gutters de 20px no mobile e 32px a partir de `sm`. Cabeçalho fixo de 64px (72px em `lg`); âncoras compensam 5rem de `scroll-margin-top`. Seções alternam texto e captura de tela; blocos de recurso usam grade responsiva que empilha no mobile. Ritmo vertical generoso entre seções, espaçamento interno em múltiplos de 4px.

## Elevation & Depth

Híbrido: camadas tonais de navy como base, vidro desfocado e sombras longas e suaves só onde algo flutua. Nada de sombra dura.

### Shadow Vocabulary
- **Soft** (`0 1px 0 rgb(255 255 255 / 0.03) inset, 0 12px 30px -18px rgb(0 0 0 / 0.7)`): botão e cartão em repouso.
- **Float** (`0 24px 50px -24px rgb(0 0 0 / 0.75)`): elementos flutuantes.
- **Device** (`0 50px 100px -50px rgb(226 183 104 / 0.16), 0 30px 60px -30px rgb(0 0 0 / 0.8)`): capturas de tela, com halo de latão.
- **Icon tile** (`0 8px 24px -8px <cor do tom> / 0.7`): brilho colorido sob cada ícone.

### Named Rules
**The Latão Único Rule.** O latão é o único acento de interface. Violeta, fúcsia e índigo ficam nos tons do sistema e na luz de fundo do cloche, nunca em foco, hover ou destaque.

## Shapes

Cantos arredondados e suaves: 12px em cartões, 16px (`rounded-xl`) em botões e menus, 8px em links de navegação. Bordas de 1px em ink-500 ou branco a 10%. Ícones em tiles coloridos quadrados e arredondados.

## Components

### Buttons
- **Shape:** cantos de 16px.
- **Primary:** fundo branco, texto ink-950, padding 10px 16px (md) ou 14px 24px (lg), sombra Soft.
- **Hover / Focus:** fundo mist-100, sobe 2px; anel de foco brass-300 de 2px com offset de 2px. A seta do CTA oscila só no hover.
- **Secondary:** fundo ink-800 a 70%, borda ink-500, texto branco; no hover borda brass-400 a 50% e fundo ink-700.


### Navigation
- Cabeçalho fixo; transparente no topo, `ink-950/85` com blur e linha inferior após rolar. Links em mist-400, branco no hover; seção ativa com fundo ink-700. Menu de funcionalidades em dropdown com desfoque; no mobile vira painel em tela cheia com lista aninhada.

### Capturas de tela (assinatura)
- Capturas reais do sistema em molduras com sombra Device, às vezes sobrepostas para dar profundidade, em carrossel com entrada escalonada.

## Do's and Don'ts

### Do:
- **Do** manter o fundo em ink-950 e subir a elevação com ink-800/ink-700.
- **Do** reservar branco sólido ao botão principal e aos títulos.
- **Do** mostrar o sistema real com capturas verdadeiras.
- **Do** oferecer alternativa a toda animação sob `prefers-reduced-motion`.
- **Do** usar o anel de foco brass-300 em todo elemento interativo.

### Don't:
- **Don't** usar fúcsia, índigo, esmeralda ou âmbar como fundo de seção inteira.
- **Don't** usar sombras duras ou pretas puras sem desfoque longo.
- **Don't** criar uma versão clara da página: o tema é escuro.
- **Don't** inventar depoimentos, logos de clientes ou números.
