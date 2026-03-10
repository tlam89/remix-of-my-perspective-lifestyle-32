import { useState, useEffect } from "react";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap&subset=vietnamese";

export function useGoogleFonts(url: string = GOOGLE_FONTS_URL): boolean {
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    // Inject <link> for Google Fonts if not already present
    const existing = document.querySelector(`link[href="${url}"]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }

    // Wait until the fonts are actually loaded and ready
    const checkFonts = async () => {
      try {
        await document.fonts.ready;
        // Force-load the specific fonts we need for canvas
        await Promise.all([
          document.fonts.load('700 48px "Be Vietnam Pro"'),
          document.fonts.load('700 48px "Noto Serif"'),
          document.fonts.load('italic 700 48px "Noto Serif"'),
        ]);
      } catch {
        // Fallback: wait a fixed time
        await new Promise((r) => setTimeout(r, 1500));
      }
      setFontsReady(true);
    };
    checkFonts();
  }, [url]);

  return fontsReady;
}
