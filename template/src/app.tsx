/* App root — sans tweaks panel, sans postMessage (brief §2.2) */
import { CallbackFab, Footer, MobileBar, Nav } from './shared';
import { Hero } from './hero';
import { Estimateur, Process, Services } from './sections';
import { Certifs, FAQ, Realisations, Testimonials, Zone } from './sections2';
import { ContactCTA } from './contact';

export function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Certifs />
        <Services />
        <Estimateur />
        <Process />
        <Realisations />
        <Testimonials />
        <Zone />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <CallbackFab />
      <MobileBar />
    </>
  );
}
