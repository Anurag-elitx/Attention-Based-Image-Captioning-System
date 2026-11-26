import { useState } from 'react';
import type { FaqItem } from '../../data/landing';

interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number | null;
  numbered?: boolean;
}

export function FaqAccordion({
  items,
  defaultOpenIndex = 0,
  numbered = false,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="border-line border-t">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.question} className="border-line border-b">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-5.5 text-left transition-colors"
            >
              <span className="flex items-baseline gap-4">
                {numbered && item.num && (
                  <span className="text-muted font-mono text-[12px]">{item.num}</span>
                )}
                <span className="text-paper text-[16px] font-medium md:text-[17px]">
                  {item.question}
                </span>
              </span>

              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm transition-all duration-150 ${
                  isOpen
                    ? 'border-lime/40 bg-lime/12 text-lime'
                    : 'border-line-2 bg-ink-2 text-muted'
                }`}
                aria-hidden="true"
              >
                {isOpen ? '×' : '+'}
              </span>
            </button>

            {isOpen && (
              <div
                className={`text-paper-dim pb-6 text-[14.5px] leading-[1.65] ${
                  numbered ? 'pl-9' : ''
                } max-w-[740px]`}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
