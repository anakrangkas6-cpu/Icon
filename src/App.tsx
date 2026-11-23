import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, FolderArchive, Layers, Smartphone } from 'lucide-react';
import { ICON_SPECS, IconId, IconShape } from './data/icons';
import { IconArtwork } from './components/IconArtwork';
import { PhonePreview } from './components/PhonePreview';
import { CodeInspector } from './components/CodeInspector';
import {
  downloadGitHubAndroidRepoBundle,
  downloadGoodLockPngBundle,
  downloadSingleIconPng,
} from './lib/canvasExporter';

type CategoryFilter = 'all' | 'widget' | 'grid' | 'dock';

export default function App() {
  const [selectedId, setSelectedId] = useState<IconId>('clock');
  const [shape, setShape] = useState<IconShape>('squircle');
  const [viewMode, setViewMode] = useState<'live' | 'reference' | 'compare'>('live');
  const [useLiveTime, setUseLiveTime] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [busyAction, setBusyAction] = useState<'apk' | 'png' | 'single' | null>(null);
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const selectedSpec = useMemo(
    () => ICON_SPECS.find((item) => item.id === selectedId) ?? ICON_SPECS[0],
    [selectedId],
  );

  const filteredIcons = useMemo(() => {
    if (categoryFilter === 'all') return ICON_SPECS;
    return ICON_SPECS.filter((item) => item.category === categoryFilter);
  }, [categoryFilter]);

  const handleDownloadApkRepo = async () => {
    try {
      setBusyAction('apk');
      await downloadGitHubAndroidRepoBundle(shape);
      setExportNotice('ZIP proyek Android + GitHub Actions (.github/workflows/build-apk.yml) berhasil diunduh.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownloadGoodLockPngs = async () => {
    try {
      setBusyAction('png');
      await downloadGoodLockPngBundle(shape);
      setExportNotice('Paket 14 ikon PNG 512x512 + Wallpaper Sunset berhasil diunduh.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownloadSingle = async (id: IconId) => {
    try {
      setBusyAction('single');
      await downloadSingleIconPng(id, shape);
    } finally {
      setBusyAction(null);
    }
  };

  const handleCopyComponent = async (componentInfo: string) => {
    await navigator.clipboard.writeText(componentInfo);
    setCopiedComponent(componentInfo);
    setTimeout(() => setCopiedComponent(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-900">
      {/* Top Bar Contract: Brand — 4 nav links — 1 primary CTA */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#preview"
            className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Sunlit OneUI
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#preview" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Preview
            </a>
            <a href="#icons" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Icon Pack
            </a>
            <a href="#goodlock" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Good Lock
            </a>
            <a href="#github-apk" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              GitHub APK
            </a>
          </nav>

          <button
            type="button"
            onClick={handleDownloadApkRepo}
            disabled={busyAction !== null}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1D6CF0] rounded-lg hover:bg-[#1759C9] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{busyAction === 'apk' ? 'Menyiapkan ZIP...' : 'Download APK Repo'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-16">
        {/* Section 1: Side-by-Side Phone Simulator + Icon Inspector */}
        <section id="preview" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Interactive One UI Device & Comparison */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[340px] mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
                {(
                  [
                    { id: 'live', label: 'Live' },
                    { id: 'compare', label: 'Bandingkan' },
                    { id: 'reference', label: 'Referensi' },
                  ] as { id: 'live' | 'reference' | 'compare'; label: string }[]
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      viewMode === mode.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setUseLiveTime((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {useLiveTime ? 'Jam: Live' : 'Jam: 09:35'}
              </button>
            </div>

            <PhonePreview
              selectedId={selectedId}
              onSelectIcon={setSelectedId}
              shape={shape}
              viewMode={viewMode}
              useLiveTime={useLiveTime}
            />
          </div>

          {/* Right: Overview, Exports & Active Icon Inspector */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>14 Ikon 512px</span>
                <span aria-hidden="true">·</span>
                <span>Samsung Good Lock Theme Park</span>
                <span aria-hidden="true">·</span>
                <span>GitHub Actions APK</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Icon Pack Samsung One UI dengan Akurasi Penuh &amp; Siap Build APK di GitHub
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Seluruh 14 ikon dan widget dari gambar referensi (Clock, Calendar, Launcher, Games,
                VideoCall, Docs, Calculator, Settings, Maps, Files, Phone, Messages, Gallery, dan
                Camera) dirender ulang secara presisi, lengkap dengan{' '}
                <code className="font-mono-code text-xs bg-slate-200/70 px-1.5 py-0.5 rounded">
                  appfilter.xml
                </code>{' '}
                untuk Samsung Good Lock Theme Park serta workflow GitHub Actions untuk menghasilkan
                file APK siap pasang.
              </p>

              {/* Primary Export Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadApkRepo}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D6CF0] rounded-lg hover:bg-[#1759C9] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FolderArchive className="w-4 h-4" />
                  <span>
                    {busyAction === 'apk'
                      ? 'Mengompres Proyek APK...'
                      : 'Download GitHub + Android APK Repo (.zip)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadGoodLockPngs}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {busyAction === 'png'
                      ? 'Merender 512px PNG...'
                      : 'Download PNG Good Lock (.zip)'}
                  </span>
                </button>
              </div>

              {exportNotice && (
                <p className="text-xs font-medium text-emerald-700 pt-1">{exportNotice}</p>
              )}
            </div>

            {/* Shape Customizer Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm font-medium text-slate-700">Bentuk Ikon Theme Park</div>
              <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
                {(
                  [
                    { id: 'squircle', label: 'One UI Squircle' },
                    { id: 'rounded', label: 'Rounded' },
                    { id: 'circle', label: 'Circle' },
                    { id: 'teardrop', label: 'Teardrop' },
                  ] as { id: IconShape; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setShape(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      shape === item.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Icon Inspector (Single-Elevation Card) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-28 h-28 shrink-0">
                  <IconArtwork id={selectedSpec.id} shape={shape} />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-display font-bold text-slate-900">
                        {selectedSpec.label}
                      </h2>
                      <div className="text-xs font-mono-code text-slate-500">
                        {selectedSpec.drawableName}.png · 512 × 512 px
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(selectedSpec.id)}
                      disabled={busyAction !== null}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh PNG</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{selectedSpec.description}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-500">Palet:</span>
                    {selectedSpec.palette.map((hex) => (
                      <span
                        key={hex}
                        className="inline-flex items-center gap-1.5 text-xs font-mono-code text-slate-600"
                      >
                        <span
                          className="w-3 h-3 rounded-xs border border-slate-300"
                          style={{ backgroundColor: hex }}
                        />
                        {hex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Samsung & Android Package Mappings Table */}
              <div className="border-t border-slate-200 pt-4">
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  Target Aplikasi di appfilter.xml ({selectedSpec.mappings.length} mapping)
                </div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {selectedSpec.mappings.map((mapping) => (
                    <div
                      key={mapping.componentInfo}
                      className="px-3 py-2 flex items-center justify-between gap-3 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-800">{mapping.appName}</div>
                        <div className="text-[11px] font-mono-code text-slate-500 truncate">
                          {mapping.componentInfo}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyComponent(mapping.componentInfo)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
                        title="Salin ComponentInfo"
                      >
                        {copiedComponent === mapping.componentInfo ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Complete 14-Icon Pack Catalog */}
        <section id="icons" className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Koleksi Lengkap 14 Ikon Referensi
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Klik ikon mana saja untuk melihat detail warna, mapping Samsung One UI, dan unduhan PNG 512px.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg">
              {(
                [
                  { id: 'all', label: 'Semua (14)' },
                  { id: 'widget', label: 'Widget (2)' },
                  { id: 'grid', label: 'Grid Utama (8)' },
                  { id: 'dock', label: 'Dock (4)' },
                ] as { id: CategoryFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {filteredIcons.map((spec) => {
              const isSelected = selectedId === spec.id;
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => setSelectedId(spec.id)}
                  className={`group p-4 bg-white rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#1D6CF0] ring-2 ring-[#1D6CF0]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto transition-transform duration-150 group-hover:scale-105">
                    <IconArtwork id={spec.id} shape={shape} />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold text-slate-900 truncate">{spec.label}</div>
                    <div className="text-[11px] font-mono-code text-slate-500 truncate">
                      {spec.drawableName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Samsung Good Lock Theme Park Guide */}
        <section id="goodlock" className="pt-8 border-t border-slate-200 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-display font-bold text-slate-900">
              Penerapan di Samsung Good Lock (Theme Park)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Dua cara resmi untuk menerapkan ikon pack ini di HP Samsung Galaxy (One UI 5, 6, 7+).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1D6CF0]/10 text-[#1D6CF0] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-900">
                    01. Via APK Icon Pack (Otomatis Semua Ikon)
                  </h3>
                  <div className="text-xs text-slate-500">Direkomendasikan · Pakai hasil build GitHub Actions</div>
                </div>
              </div>

              <ol className="space-y-2.5 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Install <code className="font-mono-code text-xs bg-slate-100 px-1.5 py-0.5 rounded">SunlitOneUI-IconPack-release.apk</code> hasil build GitHub Actions di Samsung Galaxy Anda.
                </li>
                <li>
                  Buka aplikasi <strong>Good Lock</strong> lalu pilih modul <strong>Theme Park</strong>.
                </li>
                <li>
                  Masuk ke tab <strong>Icon</strong> di bagian bawah, lalu tekan <strong>Create New</strong>.
                </li>
                <li>
                  Tekan tombol <strong>Iconpack</strong> (ikon kotak biru) dan pilih <strong>Sunlit OneUI</strong>.
                </li>
                <li>
                  Tekan ikon <strong>Save</strong> di pojok kanan atas, beri nama tema, lalu tekan <strong>Apply</strong>.
                </li>
              </ol>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-slate-900">
                    02. Via Import PNG Langsung (Tanpa APK)
                  </h3>
                  <div className="text-xs text-slate-500">Cepat · Cocok jika ingin ganti ikon satuan</div>
                </div>
              </div>

              <ol className="space-y-2.5 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Klik <strong>Download PNG Good Lock (.zip)</strong> di atas lalu ekstrak di HP Samsung Anda.
                </li>
                <li>
                  Buka <strong>Good Lock</strong> → <strong>Theme Park</strong> → tab <strong>Icon</strong> → <strong>Create New</strong>.
                </li>
                <li>
                  Tekan menu titik tiga di kanan atas → <strong>Change icons</strong>.
                </li>
                <li>
                  Pilih aplikasi target (misal Camera, Gallery, Clock) → <strong>Gallery</strong> → pilih file PNG 512px yang sesuai.
                </li>
                <li>
                  Atur juga wallpaper menggunakan <code className="font-mono-code text-xs bg-slate-100 px-1.5 py-0.5 rounded">wallpaper_sunset.jpg</code> di dalam ZIP.
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 4: GitHub Actions APK Build & Source Inspector */}
        <section id="github-apk" className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Build APK Otomatis via GitHub Actions
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Proyek Android Kotlin (<code className="font-mono-code text-xs">android-iconpack/</code>) dan workflow{' '}
                <code className="font-mono-code text-xs">.github/workflows/build-apk.yml</code> sudah disiapkan. Setiap{' '}
                <code className="font-mono-code text-xs">git push</code> langsung menghasilkan APK bertanda tangan yang siap di-install.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadApkRepo}
              disabled={busyAction !== null}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1D6CF0] rounded-lg hover:bg-[#1759C9] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Download Proyek Siap Push (.zip)</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono-code text-xs overflow-x-auto leading-relaxed">
            <div className="text-slate-400 mb-1">Perintah Git Push ke Repository GitHub Anda:</div>
            <div>git init &amp;&amp; git add . &amp;&amp; git commit -m "Add Sunlit OneUI Icon Pack &amp; GitHub APK CI"</div>
            <div>git branch -M main &amp;&amp; git remote add origin https://github.com/USERNAME/sunlit-oneui-iconpack.git</div>
            <div>git push -u origin main</div>
          </div>

          <CodeInspector />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>Sunlit OneUI Icon Pack Studio · Samsung Good Lock Theme Park &amp; GitHub Actions Ready</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleDownloadGoodLockPngs}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Unduh Paket PNG
            </button>
            <button
              type="button"
              onClick={handleDownloadApkRepo}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Unduh Proyek APK
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
