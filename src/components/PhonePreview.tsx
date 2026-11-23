import React, { useEffect, useState } from 'react';
import { ICON_SPECS, IconId, IconShape } from '../data/icons';
import { IconArtwork } from './IconArtwork';

interface PhonePreviewProps {
  selectedId: IconId;
  onSelectIcon: (id: IconId) => void;
  shape: IconShape;
  viewMode: 'live' | 'reference' | 'compare';
  useLiveTime: boolean;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  selectedId,
  onSelectIcon,
  shape,
  viewMode,
  useLiveTime,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!useLiveTime) return;
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, [useLiveTime]);

  const clockTime = useLiveTime
    ? {
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
      }
    : { hours: '09', minutes: '35' };

  const calendarDate = useLiveTime
    ? {
        day: String(now.getDate()),
        month: now.toLocaleString('en-US', { month: 'short' }),
      }
    : { day: '12', month: 'Jan' };

  const gridIcons = ICON_SPECS.filter((i) => i.category === 'grid');
  const dockIcons = ICON_SPECS.filter((i) => i.category === 'dock');

  const renderInteractiveScreen = () => (
    <div
      className="relative w-full h-full select-none overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage: 'url(/assets/wallpaper_sunset.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Status bar */}
      <div className="px-5 pt-2.5 pb-1 flex items-center justify-between text-white text-[11px] font-medium tracking-tight">
        <span className="tabular-nums">{useLiveTime ? `${clockTime.hours}:${clockTime.minutes}` : '12:00'}</span>
        {/* Punch-hole camera */}
        <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner" />
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 fill-white" viewBox="0 0 16 16">
            <path d="M1 14h2v-3H1v3zm4 0h2V9H5v5zm4 0h2V6H9v8zm4 0h2V2h-2v12z" />
          </svg>
          <svg className="w-3 h-3 fill-white" viewBox="0 0 16 16">
            <path d="M8 12.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4.2-2.2a6 6 0 018.4 0l1.1-1.1a7.5 7.5 0 00-10.6 0l1.1 1.1zm-2.5-2.5a9.5 9.5 0 0113.4 0l1.1-1.1a11 11 0 00-15.6 0l1.1 1.1z" />
          </svg>
          <div className="w-3.5 h-2 border border-white/90 rounded-[2px] p-[1px] flex items-center">
            <div className="w-full h-full bg-white rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* Main Widget + Icon Grid */}
      <div className="px-4 pt-2 flex-1">
        {/* 2x2 Widgets Row */}
        <div className="grid grid-cols-2 gap-3.5 mb-3">
          {(['clock', 'calendar'] as IconId[]).map((wid) => {
            const spec = ICON_SPECS.find((s) => s.id === wid)!;
            const active = selectedId === wid;
            return (
              <button
                key={wid}
                type="button"
                onClick={() => onSelectIcon(wid)}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-full aspect-square transition-transform duration-150 group-hover:scale-[1.03] ${
                    active ? 'ring-2 ring-white ring-offset-2 ring-offset-cyan-700/40 rounded-[24px]' : ''
                  }`}
                >
                  <IconArtwork
                    id={wid}
                    shape={shape}
                    clockTime={clockTime}
                    calendarDate={calendarDate}
                    useReferenceCalendarPhoto={!useLiveTime}
                  />
                </div>
                <span className="mt-1 text-[10px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                  {spec.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4x2 Icon Grid */}
        <div className="grid grid-cols-4 gap-x-2.5 gap-y-2.5">
          {gridIcons.map((spec) => {
            const active = selectedId === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => onSelectIcon(spec.id)}
                className="group flex flex-col items-center focus:outline-none"
              >
                <div
                  className={`w-12 h-12 transition-transform duration-150 group-hover:scale-105 ${
                    active ? 'ring-2 ring-white ring-offset-2 ring-offset-cyan-700/40 rounded-[14px]' : ''
                  }`}
                >
                  <IconArtwork id={spec.id} shape={shape} />
                </div>
                <span className="mt-1 text-[10px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] truncate max-w-full">
                  {spec.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Amber Glass Dock + Nav Bar */}
      <div className="px-3 pb-2">
        <div
          className="mx-1 px-3 py-2.5 rounded-[28px] grid grid-cols-4 gap-2.5 items-center shadow-lg"
          style={{
            background: 'linear-gradient(180deg, rgba(162,92,42,0.68) 0%, rgba(122,68,32,0.78) 100%)',
            backdropFilter: 'blur(14px)',
            boxShadow: 'inset 0 1px 0 rgba(255,220,180,0.22), 0 8px 20px rgba(0,0,0,0.28)',
          }}
        >
          {dockIcons.map((spec) => {
            const active = selectedId === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => onSelectIcon(spec.id)}
                className="group flex items-center justify-center focus:outline-none"
                title={spec.label}
              >
                <div
                  className={`w-12 h-12 transition-transform duration-150 group-hover:scale-105 ${
                    active ? 'ring-2 ring-white ring-offset-2 ring-offset-amber-900/50 rounded-[14px]' : ''
                  }`}
                >
                  <IconArtwork id={spec.id} shape={shape} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 3-Button Android Navigation Bar */}
        <div className="mt-2 px-10 flex items-center justify-between text-white/75">
          <div className="w-2.5 h-2.5 border-[1.5px] border-white/75 rounded-[2px]" />
          <div className="w-3 h-3 border-[1.5px] border-white/75 rounded-full" />
          <svg className="w-3 h-3 fill-none stroke-white/75" strokeWidth="1.8" viewBox="0 0 16 16">
            <path d="M11 3L5 8l6 5V3z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderReferenceImage = () => (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <img
        src="/assets/aistudio/Screenshot_20261118_133354_Google_Play_Store_8d440d0e.jpg"
        alt="Original Reference Icon Pack"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center scale-[1.39]"
        style={{ transformOrigin: '50% 51%' }}
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Device Chassis */}
      <div className="relative w-[300px] sm:w-[318px] aspect-[9/19.2] rounded-[42px] p-[9px] bg-slate-900 shadow-2xl border border-slate-700/80">
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-slate-950">
          {viewMode === 'live' && renderInteractiveScreen()}
          {viewMode === 'reference' && renderReferenceImage()}
          {viewMode === 'compare' && (
            <div className="relative w-full h-full">
              {renderInteractiveScreen()}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                {renderReferenceImage()}
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                aria-label="Compare reference and live render"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
              />
            </div>
          )}
        </div>
      </div>

      {viewMode === 'compare' && (
        <div className="mt-3 flex items-center justify-between w-[300px] text-xs text-slate-500">
          <span>Left: Original Reference</span>
          <span aria-hidden="true">·</span>
          <span>Right: Live Render</span>
        </div>
      )}
    </div>
  );
};
