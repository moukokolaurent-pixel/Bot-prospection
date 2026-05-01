/* Shared : ProspectContext + hooks + Nav, Footer, FAB, MobileBar, SecHead, MaquetteBanner */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from 'react';
import type { ProspectData } from './types';
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconClock,
  IconPhone,
  IconX
} from './icons';

/* -------------------- Prospect context -------------------- */

const ProspectCtx = createContext<ProspectData | null>(null);

export function ProspectProvider({ value, children }: { value: ProspectData; children: ReactNode }) {
  return <ProspectCtx.Provider value={value}>{children}</ProspectCtx.Provider>;
}

export function useProspect(): ProspectData {
  const ctx = useContext(ProspectCtx);
  if (!ctx) throw new Error('useProspect must be called inside <ProspectProvider>');
  return ctx;
}

/** "Hérault (34)" → "Hérault" */
export function deptShort(label: string): string {
  return label.replace(/\s\(\d+\)$/, '');
}

/* -------------------- Hooks -------------------- */

export function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function FadeUp({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style = {}
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`fade-up ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

export function useParallax(speed = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      el.style.transform = `translate3d(0, ${progress * speed * 100}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}

/* -------------------- Maquette banner -------------------- */

export function MaquetteBanner() {
  const data = useProspect();
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--accent)',
        color: 'var(--accent-deep)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11.5,
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <span>
        Maquette personnalisée pour {data.nom_entreprise} · préparée par Axelia Design · démo sans engagement
      </span>
      <a
        href="https://axelia-design.fr"
        target="_blank"
        rel="noopener"
        style={{
          position: 'absolute',
          right: 24,
          color: 'inherit',
          opacity: 0.7,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11.5
        }}
      >
        → axelia-design.fr
      </a>
    </div>
  );
}

/* -------------------- Logo -------------------- */

export function Logo() {
  const data = useProspect();
  return (
    <a href="#top" className="logo-mark">
      <span className="monogram">
        <IconBolt size={18} color="var(--accent)" />
      </span>
      <span>{data.nom_entreprise}</span>
    </a>
  );
}

/* -------------------- TickerBar -------------------- */

