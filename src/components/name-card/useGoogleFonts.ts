import { useState, useEffect } from "react";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap&subset=vietnamese";

const FONT_SAMPLE_TEXT = "Tiếng Việt Quốc Trần Tuấn";

function ensureFontStylesheet(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[href="${url}"]`);

    if (existing) {
      if (existing.sheet) {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Font stylesheet failed to load")), { once: true });
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => reject(new Error("Font stylesheet failed to load")), { once: true });
    document.head.appendChild(link);
  });
}

export function useGoogleFonts(url: string = GOOGLE_FONTS_URL): boolean {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkFonts = async () => {
      setFontsReady(false);

      try {
        await ensureFontStylesheet(url);
        await Promise.all([
          document.fonts.load('700 48px "Be Vietnam Pro"', FONT_SAMPLE_TEXT),
          document.fonts.load('700 48px "Noto Serif"', FONT_SAMPLE_TEXT),
          document.fonts.load('400 48px "Noto Serif"', FONT_SAMPLE_TEXT),
          document.fonts.load('italic 700 48px "Noto Serif"', FONT_SAMPLE_TEXT),
        ]);
        await document.fonts.ready;
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
      }

      if (!cancelled) {
        setFontsReady(true);
      }
    };

    checkFonts();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return fontsReady;
}

