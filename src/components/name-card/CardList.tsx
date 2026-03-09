import { cn } from "@/lib/utils";
import type { Person } from "./types";

interface CardListProps {
  people: Person[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function CardList({ people, selectedId, onSelect }: CardListProps) {
  return (
    <div className="flex flex-col gap-1">
      {people.map((p, i) => {
        const isActive = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 border-none rounded-lg cursor-pointer text-left transition-all border-l-[3px]",
              isActive
                ? "bg-accent border-l-primary"
                : "bg-transparent border-l-transparent hover:bg-muted"
            )}
          >
            <span
              className={cn(
                "w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-primary-foreground",
                isActive ? "bg-primary" : "bg-muted-foreground/40"
              )}
            >
              {i + 1}
            </span>
            <div className="overflow-hidden min-w-0">
              <div
                className={cn(
                  "text-xs font-medium truncate",
                  isActive ? "font-bold text-primary" : "text-foreground"
                )}
              >
                {p.name}
              </div>
              <div className="text-[10.5px] text-muted-foreground mt-0.5">
                {p.chucDanh}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
