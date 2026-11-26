interface StatCell {
  label: string;
  value: string | number;
  note: string;
  accentValue?: boolean;
  progressPercent?: number;
}

interface StatCardProps {
  cells: StatCell[];
}

export function StatCard({ cells }: StatCardProps) {
  return (
    <div className="bg-ink-2 border-line grid grid-cols-1 divide-y divide-line overflow-hidden rounded-[20px] border sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
      {cells.map((cell) => (
        <div key={cell.label} className="flex flex-col justify-between px-6 py-5.5">
          <div>
            <div className="text-muted font-mono text-[10px] tracking-[0.14em] uppercase">
              {cell.label}
            </div>
            <div
              className={`font-instrument-serif mt-3 text-[36px] leading-none tracking-[-0.02em] ${
                cell.accentValue ? 'text-lime' : 'text-paper'
              }`}
            >
              {cell.value}
            </div>
            <div className="text-paper-dim mt-2 text-[12px]">{cell.note}</div>
          </div>

          {typeof cell.progressPercent === 'number' && (
            <div className="bg-line mt-4 h-[2px] w-full overflow-hidden rounded-full">
              <div
                className="bg-lime h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, cell.progressPercent))}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
