import { CATEGORIES, type Category } from '@/lib/types';

interface CategoryTabsProps {
  selected: Category;
  onSelect: (category: Category) => void;
  preferredCategories?: Category[];
}

export default function CategoryTabs({
  selected,
  onSelect,
  preferredCategories = [],
}: CategoryTabsProps) {
  const preferred = new Set(preferredCategories);

  return (
    <nav className="border-b border-border px-6">
      <ul className="flex gap-0" role="tablist">
        {CATEGORIES.map(({ id, label }) => (
          <li key={id} role="presentation">
            <button
              role="tab"
              aria-selected={selected === id}
              onClick={() => onSelect(id)}
              className={[
                'flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors',
                'border-b-2 -mb-px',
                selected === id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
              {preferred.has(id) && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  aria-label="preferred"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
