import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Minus, ImageIcon, Code, ExternalLink, Table, Highlighter
} from 'lucide-react';
import { SlashCommandItem } from './SlashCommandExtension';

const iconMap: Record<string, any> = {
  Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Minus, ImageIcon, Code, ExternalLink, Table, Highlighter,
};

interface SlashCommandMenuProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashCommandMenu = forwardRef<any, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) command(item);
      },
      [items, command]
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev + 1) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => {
      const el = containerRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    if (items.length === 0) {
      return (
        <div className="z-50 w-64 rounded-lg border bg-popover p-2 shadow-lg">
          <p className="text-xs text-muted-foreground px-2 py-1">No results</p>
        </div>
      );
    }

    // Group by category
    const grouped: Record<string, SlashCommandItem[]> = {};
    items.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    let globalIndex = 0;

    return (
      <div
        ref={containerRef}
        className="z-50 w-64 max-h-72 overflow-y-auto rounded-lg border bg-popover shadow-lg"
      >
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <p className="text-[10px] font-medium uppercase text-muted-foreground px-3 pt-2 pb-1 tracking-wider">
              {category}
            </p>
            {categoryItems.map((item) => {
              const index = globalIndex++;
              const Icon = iconMap[item.icon] || Type;
              return (
                <button
                  key={item.title}
                  data-index={index}
                  className={`flex items-center gap-3 w-full px-3 py-1.5 text-left text-sm transition-colors rounded-md mx-0 ${
                    index === selectedIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                  onClick={() => selectItem(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

SlashCommandMenu.displayName = 'SlashCommandMenu';
