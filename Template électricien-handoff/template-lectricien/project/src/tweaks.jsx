/* TWEAKS PANEL — reads/writes through AppCtx so the rest of the app stays in sync */

function AppTweaks() {
  const { tweaks, setTweak } = useApp();

  return (
    <TweaksPanel>
      <TweakSection label="Hero">
        <TweakRadio label="Layout" value={tweaks.heroVariant} onChange={(v) => setTweak("heroVariant", v)}
          options={[
            { value: "split", label: "Split" },
            { value: "float", label: "Centré" },
            { value: "editorial", label: "Édito" },
          ]} />
      </TweakSection>

      <TweakSection label="Densité">
        <TweakRadio label="Espacement" value={tweaks.density} onChange={(v) => setTweak("density", v)}
          options={[
            { value: "compact", label: "Compact" },
            { value: "aere", label: "Aéré" },
          ]} />
      </TweakSection>

      <TweakSection label="Glassmorphism">
        <TweakSlider label="Intensité" min={0} max={10} step={1} value={tweaks.glass} onChange={(v) => setTweak("glass", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { AppTweaks });
