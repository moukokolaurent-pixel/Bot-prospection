/* HERO — 3 variations en Tweaks */

const { useEffect: useEffectH, useState: useStateH, useRef: useRefH } = React;

function HeroBackground() {
  const orb1 = useParallax(-0.35);
  const orb2 = useParallax(0.25);
  const grid = useParallax(0.12);
  return (
    <>
      {/* Photo backdrop */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img src="assets/hero-template.jpg" alt=""
        className="kenburns"
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.42 }} />
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(11,14,16,0.55) 0%, rgba(11,14,16,0.78) 70%, rgba(11,14,16,0.95) 100%)" }} />
      </div>

      {/* Dot grid */}
      <div ref={grid} className="parallax" style={{
        position: "absolute", inset: "-10% 0",
        backgroundImage: "radial-gradient(circle, rgba(255,199,0,0.18) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        opacity: 0.6, pointerEvents: "none"
      }} />

      {/* Orbs */}
      <div ref={orb1} className="parallax" style={{
        position: "absolute", top: "-15%", left: "-10%", width: 720, height: 720,
        background: "radial-gradient(circle, rgba(255,199,0,0.45) 0%, rgba(255,199,0,0) 65%)",
        filter: "blur(80px)", pointerEvents: "none"
      }} />
      <div ref={orb2} className="parallax" style={{
        position: "absolute", bottom: "-25%", right: "-15%", width: 820, height: 820,
        background: "radial-gradient(circle, rgba(182,255,60,0.28) 0%, rgba(182,255,60,0) 65%)",
        filter: "blur(100px)", pointerEvents: "none"
      }} />

      {/* Animated bolt SVG */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.45 }}>
        <defs>
          <linearGradient id="boltgrad" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FFC700" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B6FF3C" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M 0,420 Q 180,380 320,420 T 640,400 T 960,420 T 1440,380" fill="none" stroke="url(#boltgrad)" strokeWidth="1.2" className="circuit-line" />
        <path d="M 0,520 Q 220,540 380,500 T 700,520 T 1080,500 T 1440,540" fill="none" stroke="url(#boltgrad)" strokeWidth="1" className="circuit-line" style={{ animationDelay: "1s" }} />
        <g className="bolt-glow" style={{ transformOrigin: "center" }}>
          <path d="M 750,140 L 720,300 L 800,300 L 760,480 L 900,260 L 820,260 L 850,140 Z"
          fill="url(#boltgrad)" stroke="rgba(255,199,0,0.8)" strokeWidth="1" />
        </g>
      </svg>

      {/* Bottom fade — multi-stop, smooth into next section */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 380,
        background: "linear-gradient(180deg, rgba(11,14,16,0) 0%, rgba(11,14,16,0.35) 35%, rgba(11,14,16,0.85) 75%, var(--ink) 100%)",
        pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 80,
        background: "linear-gradient(180deg, transparent 0%, var(--ink) 100%)",
        pointerEvents: "none" }} />
    </>);

}