export function TickerBar() {
  const data = useProspect();
  return (
    <div className="ticker-bar">
      <div className="container-wide row between center" style={{ gap: 24, flexWrap: 'wrap' }}>
        <div className="row center" style={{ gap: 10 }}>
          <span className="dot-pulse" />
          <span>
            Disponible · Intervention sous 2 h sur {data.ville_principale} et l'{deptShort(data.departement_label)}
          </span>
        </div>
        <div className="row center" style={{ gap: 20 }}>
          <a href={`tel:${data.telephone_e164}`} className="row center" style={{ gap: 6 }}>
            <IconPhone size={11} /> {data.telephone_display}
          </a>
          <span className="row center" style={{ gap: 6, opacity: 0.6 }}>
            <IconClock size={11} /> Urgence 24/7
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Nav (header) -------------------- */

export function Nav() {
  const data = useProspect();
  const [scrolled, setScrolled] = useState(false);
  const progRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (progRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        progRef.current.style.transform = `scaleX(${p})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    { id: 'services', label: 'Services' },
    { id: 'estimateur', label: 'Devis express' },
    { id: 'process', label: 'Process' },
    { id: 'realisations', label: 'Réalisations' },
    { id: 'zone', label: 'Zone' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <MaquetteBanner />
      <TickerBar />
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 60,
          background: scrolled ? 'rgba(250,250,247,0.82)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--line)' : 'transparent'}`,
          transition: 'all 0.6s var(--e-smooth)',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none'
        }}
      >
        <div className="container-wide row between center" style={{ height: 72 }}>
          <Logo />
          <nav className="row center" style={{ gap: 4 }}>
            {items.map((i) => (
              <button
                key={i.id}
                onClick={() => scrollTo(i.id)}
                style={{
                  padding: '8px 14px',
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: 'var(--muted)',
                  borderRadius: 999,
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {i.label}
              </button>
            ))}
          </nav>
          <div className="row center" style={{ gap: 12 }}>
            <a
              className="row center"
              style={{ gap: 8, fontSize: 13.5, fontWeight: 500 }}
              href={`tel:${data.telephone_e164}`}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
              {data.telephone_display}
            </a>
            <button onClick={() => scrollTo('contact')} className="btn btn-accent">
              Devis gratuit <IconArrowRight size={14} />
            </button>
          </div>
        </div>
        <div ref={progRef} className="scroll-progress" />
      </header>
    </>
  );
}

/* -------------------- Footer -------------------- */

export function Footer() {
  const data = useProspect();
  // split adresse_complete: "Saint-Clément-de-Rivière · 34980 Hérault" → 2 lignes
  const adresseParts = data.adresse_complete.split(' · ');
  const adresseLine1 = adresseParts[0] ?? data.adresse_complete;
  const adresseLine2 = adresseParts.slice(1).join(' · ');

  return (
    <footer
      style={{
        background: 'var(--grad-dark-rich)',
        color: '#F5F5F3',
        paddingTop: 120,
        paddingBottom: 32,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(255,199,0,0.16) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(182,255,60,0.10) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div className="container-wide" style={{ position: 'relative' }}>
        <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <div className="logo-mark" style={{ color: '#F5F5F3', marginBottom: 20 }}>
              <span className="monogram" style={{ background: 'var(--grad-accent)', color: 'var(--accent-deep)' }}>
                <IconBolt size={18} color="#1A1500" />
              </span>
              <span>{data.nom_entreprise}</span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, opacity: 0.6, maxWidth: 340 }}>
              Votre artisan électricien à {data.ville_principale}. Dépannage, mise aux normes, domotique, bornes de
              recharge — partout dans {data.departement_label}.
            </p>
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
              Services
            </div>
            <div className="col gap-12" style={{ fontSize: 13.5, opacity: 0.75 }}>
              <span>Dépannage électrique</span>
              <span>Mise aux normes NF C 15-100</span>
              <span>Domotique</span>
              <span>Borne de recharge</span>
              <span>Audit / diagnostic</span>
              <span>Éclairage LED</span>
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
              Zone
            </div>
            <div className="col gap-12" style={{ fontSize: 13.5, opacity: 0.75 }}>
              <span>Montpellier</span>
              <span>Saint-Clément-de-Rivière</span>
              <span>Béziers</span>
              <span>Castelnau-le-Lez</span>
              <span>Lattes · Pérols</span>
              <span>{data.departement_label}</span>
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
              Contact
            </div>
            <div className="col gap-12" style={{ fontSize: 13.5, opacity: 0.75 }}>
              <a href={`tel:${data.telephone_e164}`}>{data.telephone_display}</a>
              {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
              <div>
                Lun–Ven · 8h–19h
                <br />
                Samedi · 9h–18h
              </div>
              <div>
                {adresseLine1}
                {adresseLine2 && (
                  <>
                    <br />
                    {adresseLine2}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="row between center"
          style={{
            paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: 11.5,
            opacity: 0.5,
            flexWrap: 'wrap',
            gap: 16,
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          <span>
            © {new Date().getFullYear()} {data.nom_entreprise} — Artisan électricien · {deptShort(data.departement_label)}
          </span>
          <span className="row center gap-16">
            <a>Mentions légales</a>
            <a>CGV</a>
            <a>Cookies</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- Callback FAB (rappel rapide) -------------------- */

export function CallbackFab() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState('');
  return (
    <>
      <button className="callback-fab" onClick={() => setOpen((o) => !o)}>
        {open ? (
          <IconX size={15} />
        ) : (
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
        )}
        {open ? 'Fermer' : 'On vous rappelle'}
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 28,
            zIndex: 79,
            width: 320,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 30px 80px rgba(0,0,0,0.12)',
            animation: 'pageIn 0.5s var(--e-smooth)'
          }}
        >
          {!sent ? (
            <>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                Rappel · sous 10 min
              </div>
              <h3 className="display" style={{ fontSize: 26, lineHeight: 1.05, marginBottom: 18 }}>
                Votre numéro,
                <br />
                <span className="grad-text">on s'occupe du reste.</span>
              </h3>
              <div className="field" style={{ marginBottom: 22 }}>
                <label>Téléphone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 …" />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => phone.length > 4 && setSent(true)}
              >
                Me rappeler <IconArrowRight size={13} />
              </button>
            </>
          ) : (
            <div className="col gap-16">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'var(--accent)',
                  color: 'var(--accent-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12
                }}
              >
                <IconCheck size={18} />
              </div>
              <h3 className="display" style={{ fontSize: 22 }}>
                Bien reçu.
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
                On vous rappelle au <strong style={{ color: 'var(--ink)' }}>{phone}</strong> dans 10 min.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* -------------------- Mobile bottom bar -------------------- */

export function MobileBar() {
  const data = useProspect();
  return (
    <div className="sticky-mobile-bar">
      <a
        href={`tel:${data.telephone_e164}`}
        className="btn"
        style={{ background: 'var(--line-2)', color: 'var(--ink)' }}
      >
        <IconPhone size={13} /> Appeler
      </a>
      <a href="#contact" className="btn btn-accent">
        Devis <IconArrowRight size={13} />
      </a>
    </div>
  );
}

/* -------------------- Section header (réutilisé partout) -------------------- */

export function SecHead({
  num,
  label,
  title,
  sub,
  align = 'left'
}: {
  num: string;
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <FadeUp>
      <div style={{ marginBottom: 56, textAlign: align }}>
        <div
          className="row center"
          style={{
            gap: 10,
            justifyContent: align === 'center' ? 'center' : 'flex-start',
            marginBottom: 24
          }}
        >
          <span className="num-tag">({num})</span>
          <span className="eyebrow" style={{ color: 'var(--ink)' }}>
            {label}
          </span>
        </div>
        <h2
          className="display"
          style={{
            fontSize: 'clamp(28px, 3.6vw, 60px)',
            maxWidth: 880,
            lineHeight: 0.98,
            margin: align === 'center' ? '0 auto' : 0
          }}
        >
          {title}
        </h2>
        {sub && (
          <p
            style={{
              fontSize: 17,
              color: 'var(--muted)',
              maxWidth: 580,
              marginTop: 24,
              lineHeight: 1.6,
              margin: align === 'center' ? '24px auto 0' : '24px 0 0'
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </FadeUp>
  );
}
