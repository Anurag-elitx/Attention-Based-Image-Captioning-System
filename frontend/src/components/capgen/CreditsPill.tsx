interface CreditsPillProps {
  credits: number;
  onClick?: () => void;
}

export function CreditsPill({ credits, onClick }: CreditsPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${credits} credits`}
      className="inline-flex h-[30px] cursor-pointer items-center gap-2 rounded-full border border-[#3a4a1c] bg-[#161c0d] px-3.5 font-mono text-[12px] font-medium tracking-[0.02em] text-lime transition-colors duration-150 hover:border-lime/60"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
      <span>{credits} credits</span>
    </button>
  );
}
