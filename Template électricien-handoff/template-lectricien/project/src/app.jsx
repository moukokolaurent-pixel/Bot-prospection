/* APP ROOT */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "aere",
  "glass": 7,
  "heroVariant": "split"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);

  const setTweak = React.useCallback((keyOrObj, val) => {
    const edits = typeof keyOrObj === "object" && keyOrObj !== null
      ? keyOrObj : { [keyOrObj]: val };
    setTweaks((prev) => ({ ...prev, ...edits }));
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*"); } catch (e) {}
  }, []);

  // Apply density + glass to DOM
  React.useEffect(() => {
    document.body.dataset.density = tweaks.density;
    const g = Math.max(0, Math.min(10, tweaks.glass));
    const blur = 12 + g * 4;
    const bgA = 0.08 + g * 0.018;
    let style = document.getElementById("glass-tweak");
    if (!style) {
      style = document.createElement("style");
      style.id = "glass-tweak";
      document.head.appendChild(style);
    }
    style.textContent = `
      .glass {
        backdrop-filter: blur(${blur}px) saturate(1.6) !important;
        -webkit-backdrop-filter: blur(${blur}px) saturate(1.6) !important;
        background: linear-gradient(155deg, rgba(255,255,255,${bgA}) 0%, rgba(255,255,255,${bgA * 0.4}) 50%, rgba(255,199,0,${bgA * 0.7}) 100%) !important;
      }
    `;
  }, [tweaks.density, tweaks.glass]);

  return (
    <AppCtx.Provider value={{ tweaks, setTweak }}>
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
      <AppTweaks />
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
