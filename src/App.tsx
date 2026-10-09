import { DifferentialsSection } from './components/DifferentialsSection'
import { FeaturesSection } from './components/FeaturesSection'
import { FinalCTASection } from './components/FinalCTASection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ProductDemoSection } from './components/ProductDemoSection'

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-stone-900 focus:shadow-float"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <HeroSection />
        <FeaturesSection />
        <ProductDemoSection />
        <DifferentialsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
