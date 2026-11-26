import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CtaBanner } from '../components/capgen/CtaBanner';
import { FaqAccordion } from '../components/capgen/FaqAccordion';
import { Footer } from '../components/capgen/Footer';
import { Header } from '../components/capgen/Header';
import { CheckIcon } from '../components/capgen/NetIcon';
import { PricingCard } from '../components/capgen/PricingCard';
import { PRICING_FAQS, PRICING_PLANS, PRICING_TRUST_HIGHLIGHTS } from '../data/pricing';

export function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header variant="public" />

      <main>
        {/* Hero */}
        <section className="section-pad pt-16 pb-10">
          <div className="container text-center">
            <div className="text-lime mb-4 font-mono text-[11px] tracking-[0.16em]">
              ONE SUBSCRIPTION, THREE SIZES
            </div>

            <h1
              className="font-instrument-serif text-paper m-0 leading-[0.94] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(48px, 6.2vw, 84px)' }}
            >
              Pick a plan.
              <br />
              <span className="text-lime italic">Caption every photo.</span>
            </h1>

            <p className="text-paper-dim mx-auto mt-5 max-w-[540px] text-[16px] leading-[1.55]">
              A simple monthly subscription. Your credits refresh every cycle: one credit reads one
              photo and writes eight captions, one for every network. Cancel anytime.
            </p>

            {/* Formula Strip */}
            <div className="border-line bg-ink-2 mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border px-5 py-3 font-mono text-[11px] tracking-[0.12em]">
              <span>
                <span className="text-paper">1 CREDIT</span>{' '}
                <span className="text-lime">→ 1 PHOTO</span>
              </span>
              <span className="bg-line h-3.5 w-px hidden sm:inline-block" />
              <span>
                <span className="text-paper">1 PHOTO</span>{' '}
                <span className="text-lime">→ 8 CAPTIONS</span>
              </span>
              <span className="bg-line h-3.5 w-px hidden sm:inline-block" />
              <span>
                <span className="text-paper">8 CAPTIONS</span>{' '}
                <span className="text-lime">→ 100+ LANGUAGES</span>
              </span>
            </div>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-8 flex justify-center">
              <div
                role="group"
                aria-label="Billing interval"
                className="bg-ink-2 border-line inline-flex items-center gap-1 rounded-full border p-1"
              >
                <button
                  type="button"
                  onClick={() => setInterval('monthly')}
                  className={`cursor-pointer rounded-full border-0 px-4.5 py-2 text-[13px] font-medium transition-colors duration-150 ${
                    interval === 'monthly'
                      ? 'bg-lime text-lime-ink'
                      : 'text-paper-dim hover:text-paper bg-transparent'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setInterval('yearly')}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-0 px-4.5 py-2 text-[13px] font-medium transition-colors duration-150 ${
                    interval === 'yearly'
                      ? 'bg-lime text-lime-ink'
                      : 'text-paper-dim hover:text-paper bg-transparent'
                  }`}
                >
                  <span>Yearly</span>
                  <span
                    className={`rounded-full px-1.5 py-px font-mono text-[9px] font-semibold tracking-wider ${
                      interval === 'yearly'
                        ? 'text-lime-ink bg-black/15'
                        : 'bg-lime/15 text-lime'
                    }`}
                  >
                    −20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="section-pad pb-12">
          <div className="container">
            <div className="grid-pricing mt-4">
              {PRICING_PLANS.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  interval={interval}
                  onSelect={() => navigate('/signup')}
                />
              ))}
            </div>

            {/* Trust Highlights Row */}
            <div className="bg-ink-2 border-line mx-auto mt-10 grid max-w-[1100px] grid-cols-1 gap-6 rounded-3xl border p-7 sm:grid-cols-2 lg:grid-cols-4">
              {PRICING_TRUST_HIGHLIGHTS.map((item) => (
                <div key={item.title}>
                  <span className="bg-lime/12 text-lime mb-3 grid h-5 w-5 place-items-center rounded-md">
                    <CheckIcon size={11} />
                  </span>
                  <div className="text-paper text-[14px] font-medium">{item.title}</div>
                  <div className="text-muted mt-1 text-[12.5px] leading-snug">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Billing FAQ */}
        <section className="section-pad py-20">
          <div className="container max-w-[1000px]!">
            <div className="mb-12">
              <div className="text-muted mb-3 font-mono text-[11px] tracking-[0.16em]">
                BILLING QUESTIONS
              </div>
              <h2
                className="font-instrument-serif text-paper m-0 leading-none tracking-[-0.02em]"
                style={{ fontSize: 'clamp(40px, 5.2vw, 60px)' }}
              >
                The fine print, <span className="text-lime italic">in plain English</span>.
              </h2>
            </div>

            <FaqAccordion items={PRICING_FAQS} defaultOpenIndex={0} />
          </div>
        </section>

        {/* CTA */}
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
