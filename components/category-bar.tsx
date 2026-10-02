"use client";

type CategoryBarProps = {
  categories: string[];
  selected: string;
  counts: Record<string, number>;
  onSelect: (category: string) => void;
};

export function CategoryBar({ categories, selected, counts, onSelect }: CategoryBarProps) {
  return (
    <div className="relative">
      <div
        role="tablist"
        aria-label="Video categories"
        className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-1 md:mx-0 md:px-0"
      >
        {categories.map((category) => {
          const active = category === selected;
          const count = counts[category] ?? 0;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(category)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                active
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "bg-surface-raised text-foreground/80 hover:bg-surface-hover hover:text-accent"
              }`}
            >
              {category}
              {count > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs tabular-nums ${
                    active ? "bg-white/20 text-white/90" : "text-muted"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
