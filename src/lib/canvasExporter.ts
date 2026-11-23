import JSZip from 'jszip';
import {
  ICON_SPECS,
  IconId,
  IconShape,
  generateAppFilterXml,
  generateDrawableXml,
  generateIconPackXml,
} from '../data/icons';
import { getAndroidProjectFiles } from './androidProjectTemplates';

let cachedCalendarImg: HTMLImageElement | null = null;

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

async function getCalendarImage(): Promise<HTMLImageElement> {
  if (cachedCalendarImg && cachedCalendarImg.complete) {
    return cachedCalendarImg;
  }
  cachedCalendarImg = await loadImage('/assets/calendar_photo.png');
  return cachedCalendarImg;
}

function traceShapePath(ctx: CanvasRenderingContext2D, shape: IconShape, size = 512) {
  const s = size / 512;
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(256 * s, 256 * s, 248 * s, 0, Math.PI * 2);
  } else if (shape === 'rounded') {
    const r = 104 * s;
    const x = 8 * s;
    const y = 8 * s;
    const w = 496 * s;
    const h = 496 * s;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  } else if (shape === 'teardrop') {
    ctx.moveTo(256 * s, 8 * s);
    ctx.bezierCurveTo(393 * s, 8 * s, 504 * s, 119 * s, 504 * s, 256 * s);
    ctx.lineTo(504 * s, 436 * s);
    ctx.bezierCurveTo(504 * s, 473.6 * s, 473.6 * s, 504 * s, 436 * s, 504 * s);
    ctx.lineTo(256 * s, 504 * s);
    ctx.bezierCurveTo(119 * s, 504 * s, 8 * s, 393 * s, 8 * s, 256 * s);
    ctx.bezierCurveTo(8 * s, 119 * s, 119 * s, 8 * s, 256 * s, 8 * s);
  } else {
    // Samsung One UI squircle
    ctx.moveTo(256 * s, 8 * s);
    ctx.bezierCurveTo(436 * s, 8 * s, 504 * s, 76 * s, 504 * s, 256 * s);
    ctx.bezierCurveTo(504 * s, 436 * s, 436 * s, 504 * s, 256 * s, 504 * s);
    ctx.bezierCurveTo(76 * s, 504 * s, 8 * s, 436 * s, 8 * s, 256 * s);
    ctx.bezierCurveTo(8 * s, 76 * s, 76 * s, 8 * s, 256 * s, 8 * s);
  }
  ctx.closePath();
}

