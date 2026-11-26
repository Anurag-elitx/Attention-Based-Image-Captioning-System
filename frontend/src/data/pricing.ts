import type { FaqItem } from './landing';

export interface PricingPlan {
  id: 'STARTER' | 'STUDIO' | 'SCALE';
  name: string;
  tagline: string;
  tag?: string;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlyTotal: string;
  creditsPerMonth: number;
  highlighted?: boolean;
  ctaLabel: string;
  features: string[];
}

export interface TrustHighlight {
  title: string;
  description: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'STARTER',
    name: 'STARTER',
    tagline: 'For creators shipping everyday social captions.',
    monthlyPrice: '4.99',
    yearlyPrice: '3.99',
    yearlyTotal: '47.90',
    creditsPerMonth: 100,
    ctaLabel: 'Start Starter',
    features: [
      '100 credits / month',
      'Ad-free experience',
      'Captions for all 8 networks',
      '100+ languages',
      'Priority generation',
      'Saved to collections',
    ],
  },
  {
    id: 'STUDIO',
    name: 'STUDIO',
    tagline: 'For teams running multiple brands.',
    tag: 'POPULAR',
    monthlyPrice: '9.99',
    yearlyPrice: '7.99',
    yearlyTotal: '95.90',
    creditsPerMonth: 500,
    highlighted: true,
    ctaLabel: 'Start Studio',
    features: [
      '500 credits / month',
      'Ad-free experience',
      'All 8 networks',
      '100+ languages',
      'Priority generation',
      'Custom tone & length',
    ],
  },
  {
    id: 'SCALE',
    name: 'SCALE',
    tagline: 'For agencies producing at volume.',
    tag: 'BEST VALUE',
    monthlyPrice: '19.99',
    yearlyPrice: '15.99',
    yearlyTotal: '191.90',
    creditsPerMonth: 2500,
    ctaLabel: 'Start Scale',
    features: [
      '2,500 credits / month',
      'Ad-free experience',
      'All 8 networks',
      '100+ languages',
      'Priority generation',
      'Custom tone & length',
      'Export CSV / JSON',
    ],
  },
];

export const PRICING_TRUST_HIGHLIGHTS: TrustHighlight[] = [
  {
    title: 'Cancel anytime',
    description: 'No contracts. Stop billing in two clicks.',
  },
  {
    title: 'Credits each month',
    description: 'Your pack refreshes on every renewal.',
  },
  {
    title: 'Secure checkout',
    description: 'Cards & Apple Pay supported.',
  },
  {
    title: '14-day money-back',
    description: 'Paid plans, no questions asked.',
  },
];

export const PRICING_FAQS: FaqItem[] = [
  {
    question: 'How do credits work on a subscription?',
    answer:
      'Your plan refills your credit balance on every billing cycle. Starter tops you up to 100, Studio to 500, Scale to 2,500. Use them anywhere in the month. They reset on renewal.',
  },
  {
    question: "What's actually a 'credit'?",
    answer:
      'One credit reads one photo and generates eight captions, one for each major network. You decide which to keep, copy, or save.',
  },
  {
    question: 'What happens to unused credits at month end?',
    answer:
      'Each cycle starts with a fresh balance. We size the packs so most creators land within their plan; if you keep running out, stepping up to Studio or Scale is cheaper than running dry.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Cancel from Settings → Billing in two clicks. You keep access until the end of the cycle you already paid for, then we stop charging. No questions, no retention email maze.',
  },
  {
    question: 'Can I switch plans?',
    answer:
      "Anytime. Upgrades take effect immediately and your credit balance is topped up to the new plan's amount. Downgrades take effect at the next renewal.",
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Paid plans have a 14-day money-back window if it isn’t a fit. Email us. No support gauntlet.',
  },
  {
    question: 'Do I need a card to start?',
    answer:
      "No. You start with 10 free credits and don't enter card details. You only pay when you start a paid plan: Starter, Studio, or Scale.",
  },
  {
    question: 'Can my team or clients share a plan?',
    answer:
      "One login runs one account, and Scale's 2,500 monthly credits are built for agencies juggling several clients from a single seat. Dedicated seats and client workspaces are on the way; email us if you need them now and we will sort you out.",
  },
];
