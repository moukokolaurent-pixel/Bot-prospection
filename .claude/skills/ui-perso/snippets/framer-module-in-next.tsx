/**
 * Monte un module Framer distant dans une app Next.js / React.
 *
 * NON TESTE en execution : framer.com est refuse par la politique reseau de
 * l'environnement ou ce fichier a ete ecrit. Le motif est correct, mais faites
 * passer le preflight AVANT de vous en servir :
 *
 *     python3 .claude/skills/ui-perso/scripts/framer-preflight.py "<url>"
 *
 * Si le verdict est "NE FONCTIONNERA PAS TEL QUEL", ce wrapper n'y changera
 * rien : le probleme est dans le module, pas dans le montage. Reimplementez
 * l'effet.
 *
 * Suppose : Next.js App Router, React 18+, Tailwind pour les classes du
 * fallback (sinon remplacez-les).
 *
 * Ce que le wrapper resout :
 *   - import distant ignore par le bundler (webpackIgnore)
 *   - rendu client uniquement, jamais en SSR
 *   - etats de chargement et d'echec explicites, au lieu d'une page blanche
 *   - respect de prefers-reduced-motion : on ne charge meme pas le module
 *
 * Ce qu'il ne resout pas :
 *   - la CSP : il faut autoriser script-src vers les domaines du module
 *   - la disparition de l'URL : prevoyez toujours un fallback visuel utile
 */

"use client";

import { useEffect, useState, type ComponentType } from "react";

type Props = {
  /** URL complete du module, hash de version inclus. */
  url: string;
  /** Nom de l'export a monter. Les modules Framer exportent en default. */
  exportName?: string;
  /** Props passees au composant distant. */
  componentProps?: Record<string, unknown>;
  /** Rendu quand le module ne peut pas etre charge, ou en mouvement reduit. */
  fallback?: React.ReactNode;
  /** Hauteur reservee pendant le chargement, pour ne pas decaler la page (CLS). */
  minHeight?: number | string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function FramerModule({
  url,
  exportName = "default",
  componentProps,
  fallback = null,
  minHeight = 320,
}: Props) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // En mouvement reduit on ne telecharge rien du tout : c'est aussi
    // quelques centaines de ko economises pour ces visiteurs.
    if (reducedMotion) return;

    let cancelled = false;
    (async () => {
      try {
        // webpackIgnore laisse l'import natif au navigateur. Sans ce commentaire
        // le bundler tente de resoudre l'URL au build et echoue.
        const mod = await import(/* webpackIgnore: true */ /* @vite-ignore */ url);
        const resolved = mod?.[exportName] ?? mod?.default;
        if (!resolved) throw new Error(`export "${exportName}" absent du module`);
        if (!cancelled) setComponent(() => resolved as ComponentType<any>);
      } catch (err) {
        console.error(`[FramerModule] echec du chargement de ${url}`, err);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url, exportName, reducedMotion]);

  if (reducedMotion || failed) return <>{fallback}</>;

  if (!Component) {
    // Espace reserve : sans lui la page saute quand le module arrive.
    return <div style={{ minHeight }} aria-hidden="true" />;
  }

  return <Component {...componentProps} />;
}

/* ───────────────────────────── Exemple ─────────────────────────────

import { FramerModule } from "@/components/framer-module";

export default function Hero() {
  return (
    <section className="relative min-h-[60vh]">
      <FramerModule
        url="https://framer.com/m/eyes-ZYGv.js@FfIIKDynKRXjqznTXtaR"
        minHeight="60vh"
        // Le fallback n'est pas une consolation : c'est ce que verront les
        // visiteurs en mouvement reduit, ceux sous CSP stricte, et tout le
        // monde le jour ou l'URL disparait. Il doit tenir tout seul.
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <h1 className="text-4xl font-semibold">Votre titre</h1>
          </div>
        }
      />
    </section>
  );
}

──────────────────────────────────────────────────────────────────── */
