import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { NETWORKS, siteConfig, type NetworkId } from '../../config/site';

interface AuthSlide {
  netId: NetworkId;
  caption: string;
}

const AUTH_SLIDES: AuthSlide[] = [
  { netId: 'linkedin', caption: 'Embrace moments of pure joy.' },
  { netId: 'tiktok', caption: "POV: You're this dog at the beach! 🐶" },
  { netId: 'instagram', caption: 'Endless summer vibes with this happy pup! ☀️🐾' },
  { netId: 'twitter', caption: 'This dog is living its BEST life. ✨' },
  { netId: 'snapchat', caption: 'Beach zoomies are the BEST zoomies! 🤩🌊' },
];

interface AuthShellProps {
  eyebrow: string;
  headline: string;
  initialSlideIndex?: number;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  quoteAvatar: string;
  topRightPrompt: string;
  topRightLinkLabel: string;
  topRightLinkTo: string;
  children: ReactNode;
}

export function AuthShell({
  eyebrow,
  headline,
  initialSlideIndex = 0,
  quote,
  quoteAuthor,
  quoteRole,
  quoteAvatar,
  topRightPrompt,
  topRightLinkLabel,
  topRightLinkTo,
  children,
}: AuthShellProps) {
  const [slideIdx, setSlideIdx] = useState(initialSlideIndex);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % AUTH_SLIDES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  const activeSlide = AUTH_SLIDES[slideIdx];
  const activeNet = NETWORKS.find((n) => n.id === activeSlide.netId) ?? NETWORKS[0];

  return (
    <div className="auth-shell">
      {/* Left Brand / Preview Column */}
      <aside
        className="border-line relative hidden flex-col justify-between border-r p-8 lg:flex xl:p-11"
        style={{
          background:
            'radial-gradient(640px 440px at 72% 18%, rgba(200, 255, 77, 0.08), transparent 65%), #0c0c0e',
        }}
      >
        <div>
          <Link to="/" className="text-paper inline-flex items-center gap-2.5 no-underline">
            <img
              src={siteConfig.logoSrc}
              alt={siteConfig.name}
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="font-instrument-serif text-[24px] leading-none italic">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className="my-auto max-w-[440px] py-10">
          <div className="text-lime mb-3.5 font-mono text-[10.5px] tracking-[0.16em] uppercase">
            {eyebrow}
          </div>

          <h1
            className="font-instrument-serif text-paper m-0 leading-[0.98] tracking-[-0.02em] italic"
            style={{ fontSize: 'clamp(42px, 3.8vw, 54px)' }}
          >
            {headline}
          </h1>

          {/* Rotating mini caption preview */}
          <div className="bg-ink-2/90 border-line mt-8 flex max-w-[390px] items-center gap-3.5 rounded-2xl border p-3">
            <img
              src="/images/sq/dog-beach-sq.webp"
              alt="Sample photo"
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
            <div
              className="min-w-0 flex-1 rounded-xl px-3.5 py-2.5 transition-colors duration-300"
              style={{ background: activeNet.bg, color: activeNet.ink }}
            >
              <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase opacity-80">
                [ {activeNet.id === 'twitter' ? 'X' : activeNet.name.toUpperCase()} ]
              </div>
              <div className="mt-1 truncate text-[12.5px] font-medium">{activeSlide.caption}</div>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-1.5">
            {AUTH_SLIDES.map((s, idx) => (
              <button
                key={s.netId}
                type="button"
                aria-label={`Preview ${s.netId} caption`}
                onClick={() => setSlideIdx(idx)}
                className={`h-1 cursor-pointer rounded-full border-0 transition-all duration-200 ${
                  idx === slideIdx ? 'bg-lime w-5' : 'bg-line-2 w-1.5 hover:bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-[420px]">
          <p className="font-instrument-serif text-paper-dim m-0 text-[18px] leading-[1.38] italic">
            &ldquo;{quote}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <img
              src={quoteAvatar}
              alt={quoteAuthor}
              className="border-line h-8 w-8 rounded-full border object-cover"
            />
            <div>
              <div className="text-paper text-[12.5px] font-medium">{quoteAuthor}</div>
              <div className="text-muted font-mono text-[9.5px] tracking-[0.14em] uppercase">
                {quoteRole}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Form Column */}
      <main className="auth-form-col justify-between p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="text-paper inline-flex items-center gap-2 no-underline lg:hidden">
            <img src={siteConfig.logoSrc} alt={siteConfig.name} width={22} height={22} />
            <span className="font-instrument-serif text-[22px] italic">{siteConfig.name}</span>
          </Link>

          <div className="text-[12.5px]">
            <span className="text-muted mr-1.5">{topRightPrompt}</span>
            <Link
              to={topRightLinkTo}
              className="text-paper hover:text-lime font-medium underline underline-offset-4 transition-colors"
            >
              {topRightLinkLabel}
            </Link>
          </div>
        </div>

        <div className="mx-auto my-auto w-full max-w-[380px] py-10">{children}</div>

        <div className="h-4" aria-hidden="true" />
      </main>
    </div>
  );
}