function drawPillowBase(ctx: CanvasRenderingContext2D, top = '#F9F9FB', mid = '#F1F2F4', bot = '#E1E3E8') {
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, top);
  grad.addColorStop(0.55, mid);
  grad.addColorStop(1, bot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const sheen = ctx.createRadialGradient(256, 92, 10, 256, 92, 370);
  sheen.addColorStop(0, 'rgba(255,255,255,0.85)');
  sheen.addColorStop(0.7, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(203,208,218,0.28)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, 512, 512);
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

export async function renderIconToPngBlob(
  id: IconId,
  shape: IconShape = 'squircle',
  size = 512,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const scale = size / 512;
  ctx.save();
  traceShapePath(ctx, shape, size);
  ctx.clip();
  ctx.scale(scale, scale);

  switch (id) {
    case 'clock': {
      const bg = ctx.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#040405');
      bg.addColorStop(0.48, '#080B12');
      bg.addColorStop(0.68, '#0E254D');
      bg.addColorStop(0.82, '#1E62BD');
      bg.addColorStop(0.92, '#45A9F4');
      bg.addColorStop(0.98, '#C9F0FF');
      bg.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);

      const arc = ctx.createRadialGradient(256, 553, 10, 256, 553, 320);
      arc.addColorStop(0, 'rgba(255,255,255,0.95)');
      arc.addColorStop(0.28, 'rgba(102,198,255,0.72)');
      arc.addColorStop(0.62, 'rgba(27,102,209,0.45)');
      arc.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = arc;
      ctx.fillRect(0, 0, 512, 512);

      const textGrad = ctx.createLinearGradient(0, 60, 0, 440);
      textGrad.addColorStop(0, '#FFFFFF');
      textGrad.addColorStop(0.65, '#EFF4FA');
      textGrad.addColorStop(1, '#C5D4E8');
      ctx.fillStyle = textGrad;
      ctx.textAlign = 'center';
      ctx.font = '700 198px Antonio, Oswald, sans-serif';
      ctx.fillText('09', 256, 222);
      ctx.fillText('35', 256, 428);
      break;
    }

    case 'calendar': {
      const img = await getCalendarImage();
      ctx.drawImage(img, -18, -18, 548, 548);
      break;
    }

    case 'launcher': {
      drawPillowBase(ctx);
      ctx.fillStyle = '#111317';
      ctx.textAlign = 'center';
      ctx.font = '600 214px Outfit, sans-serif';
      ctx.fillText('27', 256, 328);
      break;
    }

    case 'games': {
      const bg = ctx.createLinearGradient(50, 0, 460, 512);
      bg.addColorStop(0, '#F54A6B');
      bg.addColorStop(0.55, '#F4335D');
      bg.addColorStop(1, '#EC264D');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);

      // Draw controller onto an offscreen canvas so cutouts reveal the pink gradient cleanly
      const off = document.createElement('canvas');
      off.width = 512;
      off.height = 512;
      const octx = off.getContext('2d')!;
      octx.fillStyle = '#FFFFFF';
      const p = new Path2D(
        'M 164,174 C 122,174 96,204 86,250 L 72,318 C 66,348 86,370 112,366 C 129,363 142,350 156,330 L 182,298 C 194,284 210,278 256,278 C 302,278 318,284 330,298 L 356,330 C 370,350 383,363 400,366 C 426,370 446,348 440,318 L 426,250 C 416,204 390,174 348,174 L 308,174 C 292,174 282,184 256,184 C 230,184 220,174 204,174 Z',
      );
      octx.fill(p);
      octx.globalCompositeOperation = 'destination-out';
      octx.beginPath();
      octx.roundRect(139, 216, 20, 56, 5);
      octx.roundRect(121, 234, 56, 20, 5);
      octx.roundRect(225, 242, 22, 10, 5);
      octx.roundRect(265, 242, 22, 10, 5);
      octx.fill();
      for (const [cx, cy] of [
        [362, 218],
        [362, 264],
        [339, 241],
        [385, 241],
      ]) {
        octx.beginPath();
        octx.arc(cx, cy, 10.5, 0, Math.PI * 2);
        octx.fill();
      }
      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.18)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(off, 0, 0);
      ctx.restore();
      break;
    }

    case 'videocall': {
      const bg = ctx.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#52ED65');
      bg.addColorStop(0.55, '#38DB52');
      bg.addColorStop(1, '#24C23F');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#151917';
      const bars: [number, number, number, number][] = [
        [92, 232, 11, 48],
        [114, 210, 11, 92],
        [136, 182, 12, 148],
        [160, 114, 13, 284],
        [184, 198, 12, 116],
        [208, 222, 11, 68],
        [232, 176, 12, 160],
        [256, 160, 13, 192],
        [280, 196, 12, 120],
        [304, 216, 11, 80],
        [352, 206, 12, 100],
        [376, 186, 12, 140],
        [400, 222, 11, 68],
      ];
      for (const [x, y, w, h] of bars) {
        drawRoundedRect(ctx, x, y, w, h, w / 2);
        ctx.fill();
      }

      const pinGrad = ctx.createLinearGradient(0, 96, 0, 416);
      pinGrad.addColorStop(0, '#9333EA');
      pinGrad.addColorStop(1, '#6D28D9');
      ctx.fillStyle = pinGrad;
      drawRoundedRect(ctx, 328, 96, 14, 320, 7);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(335, 96, 14, 0, Math.PI * 2);
      ctx.arc(335, 416, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'docs': {
      const diag = ctx.createLinearGradient(0, 0, 512, 512);
      diag.addColorStop(0, '#9452D6');
      diag.addColorStop(0.5, '#DF4A88');
      diag.addColorStop(1, '#EF6B38');
      ctx.fillStyle = diag;
      ctx.fillRect(0, 0, 512, 512);

      const pink = ctx.createRadialGradient(470, 50, 10, 470, 50, 340);
      pink.addColorStop(0, 'rgba(240,44,158,0.95)');
      pink.addColorStop(1, 'rgba(240,44,158,0)');
      ctx.fillStyle = pink;
      ctx.fillRect(0, 0, 512, 512);

      const teal = ctx.createRadialGradient(40, 470, 10, 40, 470, 350);
      teal.addColorStop(0, 'rgba(110,207,146,0.95)');
      teal.addColorStop(0.55, 'rgba(149,181,88,0.55)');
      teal.addColorStop(1, 'rgba(149,181,88,0)');
      ctx.fillStyle = teal;
      ctx.fillRect(0, 0, 512, 512);

      ctx.save();
      ctx.translate(256, 256);
      ctx.rotate(-Math.PI / 4);
      ctx.shadowColor = 'rgba(15,23,42,0.18)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;

      const handleGrad = ctx.createLinearGradient(120, -30, 20, 30);
      handleGrad.addColorStop(0, 'rgba(255,255,255,0.85)');
      handleGrad.addColorStop(1, 'rgba(255,255,255,0.45)');
      ctx.fillStyle = handleGrad;
      ctx.fill(new Path2D('M 18,-36 L 128,-22 C 148,-19 156,-10 156,0 C 156,10 148,19 128,22 L 18,36 Z'));

      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.fill(
        new Path2D(
          'M -132,-56 L 14,-56 C 24,-56 30,-48 30,-38 L 30,38 C 30,48 24,56 14,56 L -132,56 C -144,56 -152,46 -152,32 L -152,-32 C -152,-46 -144,-56 -132,-56 Z',
        ),
      );
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      drawRoundedRect(ctx, -152, -12, 38, 10, 5);
      ctx.fill();
      drawRoundedRect(ctx, -152, 14, 26, 10, 5);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'calculator': {
      drawPillowBase(ctx);
      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.18)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#1C1E22';
      drawRoundedRect(ctx, 116, 88, 280, 336, 44);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#82857F';
      drawRoundedRect(ctx, 148, 120, 216, 72, 14);
      ctx.fill();

      ctx.fillStyle = '#141618';
      ctx.textAlign = 'right';
      ctx.font = '700 42px Outfit, sans-serif';
      ctx.fillText('123', 346, 174);

      ctx.fillStyle = '#F3F4F6';
      for (const y of [216, 278, 340]) {
        drawRoundedRect(ctx, 150, y, 58, 44, 12);
        ctx.fill();
        drawRoundedRect(ctx, 227, y, 58, 44, 12);
        ctx.fill();
      }
      drawRoundedRect(ctx, 304, 216, 58, 44, 12);
      ctx.fill();

      ctx.fillStyle = '#63AAD8';
      drawRoundedRect(ctx, 304, 278, 58, 106, 14);
      ctx.fill();
      break;
    }

    case 'settings': {
      drawPillowBase(ctx, '#F7F5F6', '#ECECEC', '#DDDDDD');
      ctx.save();
      ctx.translate(256, 240);
      ctx.shadowColor = 'rgba(15,23,42,0.18)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#18191C';
      const gearPath = new Path2D(
        'M -24,-154 L 24,-154 L 32,-116 C 46,-112 59,-106 71,-98 L 103,-120 L 137,-86 L 115,-54 C 123,-42 129,-29 133,-15 L 171,-7 L 171,41 L 133,49 C 129,63 123,76 115,88 L 137,120 L 103,154 L 71,132 C 59,140 46,146 32,150 L 24,188 L -24,188 L -32,150 C -46,146 -59,140 -71,132 L -103,154 L -137,120 L -115,88 C -123,76 -129,63 -133,49 L -171,41 L -171,-7 L -133,-15 C -129,-29 -123,-42 -115,-54 L -137,-86 L -103,-120 L -71,-98 C -59,-106 -46,-112 -32,-116 Z M 0,-52 A 68,68 0 1,0 0,84 A 68,68 0 1,0 0,-52 Z',
      );
      ctx.fill(gearPath, 'evenodd');
      ctx.restore();
      break;
    }

    case 'maps': {
      const bg = ctx.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#52AFEC');
      bg.addColorStop(0.5, '#237AE0');
      bg.addColorStop(1, '#0756C4');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);

      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.22)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      const ring = ctx.createLinearGradient(0, 88, 0, 424);
      ring.addColorStop(0, '#FFFFFF');
      ring.addColorStop(1, '#CBE4FF');
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(256, 256, 168, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const inner = ctx.createLinearGradient(0, 122, 0, 390);
      inner.addColorStop(0, '#358CE6');
      inner.addColorStop(1, '#1657C6');
      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.arc(256, 256, 134, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(256, 144);
      ctx.lineTo(178, 342);
      ctx.lineTo(256, 306);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#DCE9FA';
      ctx.beginPath();
      ctx.moveTo(256, 144);
      ctx.lineTo(334, 342);
      ctx.lineTo(256, 306);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'files': {
      drawPillowBase(ctx, '#FAF5F1', '#EFF0F5', '#E6E8F4');
      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.16)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      const fg = ctx.createLinearGradient(0, 124, 0, 396);
      fg.addColorStop(0, '#42BEFF');
      fg.addColorStop(1, '#1592F2');
      ctx.fillStyle = fg;
      ctx.fill(
        new Path2D(
          'M 106,124 L 204,124 C 218,124 226,130 236,144 L 252,164 L 406,164 C 428,164 444,180 444,202 L 444,358 C 444,380 428,396 406,396 L 106,396 C 84,396 68,380 68,358 L 68,162 C 68,140 84,124 106,124 Z',
        ),
      );
      ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.fill(
        new Path2D(
          'M 68,196 C 68,178 82,164 100,164 L 406,164 C 428,164 444,180 444,202 L 444,212 L 68,212 Z',
        ),
      );
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.font = '700 96px Outfit, sans-serif';
      ctx.fillText('G', 410, 374);
      break;
    }

    case 'phone': {
      const bg = ctx.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#52E568');
      bg.addColorStop(1, '#24BD3E');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);
      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.18)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.fill(
        new Path2D(
          'M 168,116 C 178,108 192,110 201,120 L 236,162 C 244,172 243,187 233,196 L 208,218 C 204,222 204,229 208,236 C 222,262 250,290 276,304 C 283,308 290,308 294,304 L 316,279 C 325,269 340,268 350,276 L 392,311 C 402,320 404,334 396,344 L 378,368 C 358,392 322,398 282,380 C 216,350 162,296 132,230 C 114,190 120,154 144,134 Z',
        ),
      );
      ctx.restore();
      break;
    }

    case 'messages': {
      const bg = ctx.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#7259F2');
      bg.addColorStop(1, '#4F36D2');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);
      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.18)';
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.fill(
        new Path2D(
          'M 136,132 L 376,132 C 404,132 426,154 426,182 L 426,314 C 426,342 404,364 376,364 L 218,364 L 146,412 C 138,417 128,411 130,401 L 140,364 L 136,364 C 108,364 86,342 86,314 L 86,182 C 86,154 108,132 136,132 Z',
        ),
      );
      ctx.restore();
      ctx.fillStyle = '#5D44E0';
      for (const cx of [192, 256, 320]) {
        ctx.beginPath();
        ctx.arc(cx, 248, 19, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'gallery': {
      drawPillowBase(ctx, '#F6F6F4', '#EFEFEF', '#EAEAEA');
      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.14)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(332, 178, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#077EFC';
      ctx.fill(new Path2D('M 96,356 L 194,188 C 199,180 211,180 216,188 L 314,356 Z'));
      ctx.fillStyle = '#056CCB';
      ctx.fill(new Path2D('M 216,356 L 304,224 C 309,217 319,217 324,224 L 416,356 Z'));
      ctx.restore();
      break;
    }

    case 'camera': {
      const pillow = ctx.createLinearGradient(0, 0, 0, 512);
      pillow.addColorStop(0, '#F3F3F1');
      pillow.addColorStop(0.55, '#DCDBD8');
      pillow.addColorStop(1, '#B3AFA9');
      ctx.fillStyle = pillow;
      ctx.fillRect(0, 0, 512, 512);

      ctx.save();
      ctx.shadowColor = 'rgba(15,23,42,0.22)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      const bezel = ctx.createLinearGradient(0, 70, 0, 442);
      bezel.addColorStop(0, '#F9F9F8');
      bezel.addColorStop(1, '#D6D5D2');
      ctx.fillStyle = bezel;
      ctx.beginPath();
      ctx.arc(256, 256, 186, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#1C1E22';
      ctx.beginPath();
      ctx.arc(256, 256, 160, 0, Math.PI * 2);
      ctx.fill();

      const barrel = ctx.createRadialGradient(256, 230, 10, 256, 256, 150);
      barrel.addColorStop(0, '#1D222B');
      barrel.addColorStop(0.72, '#0F1218');
      barrel.addColorStop(1, '#07080B');
      ctx.fillStyle = barrel;
      ctx.beginPath();
      ctx.arc(256, 256, 146, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(256, 256, 118, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#06090F';
      ctx.beginPath();
      ctx.arc(256, 256, 96, 0, Math.PI * 2);
      ctx.fill();

      const glow = ctx.createRadialGradient(296, 302, 5, 296, 302, 130);
      glow.addColorStop(0, 'rgba(56,189,248,0.34)');
      glow.addColorStop(0.45, 'rgba(29,78,216,0.16)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(256, 256, 96, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(125,211,252,0.28)';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(256, 256, 68, -0.7, 0.72);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.arc(220, 218, 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(`Failed to render ${id} PNG`));
    }, 'image/png');
  });
}

async function renderMaskAsset(kind: 'back' | 'mask' | 'upon', shape: IconShape): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (kind === 'mask') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);
    ctx.globalCompositeOperation = 'destination-out';
    traceShapePath(ctx, shape, 512);
    ctx.fill();
  } else if (kind === 'back') {
    traceShapePath(ctx, shape, 512);
    ctx.clip();
    drawPillowBase(ctx);
  } else {
    traceShapePath(ctx, shape, 512);
    ctx.clip();
    const gloss = ctx.createLinearGradient(0, 0, 0, 512);
    gloss.addColorStop(0, 'rgba(255,255,255,0.18)');
    gloss.addColorStop(0.25, 'rgba(255,255,255,0)');
    gloss.addColorStop(0.85, 'rgba(0,0,0,0)');
    gloss.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = gloss;
    ctx.fillRect(0, 0, 512, 512);
  }

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png');
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadSingleIconPng(id: IconId, shape: IconShape = 'squircle') {
  const spec = ICON_SPECS.find((s) => s.id === id);
  const blob = await renderIconToPngBlob(id, shape, 512);
  triggerDownload(blob, `${spec?.drawableName ?? id}_512px.png`);
}

