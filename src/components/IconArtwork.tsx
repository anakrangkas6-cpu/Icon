import React, { useId } from 'react';
import { IconId, IconShape } from '../data/icons';

interface IconArtworkProps {
  id: IconId;
  shape?: IconShape;
  className?: string;
  clockTime?: { hours: string; minutes: string };
  calendarDate?: { day: string; month: string };
  useReferenceCalendarPhoto?: boolean;
}

export function getShapePath(shape: IconShape): string {
  switch (shape) {
    case 'circle':
      return 'M 256,8 C 393,8 504,119 504,256 C 504,393 393,504 256,504 C 119,504 8,393 8,256 C 8,119 119,8 256,8 Z';
    case 'rounded':
      return 'M 112,8 L 400,8 C 457.4,8 504,54.6 504,112 L 504,400 C 504,457.4 457.4,504 400,504 L 112,504 C 54.6,504 8,457.4 8,400 L 8,112 C 8,54.6 54.6,8 112,8 Z';
    case 'teardrop':
      return 'M 256,8 C 393,8 504,119 504,256 L 504,436 C 504,473.6 473.6,504 436,504 L 256,504 C 119,504 8,393 8,256 C 8,119 119,8 256,8 Z';
    case 'squircle':
    default:
      // Samsung One UI superellipse curvature
      return 'M 256,8 C 436,8 504,76 504,256 C 504,436 436,504 256,504 C 76,504 8,436 8,256 C 8,76 76,8 256,8 Z';
  }
}

