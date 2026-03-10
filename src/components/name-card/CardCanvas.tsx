import { useEffect, useRef, useState } from "react";
import { renderCardToCtx } from "./canvas-utils";
import type { Person, CardConfig } from "./types";

interface CardCanvasProps {
  templateImage: HTMLImageElement;
  person: Person;
  config: CardConfig;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

/** Preload the Vietnamese-capable fonts before canvas rendering. */
async function ensureFontsLoaded(config: CardConfig): Promise<void> {
  const fontsToLoad = [
    `bold ${config.fontSizeRole}px ${config.fontFamilyRole}`,
    `bold ${config.fontSizeName}px ${config.fontFamilyName}`,
    `${config.fontSizePos}px ${config.fontFamilyPos}`,
  ];
  await Promise.all(fontsToLoad.map((f) => document.fonts.load(f, "Quốc")));
}

export default function CardCanvas({ templateImage, person, config, canvasRef }: CardCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef || internalRef;
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureFontsLoaded(config).then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => { cancelled = true; };
  }, [config]);

  useEffect(() => {
    if (!fontsReady) return;
    const canvas = ref.current;
    if (!canvas || !templateImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderCardToCtx(ctx, templateImage, person, config);
  }, [templateImage, person, config, ref, fontsReady]);

  return (
    <canvas
      ref={ref}
      className="w-full max-w-[520px] h-auto rounded-lg shadow-lg"
    />
  );
}
