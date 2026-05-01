/* CONTACT — formulaire avec validation live + CTA finale */
import { useState } from 'react';
import { FadeUp, useProspect } from './shared';
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  type IconProps
} from './icons';

interface ContactItem {
  icon: (props: IconProps) => JSX.Element;
  label: string;
  value: string;
  href?: string;
}

export function ContactCTA() {
  const data = useProspect();

  const items: ContactItem[] = [
    {
      icon: IconPhone,
      label: 'Appel direct',
      value: data.telephone_display,
      href: `tel:${data.telephone_e164}`
    }
  ];
  if (data.email) {
    items.push({
      icon: IconMail,
      label: 'E-mail',
      value: data.email,
      href: `mailto:${data.email}`
    });
  }
  items.push({ icon: IconMapPin, label: 'Adresse', value: data.adresse_complete });
  items.push({
    icon: IconClock,
    label: 'Horaires',
    value: 'Lun–Ven · 8h–19h · Samedi 9h–18h'
  });

  return (
    <section
      id="contact"
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
          top: '-30%',
          right: '-20%',
          width: 900,
          height: 900,
          background: 'radial-gradient(circle, rgba(255,199,0,0.20), transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-20%',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(182,255,60,0.15), transparent 65%)',
          filter: 'blur(110px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container-wide" style={{ position: 'relative' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'stretch' }}>
          <FadeUp>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div className="row center gap-12" style={{ marginBottom: 24 }}>
                  <span className="num-tag" style={{ color: 'var(--accent)' }}>
                    (08)
                  </span>
                  <span className="eyebrow" style={{ color: '#F5F5F3' }}>
                    Contact
                  </span>
                </div>
                <h2
                  className="display"
                  style={{
                    fontSize: 'clamp(34px, 5vw, 88px)',
                    color: '#F5F5F3',
                    lineHeight: 0.92,
                    letterSpacing: '-0.045em',
                    marginBottom: 32
                  }}
                >
                  On démarre
                  <br />
                  <span className="grad-text">maintenant ?</span>
                </h2>
                <p
                  style={{
                    fontSize: 19,
                    color: 'rgba(245,245,243,0.7)',
                    lineHeight: 1.55,
                    maxWidth: 460,
                    marginBottom: 48
                  }}
                >
                  Décrivez votre besoin. On vous rappelle sous 24 h ouvrées avec une première
                  estimation. Sans engagement, sans relance commerciale.
                </p>
              </div>

              <div className="col gap-24">
                {items.map((it) => (
                  <a key={it.label} href={it.href} className="row center" style={{ gap: 16 }}>
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(255,199,0,0.12)',
                        border: '1px solid rgba(255,199,0,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <it.icon size={16} color="var(--accent)" />
                    </span>
                    <div>
                      <div
                        className="eyebrow"
                        style={{ color: 'rgba(245,245,243,0.5)', marginBottom: 2 }}
                      >
                        {it.label}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{it.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={120}>
            <ContactForm />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  msg: string;
}

function ContactForm() {
  const [data, setData] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    subject: 'depan',
    msg: ''
  });
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormState, boolean>>>({});
  const [sent, setSent] = useState(false);

  const errors = {
    name: data.name.length < 2 ? 'Au moins 2 caractères' : '',
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? 'E-mail invalide' : '',
    phone: !/^[\d\s+().-]{8,}$/.test(data.phone) ? 'Téléphone requis' : '',
    msg: data.msg.length < 10 ? 'Décrivez en quelques mots' : ''
  };
  const isValid = !Object.values(errors).some(Boolean);

  const set = <K extends keyof ContactFormState>(k: K, v: ContactFormState[K]) =>
    setData((d) => ({ ...d, [k]: v }));
  const blur = (k: keyof ContactFormState) => setTouched((t) => ({ ...t, [k]: true }));
  const showErr = (k: keyof typeof errors) => Boolean(touched[k] && errors[k]);

  const subjects = [
    { id: 'depan', label: 'Dépannage urgent' },
    { id: 'tab', label: 'Mise aux normes' },
    { id: 'domo', label: 'Domotique' },
    { id: 'borne', label: 'Borne recharge' },
    { id: 'renov', label: 'Rénovation' },
    { id: 'audit', label: 'Audit / diagnostic' },
    { id: 'other', label: 'Autre' }
  ];

  if (sent) {
    return (
      <div
        className="glass"
        style={{
          padding: 48,
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'var(--grad-accent)',
            color: 'var(--accent-deep)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 0 60px rgba(255,199,0,0.5)'
          }}
        >
          <IconCheck size={32} />
        </div>
        <h3
          style={{
            fontSize: 36,
            color: '#F5F5F3',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 12
          }}
        >
          Bien reçu, <span className="grad-text">{data.name.split(' ')[0]}.</span>
        </h3>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(245,245,243,0.7)',
            lineHeight: 1.55,
            margin: '0 auto 32px',
            maxWidth: 380
          }}
        >
          On vous rappelle au <strong style={{ color: 'var(--accent)' }}>{data.phone}</strong> sous
          24 h ouvrées. Souvent dans l'heure si on est entre deux chantiers.
        </p>
        <button
          className="btn"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#F5F5F3',
            border: '1px solid rgba(255,255,255,0.15)',
            justifyContent: 'center'
          }}
          onClick={() => {
            setSent(false);
            setData({ name: '', email: '', phone: '', subject: 'depan', msg: '' });
            setTouched({});
          }}
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) setSent(true);
        else setTouched({ name: true, email: true, phone: true, msg: true });
      }}
      className="glass"
      style={{ padding: 36, height: '100%' }}
    >
      <div className="eyebrow" style={{ color: 'rgba(245,245,243,0.5)', marginBottom: 28 }}>
        Formulaire · réponse &lt; 24 h
      </div>

      <div className="grid grid-2" style={{ gap: 20, marginBottom: 20 }}>
        <FieldDark
          label="Prénom & nom"
          value={data.name}
          onChange={(v) => set('name', v)}
          onBlur={() => blur('name')}
          error={showErr('name') ? errors.name : ''}
        />
        <FieldDark
          label="Téléphone"
          value={data.phone}
          onChange={(v) => set('phone', v)}
          onBlur={() => blur('phone')}
          error={showErr('phone') ? errors.phone : ''}
          placeholder="06 …"
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <FieldDark
          label="E-mail"
          value={data.email}
          onChange={(v) => set('email', v)}
          onBlur={() => blur('email')}
          error={showErr('email') ? errors.email : ''}
        />
      </div>

      <div className="field" style={{ marginBottom: 24 }}>
        <label style={{ color: 'rgba(245,245,243,0.5)' }}>Type de projet</label>
        <div className="row" style={{ flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {subjects.map((s) => (
            <button
              type="button"
              key={s.id}
              className="chip"
              data-active={data.subject === s.id ? 'true' : 'false'}
              onClick={() => set('subject', s.id)}
              style={{
                background: data.subject === s.id ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                color: data.subject === s.id ? 'var(--accent-deep)' : 'rgba(245,245,243,0.85)',
                border:
                  data.subject === s.id
                    ? '1px solid var(--accent)'
                    : '1px solid rgba(255,255,255,0.10)',
                fontSize: 12,
                padding: '7px 13px'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field" style={{ marginBottom: 28 }}>
        <label style={{ color: 'rgba(245,245,243,0.5)' }}>
          Votre message{' '}
          {showErr('msg') && (
            <span style={{ color: '#FFC700', marginLeft: 8 }}>· {errors.msg}</span>
          )}
        </label>
        <textarea
          value={data.msg}
          onChange={(e) => set('msg', e.target.value)}
          onBlur={() => blur('msg')}
          placeholder="Décrivez votre besoin, surface, urgence…"
          style={{
            color: '#F5F5F3',
            borderBottomColor: showErr('msg') ? 'rgba(255,199,0,0.6)' : 'rgba(255,255,255,0.20)',
            minHeight: 100
          }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-accent"
        style={{
          width: '100%',
          justifyContent: 'center',
          opacity: isValid ? 1 : 0.5,
          transition: 'opacity 0.4s'
        }}
      >
        Envoyer ma demande <IconArrowRight size={13} />
      </button>
      <p
        style={{
          fontSize: 11,
          color: 'rgba(245,245,243,0.4)',
          textAlign: 'center',
          marginTop: 14,
          fontFamily: "'JetBrains Mono', monospace"
        }}
      >
        Vos données restent chez nous · pas de relance commerciale
      </p>
    </form>
  );
}

function FieldDark({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <label style={{ color: 'rgba(245,245,243,0.5)' }}>
        {label} {error && <span style={{ color: '#FFC700', marginLeft: 8 }}>· {error}</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          color: '#F5F5F3',
          borderBottomColor: error ? 'rgba(255,199,0,0.6)' : 'rgba(255,255,255,0.20)'
        }}
      />
    </div>
  );
}
