import { useEffect, useRef } from "react";
import { renderCardToCtx } from "./canvas-utils";
import type { Person, CardConfig } from "./types";

interface CardCanvasProps {
  templateImage: HTMLImageElement;
  person: Person;
  config: CardConfig;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  fontsReady: boolean;
}

export default function CardCanvas({ templateImage, person, config, canvasRef, fontsReady }: CardCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef || internalRef;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !templateImage || !fontsReady) return;
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
