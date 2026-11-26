import { useEffect, useRef, useState } from 'react';
import { DASHBOARD_NETWORK_ORDER } from '../../config/site';
import type { SelectOption } from '../../data/dashboard';
import { ArrowRightIcon } from './NetIcon';

interface CustomSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
}

function VibeSelect({ label, value, options, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const currentLabel = options.find((o) => o.value === value)?.label ?? value;

  return (
    <div ref={ref} className="relative">
      <div className="text-muted mb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase">
        {label}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`bg-ink-3 text-paper flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2.75 text-left text-[13.5px] transition-colors duration-150 ${
          open ? 'border-lime/70' : 'border-line hover:border-line-2'
        }`}
      >
        <span className="truncate">{currentLabel}</span>
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="bg-ink-2 border-line-2 absolute right-0 left-0 z-40 mt-1.5 max-h-56 overflow-y-auto rounded-xl border p-1 shadow-[0_20px_40px_rgba(0,0,0,0.65)]"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg border-0 px-3 py-2 text-left text-[13px] transition-colors ${
                    active
                      ? 'bg-lime/15 text-lime font-medium'
                      : 'text-paper-dim hover:text-paper bg-transparent hover:bg-white/4'
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <span className="text-lime text-xs">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface VibeCardProps {
  credits: number;
  hasPhoto: boolean;
  isGenerating?: boolean;
  language: string;
  tone: string;
  length: string;
  languages: SelectOption[];
  tones: SelectOption[];
  lengths: SelectOption[];
  onLanguageChange: (val: string) => void;
  onToneChange: (val: string) => void;
  onLengthChange: (val: string) => void;
  onGenerate?: () => void;
}

export function VibeCard({
  credits,
  hasPhoto,
  isGenerating = false,
  language,
  tone,
  length,
  languages,
  tones,
  lengths,
  onLanguageChange,
  onToneChange,
  onLengthChange,
  onGenerate,
}: VibeCardProps) {
  const canGenerate = hasPhoto && !isGenerating && credits > 0;
  const ctaText = isGenerating
    ? 'Generating 8 captions…'
    : !hasPhoto
      ? 'Drop a photo first'
      : credits < 1
        ? 'Out of credits'
        : 'Generate 8 captions';
  return (
    <div className="bg-ink-2 border-line flex min-w-0 flex-col justify-between rounded-[22px] border p-5 sm:p-6">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-instrument-serif text-paper m-0 text-[26px] leading-none">
            Your <span className="text-lime italic">vibe</span>
          </h2>
          <span className="bg-lime text-lime-ink rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em]">
            {credits} FREE CREDITS · ON US
          </span>
        </div>

        <div className="space-y-3">
          <VibeSelect
            label="LANGUAGE"
            value={language}
            options={languages}
            onChange={onLanguageChange}
          />
          <VibeSelect
            label="TONE"
            value={tone}
            options={tones}
            onChange={onToneChange}
          />
          <VibeSelect
            label="LENGTH"
            value={length}
            options={lengths}
            onChange={onLengthChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={!canGenerate}
          onClick={onGenerate}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] leading-none font-medium transition-all duration-150 ${
            canGenerate
              ? 'bg-lime text-lime-ink cursor-pointer hover:-translate-y-px'
              : 'cursor-not-allowed bg-[#6f8f2a] text-[#0a0a0b]/90'
          }`}
        >
          <span>{ctaText}</span>
          {!isGenerating && <ArrowRightIcon size={14} />}
        </button>

        <div className="text-muted mt-4 text-center font-mono text-[9.5px] leading-[1.8] tracking-[0.14em]">
          {DASHBOARD_NETWORK_ORDER.join(' · ')}
        </div>
      </div>
    </div>
  );
}
