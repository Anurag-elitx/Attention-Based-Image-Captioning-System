import { useEffect, useState } from 'react';
import { Check, Copy, Download, Trash2, X } from 'lucide-react';
import { resolveAssetUrl } from '../../api/client';
import { NETWORKS, type NetworkId } from '../../config/site';
import type { CaptionResponse } from '../../types';
import { NetIcon } from './NetIcon';

const NETWORK_CHAR_LIMITS: Record<NetworkId, number> = {
  instagram: 2200,
  facebook: 63206,
  tiktok: 2200,
  twitter: 280,
  snapchat: 250,
  linkedin: 3000,
  threads: 500,
  whatsapp: 520,
};

function countTagsAndEmojis(text: string): { tags: number; emojis: number } {
  const tags = (text.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  const emojis = (
    text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []
  ).length;
  return { tags, emojis };
}

function extractTagChips(result: CaptionResponse | null): string[] {
  if (!result) return [];
  const allText = result.platform_captions
    ? Object.values(result.platform_captions).join(' ')
    : result.caption_text;
  const matches = allText.match(/#([\p{L}\p{N}_-]+)/gu) || [];
  const unique = Array.from(new Set(matches.map((m) => m.slice(1).toUpperCase())));
  return unique.slice(0, 5);
}

interface GenerationModalProps {
  open: boolean;
  isGenerating: boolean;
  imageUrl: string | null;
  fileName: string | null;
  language: string;
  tone: string;
  length: string;
  result: CaptionResponse | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onCopyNetwork?: (networkName: string) => void;
}

export function GenerationModal({
  open,
  isGenerating,
  imageUrl,
  fileName,
  language,
  tone,
  length,
  result,
  onClose,
  onDelete,
  onCopyNetwork,
}: GenerationModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGenerating) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isGenerating, onClose]);

  if (!open) return null;

  const displayImage = resolveAssetUrl(imageUrl || result?.image_url);
  const displayLang = result?.language || language;
  const displayTone = result?.tone || tone;
  const displayLength = result?.length || length;
  const titleText =
    result?.title ||
    (fileName ? fileName.replace(/\.[^/.]+$/, '') : 'Uploaded photo');
  const tagChips = extractTagChips(result);

  const handleCopy = (netId: NetworkId, netName: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(netId);
    onCopyNetwork?.(netName);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  const handleExportAll = () => {
    if (!result) return;
    const payload = {
      base_caption: result.caption_text,
      language: displayLang,
      tone: displayTone,
      length: displayLength,
      captions: result.platform_captions ?? {},
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `captions-${result.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"
      onClick={() => {
        if (!isGenerating) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isGenerating ? 'Analyzing image' : '8 Captions ready'}
    >
      <div
        className="bg-ink-2 border-line-2 flex max-h-[92vh] w-full max-w-[1060px] flex-col overflow-hidden rounded-3xl border shadow-[0_32px_90px_rgba(0,0,0,0.75)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="border-line flex items-center justify-between gap-3 border-b px-5 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            {isGenerating ? (
              <span className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">
                ANALYZING IMAGE...
              </span>
            ) : (
              <>
                <span className="text-paper font-mono text-[11px] tracking-[0.14em] uppercase">
                  8 CAPTIONS · READY
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3a4a1c] bg-[#161c0d] px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  <span>1 CREDIT USED</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isGenerating && result && (
              <>
                <button
                  type="button"
                  onClick={handleExportAll}
                  className="border-line-2 bg-ink-3 text-paper-dim hover:text-paper inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors"
                >
                  <Download size={12} />
                  <span>Export all</span>
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(result.id)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#4a2222] bg-[#221212] px-3 py-1.5 text-[11.5px] font-medium text-[#ff8a8a] transition-colors hover:border-[#6e3232]"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              aria-label="Close modal"
              className="border-line bg-ink-3 text-muted hover:text-paper grid h-8 w-8 cursor-pointer place-items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Split Body */}
        <div className="grid flex-1 grid-cols-1 divide-y divide-line overflow-y-auto lg:grid-cols-[310px_1fr] lg:divide-x lg:divide-y-0">
          {/* Left Column: Image + Meta */}
          <div className="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="border-line relative aspect-[4/5] w-full overflow-hidden rounded-2xl border bg-[#111]">
                {displayImage && (
                  <img
                    src={displayImage}
                    alt={titleText}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className={`h-full w-full object-cover transition-all duration-500 ${
                      isGenerating ? 'scale-[1.02] brightness-90' : ''
                    }`}
                  />
                )}

                {isGenerating && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(200,255,77,0.12)_50%,transparent_100%)] animate-pulse"
                    />
                    <div className="absolute inset-x-3 bottom-3 flex justify-center">
                      <div className="border-line-2 inline-flex items-center gap-2 rounded-full border bg-black/80 px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.12em] text-paper backdrop-blur-md">
                        <span className="text-lime inline-block animate-spin">✳</span>
                        <span>READING LIGHT, SUBJECT, MOOD...</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <h3 className="font-instrument-serif text-paper mt-4 mb-0 text-[26px] leading-[1.1]">
                {titleText}
              </h3>

              {!isGenerating && tagChips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tagChips.map((tag) => (
                    <span
                      key={tag}
                      className="border-line bg-ink-3 text-paper-dim rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] tracking-[0.1em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-line mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4">
              <div>
                <div className="text-muted font-mono text-[9.5px] tracking-[0.14em]">TONE</div>
                <div className="text-paper mt-0.5 text-[12.5px] font-medium">{displayTone}</div>
              </div>
              <div>
                <div className="text-muted font-mono text-[9.5px] tracking-[0.14em]">LENGTH</div>
                <div className="text-paper mt-0.5 text-[12.5px] font-medium">{displayLength}</div>
              </div>
              <div>
                <div className="text-muted font-mono text-[9.5px] tracking-[0.14em]">LANGUAGE</div>
                <div className="text-paper mt-0.5 text-[12.5px] font-medium">{displayLang}</div>
              </div>
              <div>
                <div className="text-muted font-mono text-[9.5px] tracking-[0.14em]">GENERATED</div>
                <div className="text-paper mt-0.5 text-[12.5px] font-medium">Just now</div>
              </div>
            </div>
          </div>

          {/* Right Column: 8 Network Cards (Skeleton during load, Captions when ready) */}
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {NETWORKS.map((net) => {
                const isDarkText = net.ink === '#0A0A0B';
                const cardBg =
                  net.id === 'twitter' ? '#040406' : net.id === 'threads' ? '#0c0c0f' : net.bg;
                const text = result?.platform_captions?.[net.id] ?? result?.caption_text ?? '';
                const maxChars = NETWORK_CHAR_LIMITS[net.id];
                const { tags, emojis } = countTagsAndEmojis(text);
                const isCopied = copiedId === net.id;

                return (
                  <div
                    key={net.id}
                    className={`relative flex min-h-[158px] flex-col justify-between overflow-hidden rounded-2xl p-4 ${
                      net.id === 'twitter' || net.id === 'threads'
                        ? 'border border-line-2'
                        : ''
                    }`}
                    style={{ background: cardBg, color: net.ink }}
                  >
                    {/* Top row */}
                    <div className="relative z-2 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-lg ${
                            isDarkText ? 'bg-black/10' : 'bg-white/15'
                          }`}
                        >
                          <NetIcon id={net.id} size={14} />
                        </span>
                        <div>
                          <div className="text-[12.5px] font-semibold leading-tight">
                            {net.name}
                          </div>
                          {!isGenerating && (
                            <div className="font-mono text-[9.5px] tracking-[0.08em] opacity-70">
                              {text.length} / {maxChars} CHARS
                            </div>
                          )}
                        </div>
                      </div>

                      {isGenerating && (
                        <span
                          className={`h-5 w-5 animate-pulse rounded-md ${
                            isDarkText ? 'bg-black/15' : 'bg-white/20'
                          }`}
                        />
                      )}
                    </div>

                    {/* Body / Skeleton */}
                    {isGenerating ? (
                      <div className="relative z-2 my-3 space-y-2">
                        <div
                          className={`h-2.5 w-full animate-pulse rounded-full ${
                            isDarkText ? 'bg-black/15' : 'bg-white/20'
                          }`}
                        />
                        <div
                          className={`h-2.5 w-11/12 animate-pulse rounded-full ${
                            isDarkText ? 'bg-black/15' : 'bg-white/20'
                          }`}
                        />
                        <div
                          className={`h-2.5 w-7/12 animate-pulse rounded-full ${
                            isDarkText ? 'bg-black/12' : 'bg-white/15'
                          }`}
                        />
                      </div>
                    ) : (
                      <p className="relative z-2 my-3 whitespace-pre-line text-[12.5px] leading-[1.48]">
                        {text}
                      </p>
                    )}

                    {/* Footer */}
                    {isGenerating ? (
                      <div
                        className={`relative z-2 h-2 w-16 animate-pulse rounded-full ${
                          isDarkText ? 'bg-black/15' : 'bg-white/20'
                        }`}
                      />
                    ) : (
                      <div className="relative z-2 flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] opacity-75">
                          {tags} {tags === 1 ? 'tag' : 'tags'} · {emojis} emoji
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(net.id, net.name, text)}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-0 px-2.5 py-1 text-[11px] font-medium transition-colors ${
                            isDarkText
                              ? 'bg-black/12 hover:bg-black/20 text-[#0A0A0B]'
                              : 'bg-black/25 hover:bg-black/35 text-white'
                          }`}
                        >
                          {isCopied ? <Check size={11} /> : <Copy size={11} />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {/* Watermark icon */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-3 -bottom-5 opacity-12"
                    >
                      <NetIcon id={net.id} size={96} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
