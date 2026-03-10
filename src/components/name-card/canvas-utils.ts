import type { Person, CardConfig } from "./types";

/** Draw text centered horizontally on a canvas and return the text height. */
export function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  y: number,
  color: string,
  canvasWidth: number
): number {
  const normalizedText = text.normalize("NFC");
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  (ctx as any).letterSpacing = "1px";
  const metrics = ctx.measureText(normalizedText);
  const x = (canvasWidth - metrics.width) / 2;
  ctx.fillText(normalizedText, x, y);
  (ctx as any).letterSpacing = "0px";
  return (
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
    parseInt(font) * 1.25
  );
}

/** Measure text height without drawing. */
export function measureTextHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string
): number {
  ctx.font = font;
  const metrics = ctx.measureText(text);
  return (
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent ||
    parseInt(font) * 1.25
  );
}

/** Render a complete name card onto a canvas context. */
export function renderCardToCtx(
  ctx: CanvasRenderingContext2D,
  templateImage: HTMLImageElement,
  person: Person,
  config: CardConfig
): void {
  const imgW = templateImage.naturalWidth || templateImage.width;
  const imgH = templateImage.naturalHeight || templateImage.height;

  ctx.canvas.width = imgW;
  ctx.canvas.height = imgH;
  ctx.drawImage(templateImage, 0, 0, imgW, imgH);

  const fontRole = `bold ${config.fontSizeRole}px ${config.fontFamilyRole}`;
  const fontName = `bold ${config.fontSizeName}px ${config.fontFamilyName}`;
  const fontPos = `${config.fontSizePos}px ${config.fontFamilyPos}`;

  const h1 = measureTextHeight(ctx, person.chucDanh, fontRole);
  const h2 = measureTextHeight(ctx, person.name, fontName);
  const h3 = measureTextHeight(ctx, person.chucVu, fontPos);

  const zoneHeight = config.zoneBottom - config.zoneTop;
  const totalContent = h1 + config.gapRoleName + h2 + config.gapNamePos + h3;
  const startY = config.zoneTop + (zoneHeight - totalContent) / 2;

  drawCenteredText(ctx, person.chucDanh, fontRole, startY, config.textColor, imgW);
  drawCenteredText(ctx, person.name, fontName, startY + h1 + config.gapRoleName, config.textColor, imgW);
  drawCenteredText(ctx, person.chucVu, fontPos, startY + h1 + config.gapRoleName + h2 + config.gapNamePos, config.textColor, imgW);
}
