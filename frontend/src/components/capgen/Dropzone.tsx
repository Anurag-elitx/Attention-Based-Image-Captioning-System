import { useCallback, useEffect, useRef, useState } from 'react';

interface DropzoneProps {
  previewUrl: string | null;
  fileName: string | null;
  onFileSelected: (file: File, previewUrl: string) => void;
  onClear: () => void;
}

export function Dropzone({ previewUrl, fileName, onFileSelected, onClear }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      onFileSelected(file, url);
    },
    [onFileSelected]
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
      onClick={() => {
        if (!previewUrl) inputRef.current?.click();
      }}
      role={!previewUrl ? 'button' : undefined}
      tabIndex={!previewUrl ? 0 : undefined}
      onKeyDown={(e) => {
        if (!previewUrl && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-label="Upload photo dropzone"
      className={`relative flex min-h-[324px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-[22px] border border-dashed p-6 sm:p-8 transition-all duration-200 ${
        !previewUrl ? 'cursor-pointer' : ''
      } ${
        isDragging
          ? 'border-lime bg-lime/5'
          : 'border-[#2c3322] bg-ink-2/90 hover:border-[#3e4b2c]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        className="hidden"
      />

      {/* Four corner bracket marks */}
      <span
        aria-hidden="true"
        className="border-[#3b4234] pointer-events-none absolute top-3.5 left-3.5 h-3.5 w-3.5 border-t border-l"
      />
      <span
        aria-hidden="true"
        className="border-[#3b4234] pointer-events-none absolute top-3.5 right-3.5 h-3.5 w-3.5 border-t border-r"
      />
      <span
        aria-hidden="true"
        className="border-[#3b4234] pointer-events-none absolute bottom-3.5 left-3.5 h-3.5 w-3.5 border-b border-l"
      />
      <span
        aria-hidden="true"
        className="border-[#3b4234] pointer-events-none absolute right-3.5 bottom-3.5 h-3.5 w-3.5 border-r border-b"
      />

      {previewUrl ? (
        <div className="relative flex w-full flex-col items-center gap-3">
          <div className="border-line relative max-h-[280px] overflow-hidden rounded-2xl border bg-ink">
            <img
              src={previewUrl}
              alt={fileName || 'Selected preview'}
              className="max-h-[270px] w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-paper-dim max-w-[260px] truncate font-mono text-[11px]">
              {fileName}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="border-line-2 text-paper-dim hover:text-paper cursor-pointer rounded-full border bg-ink-3 px-3 py-1 font-mono text-[11px] transition-colors"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          {/* Circular upload icon */}
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-[#323e21] bg-[#1a2013] text-lime">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 17V5" />
              <path d="m7 10 5-5 5 5" />
              <path d="M5 20h14" />
            </svg>
          </div>

          <h3 className="font-instrument-serif text-paper m-0 text-[30px] leading-tight tracking-[-0.01em]">
            Drop a photo <span className="text-lime italic">here</span>
          </h3>

          <p className="text-paper-dim mt-2 mb-0 text-[13px]">
            ...or{' '}
            <span className="text-paper underline decoration-line-2 underline-offset-4">
              browse
            </span>{' '}
            your files. JPG, PNG · up to 10 MB.
          </p>

          <div className="text-muted mt-5 flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.12em]">
            <span>OR PRESS</span>
            <kbd className="border-line-2 bg-ink-3 text-paper-dim rounded border px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl
            </kbd>
            <kbd className="border-line-2 bg-ink-3 text-paper-dim rounded border px-1.5 py-0.5 font-mono text-[10px]">
              V
            </kbd>
            <span>TO PASTE</span>
          </div>
        </div>
      )}
    </div>
  );
}