export async function downloadGoodLockPngBundle(shape: IconShape = 'squircle') {
  const zip = new JSZip();
  const iconsFolder = zip.folder('SunlitOneUI_Icons_512px')!;

  for (const spec of ICON_SPECS) {
    const png = await renderIconToPngBlob(spec.id, shape, 512);
    iconsFolder.file(`${spec.drawableName}.png`, png);
  }

  // Include matching sunset wallpaper
  const wpResp = await fetch('/assets/wallpaper_sunset.jpg');
  if (wpResp.ok) {
    zip.file('wallpaper_sunset.jpg', await wpResp.blob());
  }

  zip.file(
    'README_GOOD_LOCK.txt',
    [
      'Sunlit OneUI Icon Pack — Samsung Good Lock Theme Park Guide',
      '=============================================================',
      'Option A (Direct PNG Import — No APK needed):',
      '1. Extract this ZIP on your Samsung Galaxy phone.',
      '2. Open Good Lock -> Theme Park -> Icon -> Create New.',
      '3. Tap the three-dot menu (or Icon) -> Change icons -> Select app -> Gallery -> Pick the matching PNG from SunlitOneUI_Icons_512px.',
      '4. Save & Apply!',
      '',
      'Option B (Full APK via GitHub Actions — Recommended):',
      'Use the "Download GitHub + Android APK Repo" button in the web app, push to GitHub, download the built APK from Actions Artifacts, install on your Galaxy, and select "Sunlit OneUI" directly under Theme Park -> Icon -> Iconpack!',
    ].join('\n'),
  );

  const content = await zip.generateAsync({ type: 'blob' });
  triggerDownload(content, `SunlitOneUI-GoodLock-PNG-${shape}.zip`);
}

