import { LayoutGrid, List, Search } from 'lucide-react';

interface CollectionsToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (val: 'newest' | 'oldest') => void;
  viewMode: 'grid' | 'list';
  onViewChange: (val: 'grid' | 'list') => void;
  activeFilter: string;
  onFilterChange: (val: string) => void;
  totalCount: number;
}

export function CollectionsToolbar({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  viewMode,
  onViewChange,
  activeFilter,
  onFilterChange,
  totalCount,
}: CollectionsToolbarProps) {
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="text-muted mb-2 font-mono text-[10.5px] tracking-[0.16em] uppercase">
            THE ARCHIVE
          </div>
          <h2 className="font-instrument-serif text-paper m-0 text-[40px] leading-none tracking-[-0.02em] md:text-[44px]">
            Your <span className="text-lime italic">collections</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search input */}
          <div className="relative flex-1 sm:flex-initial">
            <Search
              size={14}
              className="text-muted pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search captions, tags..."
              className="bg-ink-2 border-line text-paper placeholder:text-muted focus:border-line-2 w-full rounded-full border py-2 pr-4 pl-9 text-[12.5px] transition-colors outline-none sm:w-[220px]"
            />
          </div>

          {/* Sort segmented toggle */}
          <div
            role="group"
            aria-label="Sort order"
            className="bg-ink-2 border-line inline-flex items-center rounded-full border p-0.5"
          >
            {(['newest', 'oldest'] as const).map((opt) => {
              const active = sortOrder === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSortChange(opt)}
                  className={`cursor-pointer rounded-full border-0 px-3.5 py-1.5 text-[12px] font-medium capitalize transition-colors duration-150 ${
                    active ? 'bg-paper text-ink' : 'text-paper-dim hover:text-paper bg-transparent'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* View segmented toggle */}
          <div
            role="group"
            aria-label="View layout"
            className="bg-ink-2 border-line inline-flex items-center rounded-full border p-0.5"
          >
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                viewMode === 'grid'
                  ? 'bg-paper text-ink'
                  : 'text-paper-dim hover:text-paper bg-transparent'
              }`}
            >
              <LayoutGrid size={12} aria-hidden="true" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
                viewMode === 'list'
                  ? 'bg-paper text-ink'
                  : 'text-paper-dim hover:text-paper bg-transparent'
              }`}
            >
              <List size={12} aria-hidden="true" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter chip & item count row */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterChange('All')}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
              activeFilter === 'All'
                ? 'border-paper bg-paper text-ink'
                : 'border-line bg-ink-2 text-paper-dim hover:text-paper'
            }`}
          >
            All
          </button>
        </div>

        <div className="text-muted font-mono text-[10.5px] tracking-[0.14em] uppercase">
          {totalCount} ITEMS · SORTED BY {sortOrder.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
