import type { PricingPlan } from '../../data/pricing';
import { ArrowRightIcon, CheckIcon } from './NetIcon';

interface PricingCardProps {
  plan: PricingPlan;
  interval: 'monthly' | 'yearly';
  onSelect: (plan: PricingPlan) => void;
}

export function PricingCard({ plan, interval, onSelect }: PricingCardProps) {
  const isHighlighted = Boolean(plan.highlighted);
  const price = interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const creditsCount = interval === 'yearly' ? plan.creditsPerMonth * 12 : plan.creditsPerMonth;
  const isScale = plan.id === 'SCALE';

  return (
    <div
      className={`relative flex flex-col rounded-[22px] border p-7 ${
        isHighlighted
          ? 'bg-paper text-ink border-paper'
          : 'bg-ink-2 text-paper border-line'
      }`}
    >
      {plan.tag && (
        <div
          className={`text-ink absolute -top-3 right-4 rounded-full px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-[0.12em] ${
            isScale ? '' : 'bg-lime'
          }`}
          style={isScale ? { background: 'linear-gradient(90deg, #C8FF4D, #8CE000)' } : undefined}
        >
          {plan.tag}
        </div>
      )}

      <div className="mb-3 font-mono text-[11px] tracking-[0.14em] opacity-60">{plan.name}</div>
      <p className="mt-0 mb-5 text-sm leading-normal opacity-75">{plan.tagline}</p>

      <div className="flex items-baseline gap-2">
        <div className="font-instrument-serif text-[64px] leading-[0.9] tracking-[-0.02em]">
          ${price}
        </div>
        <div className="text-[14px] opacity-70">/mo</div>
      </div>

      <div className="mt-1.5 text-[12px] opacity-65">
        {interval === 'yearly'
          ? `Billed annually · $${plan.yearlyTotal}/yr`
          : 'Billed monthly'}{' '}
        · {creditsCount.toLocaleString('en-US')} credits/{interval === 'yearly' ? 'yr' : 'mo'}
      </div>

      <div className={`my-5.5 h-px ${isHighlighted ? 'bg-black/10' : 'bg-line'}`} />

      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-center gap-2.5 text-[13.5px]">
            <span
              className={`text-lime grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full ${
                isHighlighted ? 'bg-ink' : 'bg-lime/12'
              }`}
            >
              <CheckIcon size={11} />
            </span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className={`mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-6 py-3.75 text-[15px] leading-none font-medium tracking-[-0.005em] whitespace-nowrap transition-all duration-150 ease-out ${
          isHighlighted
            ? 'bg-ink text-paper border-ink hover:-translate-y-px'
            : 'text-paper border-line-2 hover:border-paper-dim bg-transparent'
        }`}
      >
        <span>{plan.ctaLabel}</span>
        <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}
