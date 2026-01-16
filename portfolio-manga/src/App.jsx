import SmoothScroll from './components/SmoothScroll'
import Hero from './components/Hero'
import StackMarquee from './components/StackMarquee'
import Projects from './components/Projects'
import { PORTFOLIO_DATA } from './lib/data'

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* Stack Marquee */}
        <StackMarquee />

        {/* About Section */}
        <section className="min-h-screen flex items-center justify-center px-8">
          <div className="max-w-4xl">
            <h2 className="text-6xl font-bold mb-8 text-outline-thick">
              {PORTFOLIO_DATA.about.title}
            </h2>
            <p className="text-2xl leading-relaxed mb-6">
              {PORTFOLIO_DATA.about.description}
            </p>
            <p className="text-xl font-bold tracking-widest">
              {PORTFOLIO_DATA.about.mission}
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <Projects />
      </div>
    </SmoothScroll>
  )
}

export default App
