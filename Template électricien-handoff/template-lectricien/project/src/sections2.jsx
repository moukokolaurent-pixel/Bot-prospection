/* Sections 2 : Avant/Après modal + Témoignages + Zone + FAQ + CTA */

const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

/* ---------- AVANT / APRÈS RÉALISATIONS ---------- */
function Realisations() {
  const cases = [
  { id: 1, title: "Tableau électrique vétuste → conforme NF C 15-100", lieu: "Castelnau-le-Lez · T4 · 95 m²",
    cat: "Mise aux normes", durée: "2 jours", color: "#FFC700",
    avant: "Tableau année 80, fusibles porcelaine, terre absente. 3 disjonctions par jour, dangereux.",
    apres: "Tableau modulaire 4 rangées, 12 différentiels 30 mA, parafoudre, terre rétablie. Consuel validé.",
    url: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80" },
  { id: 2, title: "Domotique complète Apple Home", lieu: "Montpellier centre · Maison · 140 m²",
    cat: "Domotique", durée: "5 jours", color: "#B6FF3C",
    avant: "Volets manuels, chauffage individuel non pilotable, alarme datée, +850 €/an de chauffage.",
    apres: "12 volets motorisés, thermostats Netatmo, alarme Somfy, scénarios HomeKit. -32% facture chauffage.",
    url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80" },
  { id: 3, title: "Borne de recharge IRVE Wallbox 11 kW", lieu: "Pérols · Maison individuelle",
    cat: "Borne IRVE", durée: "1 jour", color: "#FFE13B",
    avant: "Câble rallonge depuis garage, 8h de charge complète, risque échauffement.",
    apres: "Wallbox Pulsar Max 11 kW, ligne dédiée 32 A, 2h30 de charge. Crédit d'impôt 500 €.",
    url: "https://images.unsplash.com/photo-1647500666543-ee16cda13a4f?w=1200&q=80" },
  { id: 4, title: "Éclairage architectural cuisine + salon", lieu: "Lattes · Appartement neuf",
    cat: "Éclairage LED", durée: "3 jours", color: "#FFC700",
    avant: "Plafonniers banals, ambiance plate, conso éclairage 1 200 kWh/an.",
    apres: "Rubans LED encastrés, spots orientables, dimmer Lutron, 340 kWh/an. -72% conso.",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80" }];


  const [filter, setFilter] = useState2("Tous");
  const [open, setOpen] = useState2(null);
  const cats = ["Tous", "Mise aux normes", "Domotique", "Borne IRVE", "Éclairage LED"];
  const filtered = filter === "Tous" ? cases : cases.filter((c) => c.cat === filter);

  return (
    <section id="realisations" className="section" style={{ background: "var(--bg-2)" }}>
      <div className="container-wide">
        <SecHead num="04" label="Réalisations" title={<>Avant. Après.<br /><span style={{ color: "var(--muted)" }}>La différence est là.</span></>}
        sub="Quelques chantiers récents, photographiés, chiffrés. Tout est documenté — vous savez ce que vous achetez." />

        <div className="row center" style={{ gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {cats.map((c) =>
          <button key={c} className="chip" data-active={filter === c} onClick={() => setFilter(c)}>{c}</button>
          )}
        </div>

        <div className="grid grid-2" style={{ gap: 20 }}>
          {filtered.map((c, i) =>
          <FadeUp key={c.id} delay={i * 80}>
              <button onClick={() => setOpen(c)}
            style={{
              width: "100%", textAlign: "left", display: "block",
              position: "relative", height: 420, borderRadius: 24, overflow: "hidden",
              background: "var(--ink)",
              cursor: "pointer", transition: "all 0.6s var(--e-smooth)",
              border: "1px solid var(--line)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.querySelector("img").style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.querySelector("img").style.transform = "scale(1)";
            }}>
                <img src={c.url} alt={c.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 1.2s var(--e-smooth)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,14,16,0.2) 0%, rgba(11,14,16,0.85) 75%, rgba(11,14,16,0.95) 100%)" }} />

                <div style={{ position: "absolute", top: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                  padding: "6px 12px", background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999,
                  color: "#F5F5F3", fontSize: 11, fontFamily: "'JetBrains Mono', monospace"
                }}>{c.cat}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace" }}>{c.durée}</span>
                </div>

                <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, color: "#F5F5F3" }}>
                  <h3 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 10 }}>
                    {c.title}
                  </h3>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>{c.lieu}</div>
                  <div className="row center" style={{ gap: 8, color: c.color, fontSize: 13, fontWeight: 500 }}>
                    Voir avant / après <IconArrowRight size={13} />
                  </div>
                </div>
              </button>
            </FadeUp>
          )}
        </div>
      </div>

      {open && <BeforeAfterModal data={open} onClose={() => setOpen(null)} />}
    </section>);

}

function BeforeAfterModal({ data, onClose }) {
  const [pos, setPos] = useState2(50);
  useEffect2(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(11,14,16,0.85)", backdropFilter: "blur(20px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, animation: "pageIn 0.4s var(--e-smooth)"
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--card)", borderRadius: 24, maxWidth: 1100, width: "100%",
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        border: "1px solid var(--line)"
      }}>
        <div className="row between center" style={{ padding: "20px 28px", borderBottom: "1px solid var(--line)" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{data.cat} · {data.durée}</div>
            <h3 style={{ fontSize: 22, letterSpacing: "-0.02em", fontWeight: 500 }}>{data.title}</h3>
          </div>
          <button onClick={onClose} style={{
            width: 40, height: 40, borderRadius: 12, background: "var(--line-2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <IconX size={18} />
          </button>
        </div>

        <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--ink)", overflow: "hidden", userSelect: "none" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos(Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)));
        }}>
          <img src={data.url} alt="après" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden", filter: "grayscale(0.4) brightness(0.65)" }}>
            <img src={data.url} alt="avant" style={{ width: `${100 / (pos / 100)}%`, height: "100%", objectFit: "cover", display: "block" }} />
          </div>

          <div style={{ position: "absolute", top: 24, left: 24, padding: "6px 12px", background: "rgba(11,14,16,0.7)", color: "#F5F5F3", borderRadius: 999, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>AVANT</div>
          <div style={{ position: "absolute", top: 24, right: 24, padding: "6px 12px", background: "var(--accent)", color: "var(--accent-deep)", borderRadius: 999, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", fontWeight: 600 }}>APRÈS</div>

          <div style={{
            position: "absolute", top: 0, bottom: 0, left: `${pos}%`,
            width: 2, background: "#F5F5F3", boxShadow: "0 0 24px rgba(0,0,0,0.4)"
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 48, height: 48, borderRadius: "50%", background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 30px rgba(255,199,0,0.5)"
            }}>
              <IconArrowRight size={16} color="var(--accent-deep)" style={{ transform: "rotate(180deg)" }} />
              <IconArrowRight size={16} color="var(--accent-deep)" />
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ padding: 28, gap: 24 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8, color: "var(--muted)" }}>Avant</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>{data.avant}</p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8, color: "var(--ink)" }}>Après</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>{data.apres}</p>
          </div>
        </div>
      </div>
    </div>);

}

