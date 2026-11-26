import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NETWORKS, type NetworkId } from '../config/site';
import {
  FEATURE_ARCHIVE_THUMBS,
  FEATURE_LANGUAGES,
  FEATURE_NETWORK_CARDS,
  FEATURE_TONES,
  HERO_CREATOR_AVATARS,
  HERO_SLIDES,
  LANDING_FAQS,
  SHOWCASE_ITEMS,
  TESTIMONIALS,
} from '../data/landing';
import { CtaBanner } from '../components/capgen/CtaBanner';
import { FaqAccordion } from '../components/capgen/FaqAccordion';
import { Footer } from '../components/capgen/Footer';
import { Header } from '../components/capgen/Header';
import { ArrowRightIcon, CheckIcon, NetIcon } from '../components/capgen/NetIcon';

export function LandingPage() {
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [heroNetId, setHeroNetId] = useState<NetworkId>('twitter');
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const [activeLangCode, setActiveLangCode] = useState('AR');
  const [activeTone, setActiveTone] = useState('Witty');

  useEffect(() => {
    if (testimonialPaused) return;
    const id = window.setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [testimonialPaused]);

  const activeSlide = HERO_SLIDES[heroSlideIdx];
  const activeNet = NETWORKS.find((n) => n.id === heroNetId) ?? NETWORKS[0];
  const activeCaption = activeSlide.captions[heroNetId];
  const activeLang = FEATURE_LANGUAGES.find((l) => l.code === activeLangCode) ?? FEATURE_LANGUAGES[0];
  const activeTestimonial = TESTIMONIALS[testimonialIdx];

  return (
    <div className="min-h-screen">
      <Header variant="public" />

      <main className="overflow-x-hidden">
        {/* 1. Hero Section */}
        <section className="section-pad relative pt-10 pb-14 md:pt-14">
          <div className="grid-hero container">
            <div className="rise min-w-0">
              <div className="bg-lime/8 border-lime/25 text-lime mb-4.5 inline-block rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] tracking-[0.14em]">
                FOR PEOPLE WHO POST EVERYWHERE
              </div>

              <h1
                className="font-instrument-serif text-paper m-0 leading-[0.94] tracking-[-0.025em]"
                style={{ fontSize: 'clamp(40px, 6.2vw, 84px)' }}
              >
                The AI <span className="text-lime italic">image caption generator</span> that
                sounds like you.
              </h1>

              <p className="text-paper-dim mt-5 mb-7 max-w-[460px] text-[16px] leading-[1.6]">
                Captio reads your photo and writes eight captions, one tuned for each major
                network, in 100+ languages. It takes about four seconds.
              </p>

              <div className="hero-button-row flex flex-wrap items-center gap-3">
                <Link
                  to="/signup"
                  className="bg-lime text-lime-ink border-lime inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.75 text-[15px] leading-none font-medium whitespace-nowrap no-underline transition-transform duration-150 hover:-translate-y-px"
                >
                  <span>Start captioning free</span>
                  <ArrowRightIcon size={15} />
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-3.5">
                <div className="flex -space-x-2.5">
                  {HERO_CREATOR_AVATARS.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Creator ${i + 1}`}
                      className="border-ink h-8 w-8 rounded-full border-2 object-cover"
                    />
                  ))}
                </div>
                <div className="text-[13.5px]">
                  <span className="text-paper font-semibold">12,400+ creators</span>{' '}
                  <span className="text-muted">writing less, posting more</span>
                </div>
              </div>
            </div>

            {/* Interactive Demo Card */}
            <div className="bg-ink-2 border-line relative min-w-0 rounded-3xl border p-4 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between px-2 pt-1 pb-3">
                <div className="text-lime inline-flex items-center font-mono text-[10.5px] tracking-[0.12em]">
                  CLICK A PHOTO, PICK A NETWORK
                </div>
                <div className="text-muted font-mono text-[11px] tracking-[0.08em]">
                  0{heroSlideIdx + 1} / 0{HERO_SLIDES.length}
                </div>
              </div>

              {/* Active Photo */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#111]">
                <img
                  src={activeSlide.src}
                  alt={activeSlide.title}
                  className="h-full w-full object-cover"
                />
                <span className="bg-black/55 text-paper absolute top-3 left-3 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase backdrop-blur-md">
                  {activeSlide.title}
                </span>
              </div>

              {/* 4 Thumbnails */}
              <div className="mt-2.5 grid grid-cols-4 gap-2">
                {HERO_SLIDES.map((slide, idx) => {
                  const selected = idx === heroSlideIdx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setHeroSlideIdx(idx)}
                      aria-label={`Select ${slide.title}`}
                      className={`relative aspect-[16/10] cursor-pointer overflow-hidden rounded-xl border p-0 transition-all ${
                        selected
                          ? 'border-lime ring-1 ring-lime'
                          : 'border-transparent opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* 8 Network Tabs */}
              <div className="bg-ink-3 border-line mt-2.5 grid grid-cols-8 gap-1 rounded-2xl border p-1">
                {NETWORKS.map((net) => {
                  const active = net.id === heroNetId;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setHeroNetId(net.id)}
                      aria-label={net.name}
                      className={`grid h-9 cursor-pointer place-items-center rounded-xl border-0 transition-colors ${
                        active
                          ? 'bg-ink text-paper shadow-sm'
                          : 'text-muted hover:text-paper bg-transparent'
                      }`}
                    >
                      <NetIcon id={net.id} size={15} />
                    </button>
                  );
                })}
              </div>

              {/* Active Caption Box */}
              <div
                className="relative mt-2.5 min-h-[106px] overflow-hidden rounded-2xl border border-white/6 p-4 transition-colors duration-200"
                style={{
                  background: activeNet.id === 'twitter' ? '#070709' : activeNet.bg,
                  color: activeNet.ink,
                }}
              >
                <div className="relative z-2 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-semibold">
                    <NetIcon id={activeNet.id} size={14} />
                    <span>{activeNet.name}</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.12em] opacity-65">
                    {activeCaption.length} CHARS
                  </span>
                </div>
                <p className="relative z-2 m-0 max-w-[92%] text-[13.5px] leading-[1.5]">
                  {activeCaption}
                </p>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -bottom-4 opacity-12"
                >
                  <NetIcon id={activeNet.id} size={96} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Platform Marquee */}
        <div className="border-line bg-ink-2/35 overflow-hidden border-y py-4">
          <div
            className="flex w-max items-center gap-7"
            style={{ animation: 'marquee 34s linear infinite' }}
          >
            {[...NETWORKS, ...NETWORKS, ...NETWORKS].map((net, idx) => (
              <div key={`${net.id}-${idx}`} className="flex items-center gap-3.5 whitespace-nowrap">
                <span
                  className={`grid h-8.5 w-8.5 shrink-0 place-items-center rounded-[9px] ${
                    net.id === 'twitter' || net.id === 'threads' ? 'border-line-2 border' : ''
                  }`}
                  style={{ background: net.bg, color: net.ink }}
                >
                  <NetIcon id={net.id} size={17} />
                </span>
                <span className="font-instrument-serif text-paper-dim text-2xl italic">
                  {net.name}
                </span>
                <span className="text-muted">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AI-Generated Showcase */}
        <section id="showcase" className="section-pad relative py-24">
          <div className="container">
            <div className="mb-14 text-center">
              <div className="text-muted mb-3.5 font-mono text-[11px] tracking-[0.16em]">
                AN AI-GENERATED SHOWCASE
              </div>
              <h2
                className="font-instrument-serif m-0 leading-none tracking-[-0.02em]"
                style={{ fontSize: 'clamp(42px, 5.8vw, 76px)' }}
              >
                Pick any photo. Read what <span className="text-lime italic">Captio</span>
                <br />
                wrote.
              </h2>
              <p className="text-paper-dim mx-auto mt-4 max-w-[440px] text-[15px] leading-[1.6]">
                Every caption below was generated by Captio from the image alone. No prompt, no
                edits.
              </p>
            </div>

            <div className="grid-showcase">
              {SHOWCASE_ITEMS.map((item, idx) => {
                const net = NETWORKS.find((n) => n.id === item.net) ?? NETWORKS[0];
                const isOpen = activeShowcaseIdx === idx;
                return (
                  <div
                    key={item.title}
                    className="bento-span group relative cursor-pointer overflow-hidden rounded-2xl bg-[#111]"
                    style={{ gridColumn: item.colSpan, gridRow: item.rowSpan }}
                    tabIndex={0}
                    onMouseEnter={() => setActiveShowcaseIdx(idx)}
                    onMouseLeave={() => setActiveShowcaseIdx(null)}
                    onFocus={() => setActiveShowcaseIdx(idx)}
                    onBlur={() => setActiveShowcaseIdx(null)}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-4 transition-[background] duration-300"
                      style={{
                        background: isOpen
                          ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.92) 100%)'
                          : 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
                      }}
                    >
                      <div
                        className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
                        style={{ background: net.bg, color: net.ink }}
                      >
                        <NetIcon id={net.id} size={11} />
                        <span>{net.name}</span>
                      </div>

                      {isOpen && (
                        <p className="text-paper m-0 mb-1.5 text-[12.5px] leading-[1.45]">
                          {item.caption}
                        </p>
                      )}
                      <div className="font-instrument-serif text-paper text-[18px] leading-tight">
                        {item.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Testimonials */}
        <section className="section-pad relative py-24">
          <div className="container max-w-[1000px]! text-center">
            <div className="text-muted mb-3.5 font-mono text-[11px] tracking-[0.16em]">
              IN THEIR WORDS
            </div>
            <h2
              className="font-instrument-serif m-0 mb-14 leading-none tracking-[-0.02em]"
              style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}
            >
              What creators <span className="text-lime italic">actually</span> say.
            </h2>

            <div
              onMouseEnter={() => setTestimonialPaused(true)}
              onMouseLeave={() => setTestimonialPaused(false)}
            >
              <div className="bg-ink-2 border-line relative overflow-hidden rounded-3xl border px-8 py-12 md:px-14">
                <div
                  aria-hidden="true"
                  className="font-instrument-serif text-lime/8 pointer-events-none absolute -top-10 -left-7.5 text-[240px] leading-none italic"
                >
                  &ldquo;
                </div>
                <p
                  className="font-instrument-serif relative z-2 m-0 mx-auto max-w-[840px] leading-[1.3] tracking-[-0.01em]"
                  style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
                >
                  <span className="font-instrument-serif text-lime italic">&ldquo;</span>
                  {activeTestimonial.quote}
                  <span className="font-instrument-serif text-lime italic">&rdquo;</span>
                </p>

                <div className="relative z-2 mt-8 flex items-center justify-center gap-3.5 text-left">
                  <div
                    className="h-10 w-10 overflow-hidden rounded-full p-[2px]"
                    style={{ background: activeTestimonial.color }}
                  >
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-paper text-[14px] font-medium">
                      {activeTestimonial.name}
                    </div>
                    <div className="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">
                      {activeTestimonial.role}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setTestimonialIdx(i)}
                    aria-label={`Show testimonial from ${t.name}`}
                    className={`h-1.5 cursor-pointer rounded-full border-0 transition-all duration-200 ${
                      i === testimonialIdx ? 'bg-lime w-6' : 'bg-line-2 w-2 hover:bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Features Bento */}
        <section id="features" className="section-pad relative py-24">
          <div className="container">
            <div className="grid-features-header">
              <div>
                <div className="text-muted mb-3.5 font-mono text-[11px] tracking-[0.16em]">
                  THE POWER OF CAPTIO
                </div>
                <h2
                  className="font-instrument-serif m-0 leading-[0.95] tracking-[-0.025em]"
                  style={{ fontSize: 'clamp(42px, 5.8vw, 76px)' }}
                >
                  Built for the <span className="text-lime italic">scroll-</span>
                  <br />
                  <span className="text-lime italic">first</span> era.
                </h2>
              </div>
              <p className="text-paper-dim m-0 max-w-[440px] text-[15.5px] leading-[1.6]">
                Captioning used to be the chore after the photo. Captio flips it: read the image,
                match the voice, match the feed, automatically.
              </p>
            </div>

            <div className="grid-features">
              {/* 01: One photo. Eight voices. */}
              <div
                className="feature-span feature-card bg-ink-2 border-line flex flex-col justify-between overflow-hidden rounded-3xl border p-7"
                style={{ gridColumn: 'span 3' }}
              >
                <div>
                  <div className="text-muted mb-2 font-mono text-[11px] tracking-[0.14em]">01</div>
                  <h3 className="font-instrument-serif feature-big-title text-paper m-0 text-[34px] leading-tight">
                    One photo. Eight voices.
                  </h3>
                  <p className="text-paper-dim mt-2 mb-6 text-[13.5px] leading-[1.55]">
                    Writes a distinct caption for each network, matched in length, tone, hashtags
                    and cadence.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {FEATURE_NETWORK_CARDS.map((card) => (
                    <div
                      key={card.id}
                      className="net-card rounded-2xl p-3.5 shadow-md"
                      style={{
                        background: card.bg,
                        color: card.ink,
                        transform: `rotate(${card.rot})`,
                      }}
                    >
                      <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <NetIcon id={card.id} size={12} />
                          {card.name}
                        </span>
                        <span className="font-mono text-[10px] opacity-75">{card.count}</span>
                      </div>
                      <p className="m-0 mb-2 text-[11.5px] leading-[1.35]">{card.caption}</p>
                      <div className="font-mono text-[10px] opacity-80">{card.metric}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 02: 100+ languages */}
              <div
                className="feature-span feature-card bg-ink-2 border-line flex flex-col justify-between overflow-hidden rounded-3xl border p-7"
                style={{ gridColumn: 'span 3' }}
              >
                <div>
                  <div className="text-muted mb-2 font-mono text-[11px] tracking-[0.14em]">02</div>
                  <h3 className="font-instrument-serif feature-big-title text-paper m-0 text-[34px] leading-tight">
                    100+ languages.
                  </h3>
                  <p className="text-paper-dim mt-2 mb-6 text-[13.5px] leading-[1.55]">
                    Each caption is generated from scratch in the target language. Native fluency,
                    not translation. 100+ languages supported.
                  </p>
                </div>

                <div className="bg-ink-3 border-line relative flex flex-col justify-between rounded-2xl border p-4">
                  <div className="mb-6 flex items-center justify-between font-mono text-[10px] tracking-[0.12em]">
                    <span className="text-lime inline-flex items-center gap-1.5">
                      <span className="bg-lime h-1.5 w-1.5 rounded-full" />
                      GENERATING · {activeLang.code}
                    </span>
                    <span className="text-muted">100+ LANGUAGES</span>
                  </div>

                  <div className="border-line bg-ink-2 my-3 rounded-xl border p-3.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs">
                        <span className="bg-ink-3 border-line rounded border px-1.5 py-0.5 font-mono text-[10px] text-paper-dim">
                          {activeLang.code}
                        </span>
                        <span className="text-paper font-medium">{activeLang.native}</span>
                      </span>
                      <span className="text-lime font-mono text-[9.5px] tracking-[0.12em]">
                        NATIVE
                      </span>
                    </div>
                    <div
                      dir={activeLang.dir}
                      className="text-paper text-[14px] leading-relaxed"
                    >
                      {activeLang.text}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {FEATURE_LANGUAGES.slice(0, 7).map((l) => {
                      const active = l.code === activeLangCode;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => setActiveLangCode(l.code)}
                          className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                            active
                              ? 'border-lime bg-lime text-lime-ink font-semibold'
                              : 'border-line bg-ink-2 text-paper-dim hover:text-paper'
                          }`}
                        >
                          <span className="mr-1 font-mono text-[9.5px] opacity-70">{l.code}</span>
                          {l.native}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 03: Tuned to your vibe */}
              <div
                className="feature-span feature-card bg-ink-2 border-line flex flex-col justify-between rounded-3xl border p-7"
                style={{ gridColumn: 'span 2' }}
              >
                <div>
                  <div className="text-muted mb-2 font-mono text-[11px] tracking-[0.14em]">03</div>
                  <h3 className="font-instrument-serif text-paper m-0 text-[28px] leading-tight">
                    Tuned to your vibe.
                  </h3>
                  <p className="text-paper-dim mt-2 mb-5 text-[13px] leading-[1.55]">
                    Playful, professional, witty, poetic, hype, minimal. Pick a tone and Captio does
                    the rest.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {FEATURE_TONES.map((tone) => {
                    const active = tone === activeTone;
                    return (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setActiveTone(tone)}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-2 text-left text-[13px] transition-colors ${
                          active
                            ? 'border-lime/60 bg-lime/10 text-lime font-medium'
                            : 'border-line bg-ink-3/60 text-paper-dim hover:text-paper'
                        }`}
                      >
                        <span>{tone}</span>
                        {active && <CheckIcon size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 04: Actually reads the image */}
              <div
                className="feature-span feature-card bg-ink-2 border-line flex flex-col justify-between rounded-3xl border p-7"
                style={{ gridColumn: 'span 2' }}
              >
                <div>
                  <div className="text-muted mb-2 font-mono text-[11px] tracking-[0.14em]">04</div>
                  <h3 className="font-instrument-serif text-paper m-0 text-[28px] leading-tight">
                    Actually reads the image.
                  </h3>
                  <p className="text-paper-dim mt-2 mb-5 text-[13px] leading-[1.55]">
                    Subject, mood, lighting, context. Every caption is grounded in what&apos;s in the
                    photo.
                  </p>
                </div>

                <div className="border-line relative h-[180px] overflow-hidden rounded-2xl border">
                  <img
                    src="/images/sunset-surf.webp"
                    alt="Visual reading example"
                    className="h-full w-full object-cover"
                  />
                  <span className="bg-lime text-lime-ink absolute top-3 right-3 rounded-full px-2.5 py-0.5 font-mono text-[9.5px] font-semibold">
                    GOLDEN HOUR
                  </span>
                  <span className="bg-ink/85 text-paper border-line-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-0.5 font-mono text-[9.5px]">
                    SURFER
                  </span>
                  <span className="bg-ink/85 text-lime border-lime/40 absolute bottom-3 left-3 rounded-full border px-2.5 py-0.5 font-mono text-[9.5px]">
                    OCEAN
                  </span>
                </div>
              </div>

              {/* 05: An archive of your work */}
              <div
                className="feature-span feature-card bg-ink-2 border-line flex flex-col justify-between rounded-3xl border p-7"
                style={{ gridColumn: 'span 2' }}
              >
                <div>
                  <div className="text-muted mb-2 font-mono text-[11px] tracking-[0.14em]">05</div>
                  <h3 className="font-instrument-serif text-paper m-0 text-[28px] leading-tight">
                    An archive of your work.
                  </h3>
                  <p className="text-paper-dim mt-2 mb-5 text-[13px] leading-[1.55]">
                    Every generation is saved. Search by tag, re-copy, or regenerate with a
                    different tone.
                  </p>
                </div>

                <div className="grid w-full grid-cols-3 gap-1.5">
                  {FEATURE_ARCHIVE_THUMBS.map((src) => (
                    <div
                      key={src}
                      className="aspect-square overflow-hidden rounded-lg bg-[#111]"
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section id="faq" className="section-pad py-24">
          <div className="container max-w-[1000px]!">
            <div className="mb-14 text-center">
              <div className="text-muted mb-3.5 font-mono text-[11px] tracking-[0.16em]">
                FREQUENTLY ASKED
              </div>
              <h2
                className="font-instrument-serif m-0 leading-none tracking-[-0.02em]"
                style={{ fontSize: 'clamp(44px, 6vw, 76px)' }}
              >
                Answers, <span className="text-lime italic">unprompted</span>.
              </h2>
            </div>

            <FaqAccordion items={LANDING_FAQS} defaultOpenIndex={0} numbered />
          </div>
        </section>

        {/* 7. Bottom CTA */}
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