export const IconArtwork: React.FC<IconArtworkProps> = ({
  id,
  shape = 'squircle',
  className = 'w-full h-full',
  clockTime = { hours: '09', minutes: '35' },
  calendarDate = { day: '12', month: 'Jan' },
  useReferenceCalendarPhoto = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const clipId = `clip_${uid}`;
  const shapePath = getShapePath(shape);

  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={id}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={shapePath} />
        </clipPath>
        {/* Soft pillow bevel overlay used across light icons */}
        <linearGradient id={`pillow_${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9F9FB" />
          <stop offset="55%" stopColor="#F1F2F4" />
          <stop offset="100%" stopColor="#E1E3E8" />
        </linearGradient>
        <radialGradient id={`pillowSheen_${uid}`} cx="50%" cy="18%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#CBD0DA" stopOpacity="0.28" />
        </radialGradient>
        <filter id={`softShadow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.16" />
        </filter>
        <filter id={`textShadow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {id === 'clock' && (
          <>
            <defs>
              <linearGradient id={`clkBg_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#040405" />
                <stop offset="48%" stopColor="#080B12" />
                <stop offset="68%" stopColor="#0E254D" />
                <stop offset="82%" stopColor="#1E62BD" />
                <stop offset="92%" stopColor="#45A9F4" />
                <stop offset="98%" stopColor="#C9F0FF" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <radialGradient id={`clkArc_${uid}`} cx="50%" cy="108%" r="62%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="28%" stopColor="#66C6FF" stopOpacity="0.72" />
                <stop offset="62%" stopColor="#1B66D1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`clkNum_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#EFF4FA" />
                <stop offset="100%" stopColor="#C5D4E8" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#clkBg_${uid})`} />
            <rect width="512" height="512" fill={`url(#clkArc_${uid})`} />
            <text
              x="256"
              y="222"
              textAnchor="middle"
              fill={`url(#clkNum_${uid})`}
              style={{
                fontFamily: "'Antonio', 'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: '198px',
                letterSpacing: '-6px',
              }}
            >
              {clockTime.hours}
            </text>
            <text
              x="256"
              y="428"
              textAnchor="middle"
              fill={`url(#clkNum_${uid})`}
              style={{
                fontFamily: "'Antonio', 'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: '198px',
                letterSpacing: '-6px',
              }}
            >
              {clockTime.minutes}
            </text>
          </>
        )}

        {id === 'calendar' && (
          <>
            <image
              href="/assets/calendar_photo.png"
              x="-18"
              y="-18"
              width="548"
              height="548"
              preserveAspectRatio="xMidYMid slice"
            />
            {!useReferenceCalendarPhoto && (
              <>
                <rect x="200" y="370" width="295" height="125" rx="18" fill="rgba(16,24,32,0.55)" />
                <text
                  x="466"
                  y="456"
                  textAnchor="end"
                  fill="#FFFFFF"
                  filter={`url(#textShadow_${uid})`}
                  style={{
                    fontFamily: "'Antonio', sans-serif",
                    fontWeight: 700,
                    fontSize: '84px',
                    letterSpacing: '-1px',
                  }}
                >
                  {`${calendarDate.day} ${calendarDate.month}`}
                </text>
              </>
            )}
          </>
        )}

        {id === 'launcher' && (
          <>
            <rect width="512" height="512" fill={`url(#pillow_${uid})`} />
            <rect width="512" height="512" fill={`url(#pillowSheen_${uid})`} />
            <text
              x="256"
              y="328"
              textAnchor="middle"
              fill="#111317"
              style={{
                fontFamily: "'Outfit', 'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: '214px',
                letterSpacing: '-10px',
              }}
            >
              27
            </text>
          </>
        )}

        {id === 'games' && (
          <>
            <defs>
              <linearGradient id={`gamesBg_${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#F54A6B" />
                <stop offset="55%" stopColor="#F4335D" />
                <stop offset="100%" stopColor="#EC264D" />
              </linearGradient>
              <mask id={`ctrlMask_${uid}`}>
                <rect width="512" height="512" fill="white" />
                {/* Left D-pad cutout */}
                <rect x="139" y="216" width="20" height="56" rx="5" fill="black" />
                <rect x="121" y="234" width="56" height="20" rx="5" fill="black" />
                {/* Right 4-button diamond cutouts */}
                <circle cx="362" cy="218" r="10.5" fill="black" />
                <circle cx="362" cy="264" r="10.5" fill="black" />
                <circle cx="339" cy="241" r="10.5" fill="black" />
                <circle cx="385" cy="241" r="10.5" fill="black" />
                {/* Center Start/Select cutouts */}
                <rect x="225" y="242" width="22" height="10" rx="5" fill="black" />
                <rect x="265" y="242" width="22" height="10" rx="5" fill="black" />
              </mask>
            </defs>
            <rect width="512" height="512" fill={`url(#gamesBg_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              <path
                mask={`url(#ctrlMask_${uid})`}
                fill="#FFFFFF"
                d="M 164,174 C 122,174 96,204 86,250 L 72,318 C 66,348 86,370 112,366 C 129,363 142,350 156,330 L 182,298 C 194,284 210,278 256,278 C 302,278 318,284 330,298 L 356,330 C 370,350 383,363 400,366 C 426,370 446,348 440,318 L 426,250 C 416,204 390,174 348,174 L 308,174 C 292,174 282,184 256,184 C 230,184 220,174 204,174 Z"
              />
            </g>
          </>
        )}

        {id === 'videocall' && (
          <>
            <defs>
              <linearGradient id={`vcBg_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52ED65" />
                <stop offset="55%" stopColor="#38DB52" />
                <stop offset="100%" stopColor="#24C23F" />
              </linearGradient>
              <linearGradient id={`vcPin_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#6D28D9" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#vcBg_${uid})`} />
            {/* Dark waveform spectrum bars */}
            <g fill="#151917">
              <rect x="92" y="232" width="11" height="48" rx="5.5" />
              <rect x="114" y="210" width="11" height="92" rx="5.5" />
              <rect x="136" y="182" width="12" height="148" rx="6" />
              <rect x="160" y="114" width="13" height="284" rx="6.5" />
              <rect x="184" y="198" width="12" height="116" rx="6" />
              <rect x="208" y="222" width="11" height="68" rx="5.5" />
              <rect x="232" y="176" width="12" height="160" rx="6" />
              <rect x="256" y="160" width="13" height="192" rx="6.5" />
              <rect x="280" y="196" width="12" height="120" rx="6" />
              <rect x="304" y="216" width="11" height="80" rx="5.5" />
              <rect x="352" y="206" width="12" height="100" rx="6" />
              <rect x="376" y="186" width="12" height="140" rx="6" />
              <rect x="400" y="222" width="11" height="68" rx="5.5" />
            </g>
            {/* Violet/purple vertical locator pin with bulbs */}
            <g fill={`url(#vcPin_${uid})`}>
              <rect x="328" y="96" width="14" height="320" rx="7" />
              <circle cx="335" cy="96" r="14" />
              <circle cx="335" cy="416" r="14" />
            </g>
          </>
        )}

        {id === 'docs' && (
          <>
            <defs>
              <linearGradient id={`docsDiag_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9452D6" />
                <stop offset="50%" stopColor="#DF4A88" />
                <stop offset="100%" stopColor="#EF6B38" />
              </linearGradient>
              <radialGradient id={`docsPink_${uid}`} cx="92%" cy="10%" r="65%">
                <stop offset="0%" stopColor="#F02C9E" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F02C9E" stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`docsTeal_${uid}`} cx="8%" cy="92%" r="68%">
                <stop offset="0%" stopColor="#6ECF92" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#95B558" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#95B558" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`brushHandle_${uid}`} x1="0.8" y1="0.1" x2="0.2" y2="0.9">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#docsDiag_${uid})`} />
            <rect width="512" height="512" fill={`url(#docsPink_${uid})`} />
            <rect width="512" height="512" fill={`url(#docsTeal_${uid})`} />
            {/* Frosted 45-deg paintbrush pointing down-left */}
            <g transform="translate(256 256) rotate(-45)" filter={`url(#softShadow_${uid})`}>
              {/* Translucent handle on right */}
              <path
                d="M 18,-36 L 128,-22 C 148,-19 156,-10 156,0 C 156,10 148,19 128,22 L 18,36 Z"
                fill={`url(#brushHandle_${uid})`}
              />
              {/* Ferrule + Bristle block on left */}
              <path
                d="M -132,-56 L 14,-56 C 24,-56 30,-48 30,-38 L 30,38 C 30,48 24,56 14,56 L -132,56 C -144,56 -152,46 -152,32 L -152,-32 C -152,-46 -144,-56 -132,-56 Z"
                fill="rgba(255,255,255,0.88)"
              />
              {/* Subtle bristle step notches */}
              <rect x="-152" y="-12" width="38" height="10" rx="5" fill="rgba(255,255,255,0.45)" />
              <rect x="-152" y="14" width="26" height="10" rx="5" fill="rgba(255,255,255,0.45)" />
            </g>
          </>
        )}

        {id === 'calculator' && (
          <>
            <rect width="512" height="512" fill={`url(#pillow_${uid})`} />
            <rect width="512" height="512" fill={`url(#pillowSheen_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              {/* Dark pocket calculator chassis */}
              <rect x="116" y="88" width="280" height="336" rx="44" fill="#1C1E22" />
              {/* Sage LCD Display */}
              <rect x="148" y="120" width="216" height="72" rx="14" fill="#82857F" />
              <text
                x="346"
                y="174"
                textAnchor="end"
                fill="#141618"
                style={{
                  fontFamily: "'Outfit', 'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '42px',
                  letterSpacing: '1px',
                }}
              >
                123
              </text>
              {/* 3x3 Keypad grid */}
              {/* Row 1 */}
              <rect x="150" y="216" width="58" height="44" rx="12" fill="#F3F4F6" />
              <rect x="227" y="216" width="58" height="44" rx="12" fill="#F3F4F6" />
              <rect x="304" y="216" width="58" height="44" rx="12" fill="#F3F4F6" />
              {/* Row 2 */}
              <rect x="150" y="278" width="58" height="44" rx="12" fill="#F3F4F6" />
              <rect x="227" y="278" width="58" height="44" rx="12" fill="#F3F4F6" />
              {/* Row 3 */}
              <rect x="150" y="340" width="58" height="44" rx="12" fill="#F3F4F6" />
              <rect x="227" y="340" width="58" height="44" rx="12" fill="#F3F4F6" />
              {/* Tall sky-blue "=" key */}
              <rect x="304" y="278" width="58" height="106" rx="14" fill="#63AAD8" />
            </g>
          </>
        )}

        {id === 'settings' && (
          <>
            <rect width="512" height="512" fill={`url(#pillow_${uid})`} />
            <rect width="512" height="512" fill={`url(#pillowSheen_${uid})`} />
            <g transform="translate(256 256)" filter={`url(#softShadow_${uid})`}>
              {/* 8-tooth precision charcoal cogwheel */}
              <path
                fill="#18191C"
                fillRule="evenodd"
                d="
                  M -24,-154 L 24,-154 L 32,-116 C 46,-112 59,-106 71,-98 L 103,-120 L 137,-86 L 115,-54
                  C 123,-42 129,-29 133,-15 L 171,-7 L 171,41 L 133,49
                  C 129,63 123,76 115,88 L 137,120 L 103,154 L 71,132
                  C 59,140 46,146 32,150 L 24,188 L -24,188 L -32,150
                  C -46,146 -59,140 -71,132 L -103,154 L -137,120 L -115,88
                  C -123,76 -129,63 -133,49 L -171,41 L -171,-7 L -133,-15
                  C -129,-29 -123,-42 -115,-54 L -137,-86 L -103,-120 L -71,-98
                  C -59,-106 -46,-112 -32,-116 Z
                  M 0,-52 A 68,68 0 1,0 0,84 A 68,68 0 1,0 0,-52 Z
                "
                transform="translate(0 -16)"
              />
            </g>
          </>
        )}

        {id === 'maps' && (
          <>
            <defs>
              <linearGradient id={`mapsBg_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52AFEC" />
                <stop offset="50%" stopColor="#237AE0" />
                <stop offset="100%" stopColor="#0756C4" />
              </linearGradient>
              <linearGradient id={`mapsRing_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#CBE4FF" />
              </linearGradient>
              <linearGradient id={`mapsInner_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#358CE6" />
                <stop offset="100%" stopColor="#1657C6" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#mapsBg_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              <circle cx="256" cy="256" r="168" fill={`url(#mapsRing_${uid})`} />
              <circle cx="256" cy="256" r="134" fill={`url(#mapsInner_${uid})`} />
              {/* Split-shaded navigation arrow */}
              <polygon points="256,144 178,342 256,306" fill="#FFFFFF" />
              <polygon points="256,144 334,342 256,306" fill="#DCE9FA" />
            </g>
          </>
        )}

        {id === 'files' && (
          <>
            <defs>
              <linearGradient id={`folderGrad_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42BEFF" />
                <stop offset="100%" stopColor="#1592F2" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#pillow_${uid})`} />
            <rect width="512" height="512" fill={`url(#pillowSheen_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              <path
                fill={`url(#folderGrad_${uid})`}
                d="M 106,124 L 204,124 C 218,124 226,130 236,144 L 252,164 L 406,164 C 428,164 444,180 444,202 L 444,358 C 444,380 428,396 406,396 L 106,396 C 84,396 68,380 68,358 L 68,162 C 68,140 84,124 106,124 Z"
              />
              {/* Subtle top folder flap highlight */}
              <path
                fill="rgba(255,255,255,0.16)"
                d="M 68,196 C 68,178 82,164 100,164 L 406,164 C 428,164 444,180 444,202 L 444,212 L 68,212 Z"
              />
              <text
                x="410"
                y="374"
                textAnchor="end"
                fill="#FFFFFF"
                style={{
                  fontFamily: "'Outfit', 'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '96px',
                }}
              >
                G
              </text>
            </g>
          </>
        )}

        {id === 'phone' && (
          <>
            <defs>
              <linearGradient id={`phoneBg_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52E568" />
                <stop offset="100%" stopColor="#24BD3E" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#phoneBg_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              <path
                fill="#FFFFFF"
                d="M 168,116 C 178,108 192,110 201,120 L 236,162 C 244,172 243,187 233,196 L 208,218 C 204,222 204,229 208,236 C 222,262 250,290 276,304 C 283,308 290,308 294,304 L 316,279 C 325,269 340,268 350,276 L 392,311 C 402,320 404,334 396,344 L 378,368 C 358,392 322,398 282,380 C 216,350 162,296 132,230 C 114,190 120,154 144,134 Z"
              />
            </g>
          </>
        )}

        {id === 'messages' && (
          <>
            <defs>
              <linearGradient id={`msgBg_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7259F2" />
                <stop offset="100%" stopColor="#4F36D2" />
              </linearGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#msgBg_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              <path
                fill="#FFFFFF"
                d="M 136,132 L 376,132 C 404,132 426,154 426,182 L 426,314 C 426,342 404,364 376,364 L 218,364 L 146,412 C 138,417 128,411 130,401 L 140,364 L 136,364 C 108,364 86,342 86,314 L 86,182 C 86,154 108,132 136,132 Z"
              />
              <circle cx="192" cy="248" r="19" fill="#5D44E0" />
              <circle cx="256" cy="248" r="19" fill="#5D44E0" />
              <circle cx="320" cy="248" r="19" fill="#5D44E0" />
            </g>
          </>
        )}

        {id === 'gallery' && (
          <>
            <rect width="512" height="512" fill={`url(#pillow_${uid})`} />
            <rect width="512" height="512" fill={`url(#pillowSheen_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              {/* Small dark sun/moon disc */}
              <circle cx="332" cy="178" r="30" fill="#111827" />
              {/* Left tall cobalt peak */}
              <path
                fill="#077EFC"
                d="M 96,356 L 194,188 C 199,180 211,180 216,188 L 314,356 Z"
              />
              {/* Right overlapping deeper blue peak */}
              <path
                fill="#056CCB"
                d="M 216,356 L 304,224 C 309,217 319,217 324,224 L 416,356 Z"
              />
            </g>
          </>
        )}

        {id === 'camera' && (
          <>
            <defs>
              <linearGradient id={`camPillow_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F3F3F1" />
                <stop offset="55%" stopColor="#DCDBD8" />
                <stop offset="100%" stopColor="#B3AFA9" />
              </linearGradient>
              <linearGradient id={`camBezel_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F9F9F8" />
                <stop offset="100%" stopColor="#D6D5D2" />
              </linearGradient>
              <radialGradient id={`camBarrel_${uid}`} cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1D222B" />
                <stop offset="72%" stopColor="#0F1218" />
                <stop offset="100%" stopColor="#07080B" />
              </radialGradient>
              <radialGradient id={`camLensGlow_${uid}`} cx="62%" cy="66%" r="52%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.34" />
                <stop offset="45%" stopColor="#1D4ED8" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="512" height="512" fill={`url(#camPillow_${uid})`} />
            <g filter={`url(#softShadow_${uid})`}>
              {/* Outer raised silver ring */}
              <circle cx="256" cy="256" r="186" fill={`url(#camBezel_${uid})`} />
            </g>
            {/* Dark chamfer groove */}
            <circle cx="256" cy="256" r="160" fill="#1C1E22" />
            {/* Matte lens barrel */}
            <circle cx="256" cy="256" r="146" fill={`url(#camBarrel_${uid})`} />
            {/* Subtle concentric ridge */}
            <circle cx="256" cy="256" r="118" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            {/* Inner deep obsidian glass */}
            <circle cx="256" cy="256" r="96" fill="#06090F" />
            <circle cx="256" cy="256" r="96" fill={`url(#camLensGlow_${uid})`} />
            {/* Optical cyan arc reflection */}
            <path
              d="M 294,204 A 68,68 0 0,1 302,302"
              fill="none"
              stroke="rgba(125,211,252,0.28)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Tiny crisp specular glint */}
            <circle cx="220" cy="218" r="10" fill="rgba(255,255,255,0.22)" />
          </>
        )}
      </g>
    </svg>
  );
};
