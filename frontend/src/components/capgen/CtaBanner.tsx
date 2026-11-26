import { Link } from 'react-router-dom';
import { NETWORKS, type NetworkId } from '../../config/site';
import { ArrowRightIcon, NetIcon } from './NetIcon';

interface CtaBannerProps {
  onStartFree?: () => void;
}

const ORBIT_NODES: {
  id: NetworkId;
  posClass: string;
}[] = [
  { id: 'instagram', posClass: 'top-[4%] left-[45%]' },
  { id: 'facebook', posClass: 'top-[18%] right-[6%]' },
  { id: 'tiktok', posClass: 'top-[54%] right-[3%]' },
  { id: 'twitter', posClass: 'bottom-[8%] right-[14%]' },
  { id: 'snapchat', posClass: 'bottom-[4%] left-[44%]' },
  { id: 'linkedin', posClass: 'bottom-[16%] left-[8%]' },
  { id: 'threads', posClass: 'top-[48%] left-[3%]' },
  { id: 'whatsapp', posClass: 'top-[14%] left-[12%]' },
];

export function CtaBanner({ onStartFree }: CtaBannerProps) {
  return (
    <section className="section-pad pt-16 pb-24">
      <div
        className="cta-card border-line-2 relative container overflow-hidden rounded-4xl border bg-no-repeat"
        style={{
          background:
            'radial-gradient(600px 400px at 80% 50%, rgba(200, 255, 77, 0.08), transparent 70%), var(--ink-2)',
        }}
      >
        <div className="relative z-2 max-w-[520px]">
          <div className="text-lime mb-4 font-mono text-[11px] tracking-[0.16em]">
            START FREE · NO CARD
          </div>
          <h2
            className="font-instrument-serif m-0 mb-5 leading-[0.94] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(44px, 6.2vw, 84px)' }}
          >
            Write less.
            <br />
            <span className="text-lime italic">Post more.</span>
          </h2>
          <p className="text-paper-dim m-0 mb-8 max-w-[420px] text-[16px] leading-[1.6]">
            Drop a photo, pick a vibe, and post in seconds.
          </p>
          <div className="hero-button-row flex flex-wrap items-center gap-3">
            {onStartFree ? (
              <button
                type="button"
                onClick={onStartFree}
                className="bg-lime text-lime-ink border-lime inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-[15px] leading-none font-medium whitespace-nowrap transition-all duration-150 hover:-translate-y-px"
              >
                <span>Start free, 30 captions</span>
                <ArrowRightIcon size={15} />
              </button>
            ) : (
              <Link
                to="/signup"
                className="bg-lime text-lime-ink border-lime inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-[15px] leading-none font-medium whitespace-nowrap no-underline transition-all duration-150 hover:-translate-y-px"
              >
                <span>Start free, 30 captions</span>
                <ArrowRightIcon size={15} />
              </Link>
            )}
            <Link
              to="/pricing"
              className="text-paper border-line-2 hover:border-paper-dim inline-flex items-center justify-center rounded-full border bg-transparent px-6 py-3.5 text-[15px] leading-none font-medium whitespace-nowrap no-underline transition-all duration-150"
            >
              See pricing
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="cta-orbit pointer-events-none absolute top-1/2 right-12 h-[360px] w-[360px] -translate-y-1/2"
        >
          <div className="border-line/70 absolute inset-4 rounded-full border border-dashed" />
          <div className="border-line/50 absolute inset-14 rounded-full border" />

          <div className="border-line-2 bg-ink-3 absolute top-1/2 left-1/2 h-[126px] w-[126px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border shadow-2xl">
            <img
              src="/images/sq/dog-beach-sq.webp"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="bg-ink/85 text-lime absolute inset-x-2 bottom-2 rounded-md py-0.5 text-center font-mono text-[9px] tracking-[0.14em]">
              GENERATING
            </div>
          </div>

          {ORBIT_NODES.map((node, i) => {
            const net = NETWORKS.find((n) => n.id === node.id);
            if (!net) return null;
            return (
              <div
                key={node.id}
                className={`absolute ${node.posClass}`}
                style={{ animation: `driftY ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite` }}
              >
                <div
                  className="border-line-2 grid h-10 w-10 place-items-center rounded-xl border shadow-lg"
                  style={{ background: net.bg, color: net.ink }}
                >
                  <NetIcon id={net.id} size={17} />
                </div>
              </div>
            );
          })}

          <div className="bg-paper text-ink absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-[10.5px] font-medium whitespace-nowrap shadow-xl">
            ocean breeze hits just right 🤩
          </div>
        </div>
      </div>
    </section>
  );
}