/* ---------- TÉMOIGNAGES CARROUSEL ---------- */
function Testimonials() {
  const items = [
  { author: "Lucas Valiente", role: "Particulier · Castelnau-le-Lez", rating: 5,
    text: "Plus que satisfait de l'intervention de Damien. Professionnel, sérieux et ponctuel. Intervenu rapidement pour une refonte totale de mon tableau électrique. Je recommande." },
  { author: "Thibault Guérin", role: "Particulier · Montpellier", rating: 5,
    text: "Prestation d'une très bonne qualité, à un prix très attractif. Je recommande Damien pour son professionnalisme. Merci encore." },
  { author: "Marine Lopez", role: "Architecte d'intérieur", rating: 5,
    text: "Travaille avec SSUN ELEC sur tous mes chantiers depuis 18 mois. Devis clair, délais tenus, finitions impeccables. Mes clients sont ravis." },
  { author: "Olivier Mercadier", role: "Vigneron · Pic Saint-Loup", rating: 5,
    text: "Refonte complète de l'électricité du chai et installation domotique. Damien a tout pris en main, du diagnostic au Consuel. Très carré." },
  { author: "Sophie Bénézech", role: "Restauratrice · Béziers", rating: 5,
    text: "Mise aux normes commerciale faite en deux jours, hors période d'ouverture. Aucun stress, devis respecté au centime. À refaire les yeux fermés." }];


  const [idx, setIdx] = useState2(0);
  const [auto, setAuto] = useState2(true);
  useEffect2(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5500);
    return () => clearInterval(t);
  }, [auto, items.length]);

  return (
    <section id="avis" className="section" style={{ background: "var(--bg)", overflow: "hidden", position: "relative" }}>
      <div className="container-wide" style={{ position: "relative" }}>
        <SecHead num="05" label="Avis vérifiés"
        title={<>Ce que disent<br /><span style={{ color: "var(--muted)" }}>nos clients.</span></>}
        sub="Avis Google + Pages Jaunes, vérifiés. Note moyenne 4,9 / 5 sur 47 avis." />

        <div className="row center" style={{ gap: 6, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={20} color="#FFC700" stroke={1.5} />)}
          <span style={{ marginLeft: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "var(--muted)" }}>4,9 / 5 · 47 avis</span>
        </div>

        <div onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}
        style={{ position: "relative", height: 380 }}>
          {items.map((it, i) => {
            const active = i === idx;
            const offset = i - idx;
            return (
              <div key={i} style={{
                position: "absolute", inset: 0,
                opacity: active ? 1 : 0,
                transform: `translateX(${offset * 60}px) scale(${active ? 1 : 0.95})`,
                transition: "all 0.8s var(--e-smooth)",
                pointerEvents: active ? "auto" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 60px"
              }}>
                <div style={{ maxWidth: 880, textAlign: "left", position: "relative" }}>
                  <div style={{ position: "absolute", top: -60, left: -20, fontSize: 200, color: "var(--accent)", opacity: 0.12, fontFamily: "Georgia, serif", lineHeight: 0.8, pointerEvents: "none" }}>"</div>
                  <p style={{ fontSize: "clamp(18px, 2.1vw, 27px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.35, marginBottom: 36, position: "relative", color: "var(--ink)" }}>
                    {it.text}
                  </p>
                  <div className="row center" style={{ gap: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "var(--grad-accent)", color: "var(--accent-deep)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 600, fontSize: 16
                    }}>{it.author.split(" ").map((n) => n[0]).join("")}</div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15 }}>{it.author}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>{it.role}</div>
                    </div>
                  </div>
                </div>
              </div>);

          })}
        </div>

        <div className="row center" style={{ gap: 8, justifyContent: "center", marginTop: 12 }}>
          {items.map((_, i) =>
          <button key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 24 : 6, height: 6, borderRadius: 999,
            background: i === idx ? "var(--ink)" : "var(--line)",
            transition: "all 0.5s var(--e-smooth)"
          }} />
          )}
        </div>
      </div>
    </section>);

}

