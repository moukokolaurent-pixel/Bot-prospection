/* Sections 1 : Services, Estimateur, Process — entièrement génériques */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { FadeUp, SecHead } from './shared';
import {
  IconArrowRight,
  IconAward,
  IconBolt,
  IconCpu,
  IconHome,
  IconLightbulb,
  IconPhone,
  IconSearch,
  IconSettings,
  type IconProps
} from './icons';

/* ---------- SERVICES ---------- */

interface ServiceDef {
  id: number;
  icon: (props: IconProps) => JSX.Element;
  color: string;
  title: string;
  lead: string;
  tags: string[];
  metric: string;
  metricLabel: string;
  bg: string;
}

export function Services() {
  const services: ServiceDef[] = [
    {
      id: 1,
      icon: IconBolt,
      color: '#FFC700',
      title: 'Dépannage & électricité générale',
      lead: 'Une panne, un court-circuit, un disjoncteur capricieux. On diagnostique, on chiffre, on répare.',
      tags: ['Urgence 24/7', 'Diagnostic offert', 'Garantie 2 ans'],
      metric: '< 2 h',
      metricLabel: 'intervention',
      bg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
    },
    {
      id: 2,
      icon: IconHome,
      color: '#B6FF3C',
      title: 'Mise aux normes NF C 15-100',
      lead: 'Tableau, prises, terre, différentiels — votre installation conforme, documentée, certifiée.',
      tags: ['Consuel', 'Devis détaillé', 'Photos avant/après'],
      metric: '100%',
      metricLabel: 'conformité',
      bg: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80'
    },
    {
      id: 3,
      icon: IconCpu,
      color: '#FFE13B',
      title: 'Domotique & maison connectée',
      lead: 'Alarmes, volets, chauffage, scénarios. On installe les marques sérieuses, on vous forme.',
      tags: ['Somfy / Delta Dore', 'Apple HomeKit', 'Sans abonnement'],
      metric: '+30%',
      metricLabel: 'économies énergie',
      bg: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80'
    },
    {
      id: 4,
      icon: IconAward,
      color: '#FFC700',
      title: 'Borne de recharge IRVE',
      lead: 'Installation certifiée IRVE pour véhicule électrique. Aides financières, tout chiffré.',
      tags: ['Certifié IRVE', "Crédit d'impôt", 'Wallbox / Schneider'],
      metric: '1 400 €',
      metricLabel: 'à partir de',
      bg: 'https://images.unsplash.com/photo-1647500666543-ee16cda13a4f?w=1200&q=80'
    },
    {
      id: 5,
      icon: IconLightbulb,
      color: '#B6FF3C',
      title: 'Éclairage intérieur & extérieur',
      lead: 'LED basse conso, rubans, spots design, balisage de jardin. On éclaire intelligent.',
      tags: ['LED garantie 5 ans', 'Domotique-ready', 'Étude photométrique'],
      metric: '−72%',
      metricLabel: 'facture éclairage',
      bg: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80'
    },
    {
      id: 6,
      icon: IconSearch,
      color: '#FFE13B',
      title: 'Audit & diagnostic complet',
      lead: 'Vous achetez ? Vous rénovez ? On regarde tout, on remet un rapport, on chiffre les priorités.',
      tags: ['Rapport PDF', 'Caméra thermique', '150 € forfait'],
      metric: '150 €',
      metricLabel: 'forfait audit',
      bg: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&q=80'
    }
  ];

  return (
    <section id="services" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container-wide">
        <SecHead
          num="01"
          label="Nos prestations"
          title={
            <>
              Six prestations.
              <br />
              <span style={{ color: 'var(--muted)' }}>Une seule équipe.</span>
            </>
          }
          sub="Tout est chiffré avant intervention. Pas d'options cachées, pas de jargon, pas de mauvaises surprises sur la facture finale."
        />

        <div className="grid grid-3" style={{ gap: 16 }}>
          {services.map((s, i) => (
            <FadeUp key={s.id} delay={i * 60}>
              <ServiceCard {...s} />
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={400}>
          <div
            style={{
              marginTop: 32,
              padding: 32,
              background: 'linear-gradient(135deg, rgba(255,199,0,0.06) 0%, rgba(182,255,60,0.04) 100%)',
              border: '1px solid var(--line)',
              borderRadius: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Vous ne trouvez pas votre besoin ?
              </div>
              <h3 style={{ fontSize: 28, letterSpacing: '-0.03em', fontWeight: 500 }}>
                On chiffre <span style={{ color: 'var(--muted)' }}>tout type</span> de chantier.
              </h3>
            </div>
            <button
              className="btn btn-primary"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Demander un devis sur mesure <IconArrowRight size={13} />
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, color, title, lead, tags, metric, metricLabel, bg }: ServiceDef) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        transition: 'all 0.7s var(--e-smooth)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover
          ? `0 30px 70px rgba(0,0,0,0.22), 0 0 0 1px ${color}66, 0 0 50px ${color}33`
          : '0 16px 40px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.04)',
        height: 420,
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        background: '#0B0E10'
      }}
    >
      <img
        src={bg}
        alt={title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: hover ? 'scale(1.08)' : 'scale(1.02)',
          transition: 'transform 1.6s var(--e-smooth), filter 0.7s var(--e-smooth)',
          filter: hover ? 'saturate(1.15) brightness(0.85)' : 'saturate(1) brightness(0.7)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(11,14,16,0.30) 0%, rgba(11,14,16,0.45) 45%, rgba(11,14,16,0.92) 100%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 80% 0%, ${color}26, transparent 55%)`,
          opacity: hover ? 1 : 0.7,
          transition: 'opacity 0.7s var(--e-smooth)',
          pointerEvents: 'none'
        }}
      />

      <div className="row between center" style={{ padding: 22, position: 'relative', zIndex: 2 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(20px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
            border: `1px solid ${color}66`,
            boxShadow: hover
              ? `0 0 24px ${color}55, inset 0 1px 0 rgba(255,255,255,0.20)`
              : 'inset 0 1px 0 rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.6s var(--e-smooth)'
          }}
        >
          <Icon size={20} color={color} />
        </div>
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(20px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
            border: '1px solid rgba(255,255,255,0.18)',
            textAlign: 'right',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#F5F5F3',
              fontFamily: "'Inter Tight', sans-serif",
              letterSpacing: '-0.02em'
            }}
          >
            {metric}
          </span>
          <span
            style={{
              fontSize: 9.5,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(245,245,243,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {metricLabel}
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          margin: 14,
          padding: 22,
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(155deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 18,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.20), 0 8px 24px rgba(0,0,0,0.20)'
        }}
      >
        <h3
          style={{
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            lineHeight: 1.18,
            marginBottom: 8,
            color: '#F5F5F3'
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(245,245,243,0.78)', lineHeight: 1.55, marginBottom: 14 }}>
          {lead}
        </p>
        <div className="row" style={{ flexWrap: 'wrap', gap: 5 }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 9px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 999,
                fontSize: 10.5,
                color: 'rgba(245,245,243,0.85)',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- ESTIMATEUR ---------- */

interface EstimType {
  id: 'depan' | 'tab' | 'borne' | 'domo' | 'renov' | 'audit';
  label: string;
  base: number;
  unit: string;
}

export function Estimateur() {
  const types: EstimType[] = [
    { id: 'depan', label: 'Dépannage', base: 80, unit: 'Forfait' },
    { id: 'tab', label: 'Tableau électrique', base: 950, unit: 'Selon tableau' },
    { id: 'borne', label: 'Borne recharge', base: 1400, unit: 'Avec aides' },
    { id: 'domo', label: 'Domotique', base: 600, unit: 'Par module' },
    { id: 'renov', label: 'Rénovation totale', base: 8500, unit: 'T3 ~70 m²' },
    { id: 'audit', label: 'Audit complet', base: 150, unit: 'Forfait' }
  ];

  const [type, setType] = useState<EstimType>(types[1]);
  const [surface, setSurface] = useState(70);
  const [urgent, setUrgent] = useState(false);

  const estimate = useMemo(() => {
    let v = type.base;
    if (type.id === 'renov') v = Math.round((surface * 122) / 10) * 10;
    if (type.id === 'tab') v = type.base + Math.round(surface * 4);
    if (urgent) v = Math.round(v * 1.35);
    return v;
  }, [type, surface, urgent]);

  return (
    <section
      id="estimateur"
      className="section"
      style={{
        background: 'var(--grad-dark-rich)',
        color: '#F5F5F3',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(255,199,0,0.18), transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: 700,
          height: 700,
          background: 'radial-gradient(circle, rgba(182,255,60,0.14), transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container-wide" style={{ position: 'relative' }}>
        <FadeUp>
          <div className="row center gap-12" style={{ marginBottom: 24 }}>
            <span className="num-tag" style={{ color: 'var(--accent)' }}>
              (02)
            </span>
            <span className="eyebrow" style={{ color: '#F5F5F3' }}>
              Estimateur
            </span>
          </div>
          <h2
            className="display"
            style={{
              fontSize: 'clamp(28px, 3.8vw, 62px)',
              maxWidth: 880,
              lineHeight: 0.98,
              color: '#F5F5F3',
              marginBottom: 24
            }}
          >
            Estimez votre besoin
            <br />
            <span className="grad-text">avant tout rendez-vous.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(245,245,243,0.65)', maxWidth: 580, lineHeight: 1.6 }}>
            Un ordre d'idée. Le devis exact est posé après visite — gratuit, sans engagement.
          </p>
        </FadeUp>

        <div
          className="grid"
          style={{
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 32,
            alignItems: 'stretch',
            marginTop: 56
          }}
        >
          <FadeUp delay={120}>
            <div className="glass" style={{ padding: 36, height: '100%' }}>
              <div className="eyebrow" style={{ color: 'rgba(245,245,243,0.6)', marginBottom: 18 }}>
                Type de prestation
              </div>
              <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                {types.map((t) => (
                  <button
                    key={t.id}
                    className="chip"
                    data-active={type.id === t.id ? 'true' : 'false'}
                    onClick={() => setType(t)}
                    style={{
                      background: type.id === t.id ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                      color: type.id === t.id ? 'var(--accent-deep)' : '#F5F5F3',
                      border:
                        type.id === t.id ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.10)'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {(type.id === 'renov' || type.id === 'tab') && (
                <>
                  <div className="row between center" style={{ marginBottom: 12 }}>
                    <div className="eyebrow" style={{ color: 'rgba(245,245,243,0.6)' }}>
                      Surface · m²
                    </div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--accent)',
                        fontSize: 18
                      }}
                    >
                      {surface} m²
                    </div>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={surface}
                    onChange={(e) => setSurface(+e.target.value)}
                    style={{ width: '100%', accentColor: '#FFC700', marginBottom: 28 }}
                  />
                </>
              )}

              <div
                className="row between center"
                style={{
                  padding: '16px 18px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  marginBottom: 12
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Intervention urgente</div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'rgba(245,245,243,0.55)',
                      marginTop: 2
                    }}
                  >
                    Sous 2 h, week-end inclus · +35%
                  </div>
                </div>
                <button
                  onClick={() => setUrgent(!urgent)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 999,
                    background: urgent ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                    position: 'relative',
                    transition: 'all 0.3s var(--e-smooth)'
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: urgent ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#0B0E10',
                      transition: 'left 0.3s var(--e-smooth)'
                    }}
                  />
                </button>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={240}>
            <div
              style={{
                padding: 36,
                height: '100%',
                background: 'linear-gradient(155deg, rgba(255,199,0,0.16) 0%, rgba(182,255,60,0.10) 100%)',
                border: '1px solid rgba(255,199,0,0.28)',
                borderRadius: 28,
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow:
                  '0 30px 80px rgba(255,199,0,0.18), 0 0 0 1px rgba(255,255,255,0.08) inset',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -100,
                  right: -100,
                  width: 280,
                  height: 280,
                  background: 'radial-gradient(circle, rgba(255,199,0,0.4), transparent 65%)',
                  filter: 'blur(40px)'
                }}
              />
              <div style={{ position: 'relative' }}>
                <div className="eyebrow" style={{ color: 'rgba(245,245,243,0.7)', marginBottom: 12 }}>
                  Estimation indicative
                </div>
                <h3 style={{ fontSize: 18, color: 'rgba(245,245,243,0.85)', marginBottom: 8, fontWeight: 400 }}>
                  Pour une <strong style={{ color: '#F5F5F3' }}>{type.label.toLowerCase()}</strong>
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(245,245,243,0.5)',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {type.unit} {urgent ? '· urgence' : ''}
                </p>
              </div>

              <div style={{ position: 'relative', margin: '32px 0' }}>
                <div
                  style={{
                    fontSize: 110,
                    fontWeight: 600,
                    lineHeight: 0.85,
                    letterSpacing: '-0.05em',
                    color: '#F5F5F3'
                  }}
                >
                  {estimate.toLocaleString('fr-FR')}
                  <span style={{ fontSize: 56, color: 'var(--accent)', marginLeft: 6 }}>€</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(245,245,243,0.6)', marginTop: 6 }}>
                  TTC · matériel inclus
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-accent"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() =>
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Recevoir mon devis détaillé <IconArrowRight size={13} />
                </button>
                <p
                  style={{
                    fontSize: 11,
                    color: 'rgba(245,245,243,0.5)',
                    textAlign: 'center',
                    marginTop: 12,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  réponse garantie · &lt; 24 h
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROCESS ---------- */

interface ProcessStep {
  num: string;
  icon: (props: IconProps) => JSX.Element;
  title: string;
  body: string;
}

export function Process() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = 1 - (r.top - vh * 0.3) / (vh * 0.5);
      setProgress(Math.max(0, Math.min(1, t)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const steps: ProcessStep[] = [
    {
      num: '01',
      icon: IconPhone,
      title: 'Prise de contact',
      body: "Téléphone ou formulaire. On répond sous 24 h ouvrées, souvent dans l'heure. On situe votre besoin, on cale un créneau."
    },
    {
      num: '02',
      icon: IconSettings,
      title: 'Visite & devis chiffré',
      body: 'On vient mesurer, photographier, comprendre. Le devis arrive sous 48 h, ligne par ligne, avec photos avant.'
    },
    {
      num: '03',
      icon: IconBolt,
      title: 'Chantier & garantie 2 ans',
      body: "Démarrage à votre date. On laisse propre, on documente le rendu, on garantit deux ans pièce et main-d'œuvre."
    }
  ];

  return (
    <section id="process" className="section" style={{ background: 'var(--bg)' }}>
      <div className="container-wide">
        <SecHead
          num="03"
          label="Process"
          title={
            <>
              Trois étapes.
              <br />
              <span style={{ color: 'var(--muted)' }}>Et on s'occupe du reste</span>
            </>
          }
          sub="Du premier appel au coup de balai final, vous savez où vous en êtes. Aucun travail ne démarre sans devis signé."
        />

        <div
          ref={ref}
          className="grid"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }}
        >
          <div className="stepper-line" style={{ '--progress': progress } as CSSProperties} />
          {steps.map((s, i) => (
            <FadeUp key={s.num} delay={i * 100}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 22,
                    background: progress > i / 3 ? 'var(--grad-accent)' : 'var(--card)',
                    border: progress > i / 3 ? 'none' : '1px solid var(--line)',
                    color: progress > i / 3 ? 'var(--accent-deep)' : 'var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    fontWeight: 500,
                    marginBottom: 24,
                    transition: 'all 0.7s var(--e-smooth)',
                    boxShadow: progress > i / 3 ? '0 12px 30px rgba(255,199,0,0.35)' : 'none'
                  }}
                >
                  <s.icon size={22} />
                </div>
                <div className="num-tag" style={{ marginBottom: 10 }}>
                  {s.num}
                </div>
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginBottom: 12
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.65 }}>{s.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
