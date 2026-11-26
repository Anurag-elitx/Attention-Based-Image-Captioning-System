import { Link } from 'react-router-dom';
import type { BlogPost } from '../../data/posts';
import { ArrowRightIcon } from './NetIcon';

export function BlogVisual({ type }: { type: BlogPost['visualType'] }) {
  switch (type) {
    case 'robot':
      return (
        <div
          className="relative flex h-full min-h-[240px] w-full flex-col items-center justify-center overflow-hidden p-6"
          style={{
            background:
              'radial-gradient(circle at 30% 25%, rgba(193, 53, 132, 0.16), transparent 60%), linear-gradient(180deg, #131115 0%, #0d0d10 100%)',
          }}
        >
          <div className="border-line-2 bg-ink-2/90 w-full max-w-[270px] rounded-xl border px-4 py-3 shadow-lg">
            <div className="text-muted mb-1.5 flex items-center gap-2 font-mono text-[9.5px] tracking-[0.14em]">
              <span className="inline-block h-3.5 w-3.5 rounded bg-[#C13584]" />
              <span>DRAFT 1 · 4 SECONDS</span>
            </div>
            <div className="text-paper font-mono text-[12px]">
              golden hour, zero edits <span className="bg-[#C13584] inline-block h-3 w-1.5 align-middle" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 font-mono text-[9.5px] tracking-[0.14em]">
            <span className="text-[#C13584]">✓ SOUNDS LIKE YOU</span>
            <span className="text-muted line-through">ROBOT VOICE</span>
          </div>
        </div>
      );
    case 'workflow':
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0e0f12] p-5">
          <div className="flex items-center gap-3">
            <div className="border-line-2 bg-ink-3 flex h-12 w-12 items-center justify-center rounded-xl border text-muted font-mono text-[10px]">
              IMG
            </div>
            <span className="text-muted font-mono text-xs">····</span>
            <div className="bg-lime text-lime-ink flex h-12 w-12 items-center justify-center rounded-xl font-bold shadow-[0_0_24px_rgba(200,255,77,0.3)]">
              ✳
            </div>
            <span className="text-muted font-mono text-xs">····</span>
            <div className="border-line-2 bg-ink-3 flex h-12 w-12 flex-col justify-center gap-1 rounded-xl border px-2">
              <span className="bg-lime h-1 w-6 rounded" />
              <span className="bg-muted/40 h-1 w-7 rounded" />
              <span className="bg-muted/40 h-1 w-5 rounded" />
            </div>
          </div>
          <div className="text-muted mt-4 flex items-center gap-7 font-mono text-[9.5px] tracking-[0.14em]">
            <span>PHOTO</span>
            <span className="text-lime">READS IT</span>
            <span>8 CAPTIONS</span>
          </div>
        </div>
      );
    case 'ideas':
      return (
        <div className="relative flex h-full w-full flex-col justify-between bg-[radial-gradient(circle_at_30%_30%,rgba(193,53,132,0.18),transparent_60%),#101014] p-5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-instrument-serif text-[#C13584]/70 text-[48px] leading-none">
              120
            </span>
            <div className="flex flex-col items-end gap-1.5">
              {['first-coffee energy', 'mirror check', 'golden hour dump', 'unplanned detour'].map(
                (t) => (
                  <span
                    key={t}
                    className="border-line-2 bg-ink-2/90 text-paper-dim rounded-full border px-2.5 py-0.5 font-mono text-[9.5px]"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="text-muted font-mono text-[9.5px] tracking-[0.14em]">
            IDEAS, SORTED BY PHOTO TYPE
          </div>
        </div>
      );
    case 'linkedin':
      return (
        <div className="relative flex h-full w-full flex-col justify-between bg-[radial-gradient(circle_at_70%_70%,rgba(10,102,194,0.16),transparent_60%),#0e1015] p-5">
          <div className="space-y-2">
            <div className="text-muted font-mono text-[10px] tracking-[0.14em]">
              PROFESSIONAL ≠ BORING
            </div>
            <div className="bg-line-2 h-1.5 w-36 rounded-full" />
            <div className="bg-line h-1.5 w-48 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-28 rounded-full bg-[#0A66C2]" />
              <span className="font-mono text-[9.5px] tracking-[0.12em] text-[#4A9EFF]">
                YOUR VOICE
              </span>
            </div>
          </div>
          <div className="self-end rounded-lg border border-[#0A66C2]/30 bg-[#0A66C2]/15 px-2.5 py-1 font-sans text-sm font-bold text-[#0A66C2]/70">
            in
          </div>
        </div>
      );
    case 'facebook':
      return (
        <div className="relative flex h-full w-full flex-col justify-between bg-[#0f1014] p-5">
          <div className="space-y-2">
            <div className="border-line-2 bg-ink-3 text-paper inline-block rounded-xl border px-3 py-1.5 text-[11px]">
              This is so true 😂
            </div>
            <div className="ml-8">
              <span className="border-line-2 bg-ink-2 text-paper-dim inline-block rounded-xl border px-3 py-1.5 text-[11px]">
                tagging @sam right now
              </span>
            </div>
            <div className="inline-flex gap-1 rounded-full bg-[#1877F2] px-2.5 py-1 text-[10px] text-white">
              <span>•••</span>
            </div>
          </div>
          <div className="text-muted font-mono text-[9.5px] tracking-[0.14em]">
            47 COMMENTS · 0 CRICKETS
          </div>
        </div>
      );
    case 'twitter':
      return (
        <div className="relative flex h-full w-full flex-col justify-between bg-[#0f0f12] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-instrument-serif text-paper text-[44px] leading-none">38</div>
              <div className="text-muted mt-1 font-mono text-[9px] tracking-[0.12em]">
                OF 280 · THAT&apos;S PLENTY
              </div>
            </div>
            <div className="font-instrument-serif text-paper-dim text-right text-[20px] leading-tight italic">
              &ldquo;shipped. no notes.&rdquo;
            </div>
          </div>
          <div className="text-muted/30 self-end text-2xl font-bold">𝕏</div>
        </div>
      );
    case 'snap-threads':
      return (
        <div className="relative grid h-full w-full grid-cols-2 overflow-hidden">
          <div className="flex items-center justify-center bg-[#FFFC00] text-[#0A0A0B]">
            <span className="text-3xl">👻</span>
          </div>
          <div className="flex items-center justify-center bg-[#0A0A0B] text-[#F5F3EC]">
            <span className="text-3xl font-bold">@</span>
          </div>
          <div className="border-line-2 bg-ink/90 text-paper absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 font-mono text-[9px] tracking-[0.14em] whitespace-nowrap">
            ONE MOMENT · TWO VOICES
          </div>
        </div>
      );
    case 'good-caption':
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#101014] p-5 text-center">
          <div className="font-instrument-serif text-paper text-[24px] italic">
            &ldquo;Low tide, high spirits.&rdquo;
          </div>
          <div className="mt-4 flex w-full max-w-[230px] items-center justify-between border-t border-line pt-2 font-mono text-[9.5px] tracking-[0.14em]">
            <span className="text-muted">HOOK</span>
            <span className="text-paper border-lime border-t-2 pt-1 -mt-2.5">VOICE</span>
            <span className="text-muted">PAYOFF</span>
          </div>
        </div>
      );
    case 'save-hours':
      return (
        <div className="relative flex h-full w-full items-center justify-between gap-3 bg-[#101013] p-5">
          <div>
            <div className="text-muted font-instrument-serif text-[22px] line-through">2 HRS</div>
            <div className="font-instrument-serif text-lime text-[34px] leading-none italic">
              20 min
            </div>
            <div className="text-muted mt-1.5 font-mono text-[9px] tracking-[0.12em]">
              CAPTION TIME, PER WEEK
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {['mon batch', 'wed batch', 'fri batch'].map((d) => (
              <span
                key={d}
                className="border-line-2 bg-ink-3 text-paper-dim rounded-lg border px-2.5 py-1 font-mono text-[9.5px]"
              >
                <span className="text-lime mr-1.5">✓</span>
                {d}
              </span>
            ))}
          </div>
        </div>
      );
    case 'analyze-photo':
      return (
        <div className="relative flex h-full w-full items-center justify-between gap-4 bg-[#0f1013] p-5">
          <div className="border-line-2 relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border bg-[#191b14]">
            <div className="h-full w-full bg-[radial-gradient(circle_at_35%_60%,rgba(200,255,77,0.35),transparent_60%)]" />
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div>
              <span className="text-muted mr-2">SUBJECT</span>
              <span className="text-paper">dog, mid-zoomies</span>
            </div>
            <div>
              <span className="text-lime mr-2">LIGHT</span>
              <span className="text-paper">golden hour</span>
            </div>
            <div>
              <span className="text-muted mr-2">MOOD</span>
              <span className="text-paper">pure joy</span>
            </div>
          </div>
        </div>
      );
    case 'hashtags':
      return (
        <div className="relative flex h-full w-full flex-col justify-center gap-2 bg-[#110f14] p-5">
          <div className="text-lime font-mono text-[9px] tracking-[0.14em]">KEEP</div>
          <div className="flex flex-wrap gap-1.5">
            {['#beachdog', '#dogsofinstagram', '#goldenhour'].map((t) => (
              <span
                key={t}
                className="rounded-full bg-[#C13584] px-2.5 py-1 font-mono text-[9.5px] text-white"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="text-muted mt-1 font-mono text-[9px] tracking-[0.14em]">SKIP</div>
          <div className="flex flex-wrap gap-1.5">
            {['#follow4follow', '#instagood', '#viral'].map((t) => (
              <span
                key={t}
                className="border-line-2 text-muted rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] line-through"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    case 'followers':
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-[#101013] p-5">
          <div className="flex items-center gap-2">
            <span className="border-line bg-ink-3 text-muted rounded-xl border px-2.5 py-1.5 font-mono text-xs">
              +12
            </span>
            <span className="border-line-2 bg-ink-3 text-paper-dim rounded-xl border px-3 py-1.5 font-mono text-sm">
              +340
            </span>
            <span className="border-paper bg-ink text-paper rounded-xl border px-3.5 py-2 font-mono text-lg font-medium">
              +1,204
            </span>
          </div>
          <div className="font-instrument-serif text-paper-dim text-[15px] italic">
            same photos, better words.
          </div>
        </div>
      );
  }
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="bg-ink-2 border-line hover:border-line-2 group flex flex-col overflow-hidden rounded-[22px] border no-underline transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="border-line h-[185px] w-full overflow-hidden border-b">
        <BlogVisual type={post.visualType} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] uppercase"
            style={{
              background:
                post.category === 'Instagram'
                  ? '#C13584'
                  : post.category === 'LinkedIn'
                    ? '#0A66C2'
                    : post.category === 'Facebook'
                      ? '#1877F2'
                      : post.category === 'Productivity'
                        ? '#F58529'
                        : post.category === 'X (Twitter)'
                          ? '#23232a'
                          : post.category === 'Guides'
                            ? '#f5f3ec'
                            : '#c8ff4d',
              color:
                post.category === 'Basics' ||
                post.category === 'Strategy' ||
                post.category === 'Guides' ||
                post.category === 'Productivity'
                  ? '#0a0a0b'
                  : '#ffffff',
            }}
          >
            {post.category}
          </span>
          <span className="text-muted font-mono text-[10px] tracking-[0.12em]">
            {post.readTime}
          </span>
        </div>

        <h3 className="font-instrument-serif text-paper group-hover:text-lime m-0 text-[25px] leading-[1.15] tracking-[-0.01em] transition-colors">
          {post.title}
        </h3>

        <p className="text-paper-dim mt-2.5 mb-5 line-clamp-3 flex-1 text-[13.5px] leading-[1.55]">
          {post.excerpt}
        </p>

        <div className="border-line flex items-center justify-between border-t pt-4">
          <span className="text-muted font-mono text-[10.5px] tracking-[0.12em]">
            {post.date}
          </span>
          <span className="text-paper inline-flex items-center gap-1.5 text-[12.5px] font-medium">
            <span>Read more</span>
            <ArrowRightIcon size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