export async function downloadGitHubAndroidRepoBundle(shape: IconShape = 'squircle') {
  const zip = new JSZip();
  const projectFiles = getAndroidProjectFiles({
    appfilterXml: generateAppFilterXml(),
    drawableXml: generateDrawableXml(),
    iconpackXml: generateIconPackXml(),
  });

  for (const [path, fileContent] of Object.entries(projectFiles)) {
    zip.file(path, fileContent);
  }

  const drawableDir = zip.folder('app/src/main/res/drawable-nodpi')!;
  for (const spec of ICON_SPECS) {
    const png = await renderIconToPngBlob(spec.id, shape, 512);
    drawableDir.file(`${spec.drawableName}.png`, png);
  }

  drawableDir.file('icon_back.png', await renderMaskAsset('back', shape));
  drawableDir.file('icon_mask.png', await renderMaskAsset('mask', shape));
  drawableDir.file('icon_upon.png', await renderMaskAsset('upon', shape));

  const wpResp = await fetch('/assets/wallpaper_sunset.jpg');
  if (wpResp.ok) {
    drawableDir.file('wallpaper_sunset.jpg', await wpResp.blob());
  }

  const content = await zip.generateAsync({ type: 'blob' });
  triggerDownload(content, `SunlitOneUI-IconPack-GitHub-APK.zip`);
}