/* ---------- ZONE INTERACTIVE ---------- */
function Zone() {
  const cities = [
  { name: "Montpellier", x: 50, y: 56, count: 42 },
  { name: "Saint-Clément", x: 47, y: 42, count: 31, hq: true },
  { name: "Castelnau", x: 56, y: 53, count: 18 },
  { name: "Lattes", x: 53, y: 64, count: 11 },
  { name: "Pérols", x: 60, y: 66, count: 7 },
  { name: "Béziers", x: 22, y: 70, count: 5 },
  { name: "Sète", x: 38, y: 78, count: 3 }];

  const [hover, setHover] = useState2(null);

  return (
    <section id="zone" className="section" style={{ background: "var(--grad-dark)", color: "#F5F5F3", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "30%", left: "20%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(255,199,0,0.12), transparent 65%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div className="container-wide" style={{ position: "relative" }}>
        <div className="grid" style={{ gridTemplateColumns: "0.85fr 1.15fr", gap: 64, alignItems: "center" }}>
          <FadeUp>
            <div className="row center gap-12" style={{ marginBottom: 24 }}>
              <span className="num-tag" style={{ color: "var(--accent)" }}>(06)</span>
              <span className="eyebrow" style={{ color: "#F5F5F3" }}>Zone d'intervention</span>
            </div>
            <h2 className="display" style={{ fontSize: "clamp(28px, 3.8vw, 60px)", color: "#F5F5F3", marginBottom: 24, lineHeight: 0.98 }}>
              Disponibles<br /><span className="grad-text">dans tout l'Hérault.</span>
            </h2>
            <p style={{ fontSize: 17, color: "rgba(245,245,243,0.65)", lineHeight: 1.6, marginBottom: 32 }}>
              Basés à Saint-Clément-de-Rivière, nous intervenons à Montpellier, Béziers, Sète, et toutes les communes de l'agglomération. Pas de frais de déplacement caché — c'est dans le devis.
            </p>
            <div className="col gap-12">
              {cities.slice(0, 5).map((c) =>
              <div key={c.name} onMouseEnter={() => setHover(c.name)} onMouseLeave={() => setHover(null)}
              className="row between center" style={{
                padding: "12px 18px",
                background: hover === c.name ? "rgba(255,199,0,0.10)" : "rgba(255,255,255,0.04)",
                border: hover === c.name ? "1px solid rgba(255,199,0,0.30)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, transition: "all 0.4s var(--e-smooth)", cursor: "pointer"
              }}>
                  <div className="row center gap-12">
                    {c.hq ? <span style={{ color: "var(--accent)" }}><IconHome size={14} /></span> : <IconMapPin size={14} color="rgba(245,245,243,0.5)" />}
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                    {c.hq && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: "2px 6px", background: "var(--accent)", color: "var(--accent-deep)", borderRadius: 4, fontWeight: 600 }}>HQ</span>}
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(245,245,243,0.5)" }}>{c.count} chantiers</span>
                </div>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <div style={{
              position: "relative", aspectRatio: "1 / 1",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 28, overflow: "hidden", padding: 0,
              backdropFilter: "blur(20px)"
            }}>
              <div style={{ position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "32px 32px"
              }} />

              {/* Coastline / silhouette de l'Hérault, stylisée */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <defs>
                  <radialGradient id="zonefill" cx="50%" cy="55%" r="55%">
                    <stop offset="0%" stopColor="#FFC700" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#FFC700" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path d="M 12,20 L 28,14 L 42,18 L 55,12 L 68,18 L 78,28 L 82,42 L 78,56 L 70,68 L 62,76 L 48,82 L 32,84 L 18,76 L 10,62 L 8,48 L 10,34 Z"
                fill="url(#zonefill)" stroke="rgba(255,199,0,0.35)" strokeWidth="0.4" strokeDasharray="1.2 1.2" />
                {/* Coast */}
                <path d="M 70,76 L 56,82 L 38,84 L 22,82 L 12,72" fill="none" stroke="rgba(245,245,243,0.30)" strokeWidth="0.3" />
              </svg>

              {/* City markers */}
              {cities.map((c) => {
                const isHover = hover === c.name;
                return (
                  <div key={c.name}
                  onMouseEnter={() => setHover(c.name)} onMouseLeave={() => setHover(null)}
                  style={{
                    position: "absolute", left: `${c.x}%`, top: `${c.y}%`,
                    transform: "translate(-50%,-50%)", cursor: "pointer", zIndex: isHover ? 5 : 2
                  }}>
                    {isHover &&
                    <div style={{
                      position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                      width: 60, height: 60, borderRadius: "50%",
                      border: "1px solid rgba(255,199,0,0.5)",
                      animation: "pulsering 1.6s var(--e-smooth) infinite"
                    }} />
                    }
                    <div style={{
                      width: c.hq ? 22 : 14, height: c.hq ? 22 : 14, borderRadius: "50%",
                      background: c.hq ? "var(--accent)" : "rgba(255,199,0,0.6)",
                      boxShadow: isHover ? "0 0 30px rgba(255,199,0,0.7)" : "0 0 12px rgba(255,199,0,0.3)",
                      transition: "all 0.4s var(--e-smooth)",
                      border: c.hq ? "2px solid #F5F5F3" : "none"
                    }} />
                    {(isHover || c.hq) &&
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                      whiteSpace: "nowrap", padding: "4px 10px",
                      background: "rgba(11,14,16,0.85)", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8, fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      color: "#F5F5F3"
                    }}>{c.name} · {c.count}</div>
                    }
                  </div>);

              })}

              <div style={{ position: "absolute", bottom: 20, left: 20, padding: "10px 14px",
                background: "rgba(11,14,16,0.7)", backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(245,245,243,0.7)" }}>
                <div style={{ marginBottom: 4, color: "var(--accent)" }}>HÉRAULT (34)</div>
                117 chantiers · 7 villes
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      <style>{`@keyframes pulsering { 0% { transform: translate(-50%,-50%) scale(0.6); opacity: 0.8; } 100% { transform: translate(-50%,-50%) scale(2); opacity: 0; } }`}</style>
    </section>);

}

/* ---------- FAQ ACCORDÉON ---------- */
function FAQ() {
  const items = [
  { q: "Vous intervenez en urgence le week-end ?",
    a: "Oui, 7j/7 dans un rayon de 30 km autour de Montpellier. Majoration de 35% sur la main-d'œuvre — affichée sur le devis avant que vous ne validiez. On préfère vous prévenir que vous surprendre." },
  { q: "Combien coûte un devis ?",
    a: "Rien. Le déplacement, le diagnostic et le chiffrage sont offerts. Vous recevez un devis détaillé sous 48 h, ligne par ligne, photos avant à l'appui. Aucun engagement." },
  { q: "Êtes-vous certifié pour les bornes de recharge ?",
    a: "Oui — certification IRVE niveau 1 et 2, obligatoire pour bénéficier du crédit d'impôt et de la prime ADVENIR. On vous monte le dossier d'aides en même temps que le devis." },
  { q: "Vous gérez le passage du Consuel ?",
    a: "Oui. Pour toute installation neuve ou rénovation lourde, nous nous occupons du dossier Consuel et de la mise en service Enedis. Vous n'avez rien à gérer." },
  { q: "Quelle est la garantie sur les travaux ?",
    a: "2 ans sur la main-d'œuvre et le matériel installé. La garantie décennale couvre la sécurité de l'installation pendant 10 ans. Tous nos chantiers sont assurés." },
  { q: "Vous travaillez avec des architectes / promoteurs ?",
    a: "Oui, nous intervenons régulièrement sur des chantiers de rénovation en lien avec architectes d'intérieur et maîtres d'œuvre. Devis cadre disponible pour les volumes récurrents." },
  { q: "Quel délai pour démarrer un chantier ?",
    a: "Pour une mise aux normes ou rénovation : 2 à 4 semaines selon la saison. Pour un dépannage urgent : sous 2 h. Pour une domotique : 1 à 3 semaines. On vous donne un planning ferme avec le devis." }];

  const [open, setOpen] = useState2(0);

  return (
    <section id="faq" className="section" style={{ background: "var(--bg)" }}>
      <div className="container-wide">
        <div className="grid" style={{ gridTemplateColumns: "0.85fr 1.15fr", gap: 80 }}>
          <FadeUp>
            <div style={{ position: "sticky", top: 100 }}>
              <div className="row center gap-12" style={{ marginBottom: 24 }}>
                <span className="num-tag">(07)</span>
                <span className="eyebrow" style={{ color: "var(--ink)" }}>Questions courantes</span>
              </div>
              <h2 className="display" style={{ fontSize: "clamp(28px, 3.5vw, 56px)", lineHeight: 0.98, marginBottom: 32 }}>
                Questions fréquentes<br /><span style={{ color: "var(--muted)" }}>Nous répondons à vos besoins.</span>
              </h2>
              <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.6, marginBottom: 28 }}>
                Une question pas listée ?<br />Appelez-nous, on répond direct.
              </p>
              <a href="tel:+33602409147" className="btn btn-ghost"><IconPhone size={13} /> 06 02 40 91 47</a>
            </div>
          </FadeUp>

          <div>
            {items.map((it, i) =>
            <FadeUp key={i} delay={i * 50}>
                <button onClick={() => setOpen(open === i ? -1 : i)}
              style={{
                width: "100%", textAlign: "left",
                padding: "28px 0", borderBottom: "1px solid var(--line)",
                cursor: "pointer", display: "block"
              }}>
                  <div className="row between center" style={{ marginBottom: open === i ? 16 : 0, transition: "margin 0.4s var(--e-smooth)" }}>
                    <h3 style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.02em", color: open === i ? "var(--ink)" : "var(--ink)", paddingRight: 24 }}>
                      {it.q}
                    </h3>
                    <span style={{
                    width: 38, height: 38, flexShrink: 0,
                    borderRadius: "50%",
                    background: open === i ? "var(--accent)" : "var(--line-2)",
                    color: open === i ? "var(--accent-deep)" : "var(--ink)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.5s var(--e-smooth)",
                    transform: open === i ? "rotate(180deg)" : "rotate(0)"
                  }}>
                      {open === i ? <IconMinus size={16} /> : <IconPlus size={16} />}
                    </span>
                  </div>
                  <div style={{
                  maxHeight: open === i ? 200 : 0,
                  overflow: "hidden",
                  opacity: open === i ? 1 : 0,
                  transition: "all 0.6s var(--e-smooth)"
                }}>
                    <p style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.7, paddingRight: 40 }}>{it.a}</p>
                  </div>
                </button>
              </FadeUp>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- CERTIFICATIONS LOGOS BAR ---------- */
function Certifs() {
  const items = ["NF C 15-100", "Consuel agréé", "IRVE niveau 2", "Qualifelec", "Décennale assurée", "RGE éligible", "Habilitation B1V/BR/BC", "Certified Apple Home"];
  return (
    <div style={{ background: "var(--ink)", color: "rgba(245,245,243,0.6)", padding: "28px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="marquee-track">
        {[...items, ...items].map((it, i) =>
        <div key={i} className="row center gap-12" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            <IconShield size={14} color="var(--accent)" />
            <span>{it}</span>
            <span style={{ width: 4, height: 4, background: "rgba(245,245,243,0.2)", borderRadius: "50%", marginLeft: 36 }} />
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, { Realisations, Testimonials, Zone, FAQ, Certifs });