function DevisExpressGlass() {
  const [step, setStep] = useStateH(0);
  const [picked, setPicked] = useStateH(null);
  const [urgency, setUrgency] = useStateH(null);
  const [phone, setPhone] = useStateH("");
  const services = [
  { id: "depan", label: "Dépannage urgent", est: "80 – 280 €" },
  { id: "tab", label: "Tableau électrique", est: "950 – 1 800 €" },
  { id: "borne", label: "Borne de recharge", est: "1 400 – 2 400 €" },
  { id: "domo", label: "Domotique / connecté", est: "600 – 4 500 €" },
  { id: "renov", label: "Rénovation totale", est: "6 500 – 18 000 €" },
  { id: "audit", label: "Audit / diagnostic", est: "150 €" }];

  const urgencies = [
  { id: "now", label: "Aujourd'hui", desc: "Intervention sous 2 h" },
  { id: "wk", label: "Cette semaine", desc: "Sous 48 h" },
  { id: "plan", label: "Sans urgence", desc: "Devis posé" }];


  const reset = () => {setStep(0);setPicked(null);setUrgency(null);setPhone("");};

  return (
    <div className="glass" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
      {/* Glow orb in card */}
      <div style={{ position: "absolute", top: -120, right: -120, width: 320, height: 320,
        background: "radial-gradient(circle, rgba(255,199,0,0.45), transparent 65%)",
        filter: "blur(40px)", pointerEvents: "none" }} />

      <div className="row between center" style={{ marginBottom: 22, position: "relative" }}>
        <div className="row center gap-8">
          <span className="dot-pulse" />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(245,245,243,0.85)" }}>
            Devis express · 60 sec
          </span>
        </div>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "rgba(245,245,243,0.5)" }}>
          {String(step + 1).padStart(2, "0")} / 03
        </span>
      </div>

      <div style={{ position: "relative", minHeight: 320 }}>
        {step === 0 &&
        <div style={{ animation: "pageIn 0.5s var(--e-smooth)" }}>
            <h3 style={{ color: "#F5F5F3", fontSize: 20, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
              Quel chantier<br /><span className="grad-text">vous occupe ?</span>
            </h3>
            <p style={{ fontSize: 13, color: "rgba(245,245,243,0.6)", marginBottom: 20 }}>Choix unique · sans engagement</p>
            <div className="col gap-8">
              {services.map((s) =>
            <button key={s.id} onClick={() => {setPicked(s);setStep(1);}}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              color: "#F5F5F3", fontSize: 14, fontWeight: 500,
              transition: "all 0.4s var(--e-smooth)", textAlign: "left"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,199,0,0.16)";
              e.currentTarget.style.borderColor = "rgba(255,199,0,0.45)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              e.currentTarget.style.transform = "translateX(0)";
            }}>
                  <span>{s.label}</span>
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)" }}>{s.est}</span>
                </button>
            )}
            </div>
          </div>
        }

        {step === 1 &&
        <div style={{ animation: "pageIn 0.5s var(--e-smooth)" }}>
            <button onClick={() => setStep(0)} style={{ fontSize: 11, color: "rgba(245,245,243,0.6)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>← Retour</button>
            <h3 style={{ color: "#F5F5F3", fontSize: 20, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 6 }}>
              C'est<br /><span className="grad-text">pour quand ?</span>
            </h3>
            <p style={{ fontSize: 13, color: "rgba(245,245,243,0.6)", marginBottom: 20 }}>{picked?.label} · {picked?.est}</p>
            <div className="col gap-10">
              {urgencies.map((u) =>
            <button key={u.id} onClick={() => {setUrgency(u);setStep(2);}}
            style={{
              padding: "16px 18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14, color: "#F5F5F3",
              transition: "all 0.4s var(--e-smooth)", textAlign: "left"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,199,0,0.16)";
              e.currentTarget.style.borderColor = "rgba(255,199,0,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
            }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{u.label}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(245,245,243,0.55)", marginTop: 2 }}>{u.desc}</div>
                </button>
            )}
            </div>
          </div>
        }

        {step === 2 &&
        <div style={{ animation: "pageIn 0.5s var(--e-smooth)" }}>
            <button onClick={() => setStep(1)} style={{ fontSize: 11, color: "rgba(245,245,243,0.6)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>← Retour</button>
            <h3 style={{ color: "#F5F5F3", fontSize: 20, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
              Votre numéro,<br /><span className="grad-text">on s'occupe du reste.</span>
            </h3>
            <div style={{ padding: 14, background: "rgba(182,255,60,0.10)", border: "1px solid rgba(182,255,60,0.25)", borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "rgba(245,245,243,0.6)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Votre demande</div>
              <div style={{ color: "#F5F5F3", fontSize: 13.5 }}>{picked?.label} · {urgency?.label}</div>
            </div>
            <div className="field" style={{ marginBottom: 20 }}>
              <label style={{ color: "rgba(245,245,243,0.6)" }}>Téléphone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 …"
            style={{ color: "#F5F5F3", borderBottomColor: "rgba(255,255,255,0.20)" }} />
            </div>
            <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center" }}
          disabled={phone.length < 4}
          onClick={() => phone.length >= 4 && setStep(3)}>
              Recevoir mon estimation <IconArrowRight size={13} />
            </button>
          </div>
        }

        {step === 3 &&
        <div style={{ animation: "pageIn 0.5s var(--e-smooth)" }}>
            <div style={{ width: 56, height: 56, background: "var(--grad-accent)", color: "var(--accent-deep)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 16, marginBottom: 20,
            boxShadow: "0 0 40px rgba(255,199,0,0.5)" }}>
              <IconCheck size={26} />
            </div>
            <h3 style={{ color: "#F5F5F3", fontSize: 22, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
              Reçu.<br /><span className="grad-text">À tout de suite.</span>
            </h3>
            <p style={{ fontSize: 14, color: "rgba(245,245,243,0.7)", lineHeight: 1.55, marginBottom: 22 }}>
              On vous rappelle au <strong style={{ color: "#F5F5F3" }}>{phone}</strong> sous {urgency?.id === "now" ? "10 minutes" : "2 h ouvrées"}, avec une estimation chiffrée pour <strong style={{ color: "var(--accent)" }}>{picked?.label}</strong>.
            </p>
            <button onClick={reset} className="btn"
          style={{ background: "rgba(255,255,255,0.08)", color: "#F5F5F3", border: "1px solid rgba(255,255,255,0.15)" }}>
              Nouvelle demande
            </button>
          </div>
        }
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "22px 0 16px" }} />
      <div className="row between center" style={{ fontSize: 11, color: "rgba(245,245,243,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
        <span className="row center gap-8"><IconShield size={11} color="var(--accent-2)" /> Devis gratuit</span>
        <span className="row center gap-8"><IconCheck size={11} color="var(--accent-2)" /> Sans engagement</span>
        <span className="row center gap-8"><IconClock size={11} color="var(--accent-2)" /> &lt; 24 h</span>
      </div>
    </div>);

}

/* HERO LAYOUTS */
function HeroSplit() {
  return (
    <section id="top" style={{ position: "relative", minHeight: "100vh", paddingTop: 40, overflow: "hidden", background: "var(--dark)", color: "#F5F5F3" }}>
      <HeroBackground />

      <div className="container-wide" style={{ position: "relative", paddingTop: 100, paddingBottom: 120 }}>
        <div className="grid" style={{ gridTemplateColumns: "1.15fr 0.85fr", gap: 80, alignItems: "center" }}>
          <div className="page-enter">
            <div className="row center gap-12" style={{ marginBottom: 32 }}>
              <span style={{ display: "inline-flex", padding: "8px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,199,0,0.25)", borderRadius: 999, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                <span className="dot-pulse" style={{ marginRight: 8 }} /> Disponible aujourd'hui
              </span>
              <span style={{ fontSize: 11.5, color: "rgba(245,245,243,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
                Montpellier · Hérault (34)
              </span>
            </div>

            <h1 className="display" style={{ fontSize: "clamp(40px, 5.3vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.045em", marginBottom: 28, color: "#F5F5F3" }}>
              Votre électricien.<br />
              <span style={{ color: "rgba(245,245,243,0.45)" }}>à Montpellier</span><br />
              <span className="grad-text">Sous 2 h.</span>
            </h1>

            <p style={{ fontSize: 19, lineHeight: 1.55, color: "rgba(245,245,243,0.72)", maxWidth: 540, marginBottom: 48 }}>
              Dépannage, mise aux normes, domotique, bornes de recharge. Un artisan certifié, des devis chiffrés avant signature, des chantiers livrés dans les délais. Partout dans l'Hérault.
            </p>

            <div className="row center gap-16" style={{ flexWrap: "wrap", marginBottom: 64 }}>
              <button className="btn btn-accent" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Devis gratuit · 60 sec <IconArrowRight size={14} />
              </button>
              <a href="tel:+33602409147" className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#F5F5F3", border: "1px solid rgba(255,255,255,0.15)" }}>
                <IconPhone size={13} /> 06 02 40 91 47
              </a>
            </div>

            <div className="row" style={{ gap: 44, flexWrap: "wrap" }}>
              {[
              { v: "117", l: "chantiers livrés" },
              { v: "100%", l: "satisfaction client" },
              { v: "<2 h", l: "intervention urgence" },
              { v: "4.9/5", l: "avis Google" }].
              map((s) =>
              <div key={s.l}>
                  <div style={{ fontSize: 32, fontWeight: 600, fontFamily: "'Inter Tight', sans-serif", letterSpacing: "-0.04em", color: "#F5F5F3" }}>{s.v}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(245,245,243,0.5)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 4 }}>{s.l}</div>
                </div>
              )}
            </div>
          </div>

          <div className="page-enter" style={{ animationDelay: "0.2s" }}>
            <DevisExpressGlass />
          </div>
        </div>

        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-hint-bar" />
        </div>
      </div>
    </section>);

}

/* Variant B — large headline centré, glass card flottante en bas */
function HeroFloat() {
  return (
    <section id="top" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "var(--dark)", color: "#F5F5F3", paddingBottom: 80 }}>
      <HeroBackground />
      <div className="container-wide" style={{ position: "relative", paddingTop: 140, paddingBottom: 60, textAlign: "center" }}>
        <div className="page-enter">
          <span style={{ display: "inline-flex", padding: "8px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,199,0,0.25)", borderRadius: 999, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 32 }}>
            <span className="dot-pulse" style={{ marginRight: 10 }} /> Électricien certifié · Hérault
          </span>
          <h1 className="display" style={{ fontSize: "clamp(46px, 6.3vw, 118px)", lineHeight: 0.92, letterSpacing: "-0.05em", color: "#F5F5F3", marginBottom: 24 }}>
            L'électricité.<br />
            <span className="grad-text">Vraiment simple.</span>
          </h1>
          <p style={{ fontSize: 20, color: "rgba(245,245,243,0.7)", maxWidth: 620, margin: "0 auto 40px", lineHeight: 1.5 }}>
            Devis chiffrés en 60 secondes, intervention sous 2 h, garantie 2 ans sur main-d'œuvre. Vous savez où vous allez avant de signer.
          </p>
          <div className="row center" style={{ gap: 14, justifyContent: "center", marginBottom: 80 }}>
            <button className="btn btn-accent">Estimer mon chantier <IconArrowRight size={14} /></button>
            <a href="tel:+33602409147" className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "#F5F5F3", border: "1px solid rgba(255,255,255,0.15)" }}>
              <IconPhone size={13} /> Appeler maintenant
            </a>
          </div>
        </div>
        <div className="page-enter" style={{ animationDelay: "0.2s", maxWidth: 540, margin: "0 auto" }}>
          <DevisExpressGlass />
        </div>
      </div>
    </section>);

}

/* Variant C — Stack vertical avec gros chiffres typo */
function HeroEditorial() {
  return (
    <section id="top" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "var(--dark)", color: "#F5F5F3" }}>
      <HeroBackground />
      <div className="container-wide" style={{ position: "relative", paddingTop: 110, paddingBottom: 80 }}>
        <div className="row between" style={{ alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 32 }}>
          <div className="page-enter" style={{ flex: "1 1 600px" }}>
            <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 28 }}>SSUN ELEC · 2024–2026 · MONTPELLIER</div>
            <h1 className="display" style={{ fontSize: "clamp(42px, 6.3vw, 110px)", lineHeight: 0.9, letterSpacing: "-0.05em", color: "#F5F5F3" }}>
              Branchez.<br />
              <span style={{ color: "rgba(245,245,243,0.4)" }}>Vivez.</span><br />
              <span className="grad-text">Oubliez-nous.</span>
            </h1>
          </div>
          <div className="page-enter" style={{ flex: "0 0 320px", animationDelay: "0.2s" }}>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(245,245,243,0.7)", marginBottom: 24 }}>
              Un artisan, deux mains, zéro sous-traitance. On installe propre, on documente tout, on garantit deux ans.
            </p>
            <button className="btn btn-accent">Démarrer un projet <IconArrowRight size={14} /></button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "stretch" }}>
          <div className="page-enter" style={{ animationDelay: "0.3s" }}>
            <DevisExpressGlass />
          </div>
          <div className="page-enter" style={{ animationDelay: "0.4s", display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            {[
            { num: "117", k: "Chantiers livrés", v: "Depuis 2024" },
            { num: "100", suffix: "%", k: "Satisfaction client", v: "Avis vérifiés" }].
            map((s) =>
            <div key={s.k} style={{
              padding: 32, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24,
              backdropFilter: "blur(16px)", display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
                <div className="eyebrow" style={{ color: "rgba(245,245,243,0.5)" }}>{s.k}</div>
                <div>
                  <span style={{ fontSize: 110, fontWeight: 500, lineHeight: 0.85, letterSpacing: "-0.05em", color: "#F5F5F3" }}>{s.num}</span>
                  {s.suffix && <span style={{ fontSize: 60, color: "var(--accent)", fontWeight: 500 }}>{s.suffix}</span>}
                </div>
                <div style={{ fontSize: 12, color: "rgba(245,245,243,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>{s.v}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

function Hero() {
  const { tweaks } = useApp();
  const v = tweaks.heroVariant || "split";
  if (v === "float") return <HeroFloat />;
  if (v === "editorial") return <HeroEditorial />;
  return <HeroSplit />;
}

Object.assign(window, { Hero });