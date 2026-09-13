import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { TrustBar } from './components/sections/TrustBar';
import { ProblemSection } from './components/sections/ProblemSection';
import { SolutionSection } from './components/sections/SolutionSection';
import { ShowcaseSection } from './components/sections/ShowcaseSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { IpcpSection } from './components/sections/IpcpSection';
import { CtaSection } from './components/sections/CtaSection';
import { FaqSection } from './components/sections/FaqSection';
import { AboutTeamSection } from './components/sections/AboutTeamSection';
import { DownloadAppSection } from './components/sections/DownloadAppSection';
import { ComingSoonSection } from './components/sections/ComingSoonSection';

export default function LandingPage() {
  return (
    <div className='landing'>
      <Navbar />

      <main>
        <Hero />
        <TrustBar />
        <ProblemSection />
        <SolutionSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <IpcpSection />
        <AboutTeamSection />
        <DownloadAppSection />
        <CtaSection />
        <FaqSection />
      </main>

      <ComingSoonSection />

      <Footer />
    </div>
  );
}