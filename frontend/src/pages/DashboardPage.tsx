import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { captionApi } from '../api/caption';
import { CollectionsToolbar } from '../components/capgen/CollectionsToolbar';
import { Dropzone } from '../components/capgen/Dropzone';
import { Footer } from '../components/capgen/Footer';
import { GenerationModal } from '../components/capgen/GenerationModal';
import { Header } from '../components/capgen/Header';
import { StatCard } from '../components/capgen/StatCard';
import { VibeCard } from '../components/capgen/VibeCard';
import {
  LANGUAGE_OPTIONS,
  LENGTH_OPTIONS,
  MOCK_DASHBOARD_STATS,
  TONE_OPTIONS,
} from '../data/dashboard';
import { useAuth } from '../hooks/useAuth';
import type { CaptionResponse } from '../types';

export function DashboardPage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [language, setLanguage] = useState('English (US)');
  const [tone, setTone] = useState('Default');
  const [length, setLength] = useState('Default');

  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<CaptionResponse | null>(null);
  const [favoriteNetwork, setFavoriteNetwork] = useState<string>('—');

  const [collections, setCollections] = useState<CaptionResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!isAuthenticated) return;
    captionApi
      .getHistory(0, 50)
      .then((items) => setCollections(items))
      .catch(() => {});
  }, [isAuthenticated]);

  const creditsLeft = user?.credits ?? MOCK_DASHBOARD_STATS.creditsLeft;

  const statsCells = [
    {
      label: 'CREDITS LEFT',
      value: creditsLeft,
      note: MOCK_DASHBOARD_STATS.creditsNote,
      accentValue: true,
      progressPercent: (creditsLeft / MOCK_DASHBOARD_STATS.creditsMax) * 100,
    },
    {
      label: 'GENERATIONS THIS MONTH',
      value: collections.length,
      note: collections.length === 0 ? MOCK_DASHBOARD_STATS.generationsNote : 'Ready to copy',
    },
    {
      label: 'FAVORITE NETWORK',
      value: favoriteNetwork,
      note:
        favoriteNetwork === '—'
          ? MOCK_DASHBOARD_STATS.favoriteNetworkNote
          : 'Most copied this session',
    },
    {
      label: 'PLAN',
      value: MOCK_DASHBOARD_STATS.plan,
      note: MOCK_DASHBOARD_STATS.planNote,
    },
  ];

  const handleFileSelected = (file: File, url: string) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(url);
    setGenError(null);
  };

  const handleClearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName(null);
    setGenError(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile || isGenerating) return;
    setIsGenerating(true);
    setGenError(null);
    setActiveResult(null);
    setModalOpen(true);

    try {
      const result = await captionApi.uploadImage(selectedFile, {
        language,
        tone,
        length,
      });
      setActiveResult(result);
      setCollections((prev) => [result, ...prev]);
      await refreshUser();
    } catch (err: unknown) {
      setModalOpen(false);
      const detail =
        (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      setGenError(
        typeof detail === 'string' && detail
          ? detail
          : 'Failed to generate captions. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await captionApi.deleteCaption(id);
      setCollections((prev) => prev.filter((item) => item.id !== id));
      if (activeResult?.id === id) {
        setActiveResult(null);
        setModalOpen(false);
      }
    } catch {
      // ignore delete errors in UI
    }
  };

  const filteredCollections = collections
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inBase = item.caption_text.toLowerCase().includes(q);
      const inPlatforms = item.platform_captions
        ? Object.values(item.platform_captions).some((c) => c.toLowerCase().includes(q))
        : false;
      return inBase || inPlatforms;
    })
    .sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });

  if (isLoading) {
    return (
      <div className="bg-ink text-muted flex min-h-screen items-center justify-center font-mono text-xs tracking-[0.14em] uppercase">
        Loading studio…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header variant="dashboard" credits={creditsLeft} />

      <main className="overflow-x-hidden pb-16">
        {/* Hero */}
        <section className="pt-4 pb-6 md:pt-5">
          <div className="container">
            <div className="text-muted mb-2.5 font-mono text-[10.5px] tracking-[0.16em] uppercase">
              01. DROP AN IMAGE · 02. PICK YOUR VIBE · 03. GO
            </div>

            <h1
              className="font-instrument-serif text-paper m-0 max-w-[920px] leading-[0.94] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(36px, 4.9vw, 66px)' }}
            >
              Turn any photo into{' '}
              <span className="text-lime italic">eight perfect</span> captions
              <span className="text-lime">.</span>
            </h1>

            <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <p className="text-paper-dim m-0 max-w-[540px] text-[14px] leading-[1.55]">
                One upload. One click. Captions tuned for Instagram, TikTok, Facebook, X, Threads,
                WhatsApp, Snapchat &amp; LinkedIn, ready to copy.
              </p>
              <div className="font-mono text-[10.5px] tracking-[0.14em] whitespace-nowrap uppercase">
                <span className="text-muted">THIS MONTH · </span>
                <span className="text-paper font-medium">
                  {collections.length} GENERATIONS
                </span>
              </div>
            </div>

            {genError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-[#5a2323] bg-[#2a1212] px-4 py-3 text-[13px] text-[#ff8a8a]"
              >
                {genError}
              </div>
            )}

            {/* Studio Grid: Dropzone + Vibe Card */}
            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.28fr_0.82fr]">
              <Dropzone
                previewUrl={previewUrl}
                fileName={fileName}
                onFileSelected={handleFileSelected}
                onClear={handleClearPhoto}
              />

              <VibeCard
                credits={creditsLeft}
                hasPhoto={Boolean(previewUrl)}
                isGenerating={isGenerating}
                language={language}
                tone={tone}
                length={length}
                languages={LANGUAGE_OPTIONS}
                tones={TONE_OPTIONS}
                lengths={LENGTH_OPTIONS}
                onLanguageChange={setLanguage}
                onToneChange={setTone}
                onLengthChange={setLength}
                onGenerate={handleGenerate}
              />
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="py-6">
          <div className="container">
            <StatCard cells={statsCells} />
          </div>
        </section>

        {/* Archive / Collections */}
        <section className="pt-8 pb-6">
          <div className="container">
            <CollectionsToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              viewMode={viewMode}
              onViewChange={setViewMode}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              totalCount={filteredCollections.length}
            />

            {filteredCollections.length === 0 ? (
              <div className="border-line bg-ink-2/35 text-paper-dim mt-5 flex min-h-[124px] items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center text-[13.5px]">
                No generations yet. Drop a photo above to get your first 8 captions.
              </div>
            ) : (
              <div
                className={`mt-5 grid gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredCollections.map((item) => (
                  <div
                    key={item.id}
                    className="bg-ink-2 border-line flex flex-col justify-between rounded-2xl border p-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.caption_text}
                          className="border-line h-16 w-16 shrink-0 rounded-xl border object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-lime font-mono text-[10px] tracking-[0.12em]">
                          {(item.language || 'English (US)').toUpperCase()} ·{' '}
                          {(item.tone || 'Default').toUpperCase()}
                        </div>
                        <p className="text-paper mt-1 mb-0 line-clamp-2 text-[13.5px] leading-snug">
                          {item.platform_captions?.instagram || item.caption_text}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCollection(item.id)}
                        aria-label="Delete generation"
                        className="text-muted hover:text-[#ff8a8a] cursor-pointer border-0 bg-transparent p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="border-line mt-3 flex items-center justify-between border-t pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveResult(item);
                          setModalOpen(true);
                        }}
                        className="text-lime cursor-pointer border-0 bg-transparent p-0 font-mono text-[11px] hover:underline"
                      >
                        View all 8 captions →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const txt = item.platform_captions?.instagram || item.caption_text;
                          navigator.clipboard?.writeText(txt).catch(() => {});
                          setFavoriteNetwork('Instagram');
                        }}
                        className="text-paper-dim hover:text-paper cursor-pointer border-0 bg-transparent p-0 font-mono text-[11px]"
                      >
                        Copy IG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <GenerationModal
        open={modalOpen}
        isGenerating={isGenerating}
        imageUrl={activeResult?.image_url || previewUrl}
        fileName={fileName}
        language={language}
        tone={tone}
        length={length}
        result={activeResult}
        onClose={() => setModalOpen(false)}
        onDelete={handleDeleteCollection}
        onCopyNetwork={(name) => setFavoriteNetwork(name)}
      />
    </div>
  );
}
