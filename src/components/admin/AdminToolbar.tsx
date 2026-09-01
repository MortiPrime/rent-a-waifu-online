import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ToolbarFilter {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  width?: string;
}

interface AdminToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ToolbarFilter[];
  count: number;
  total: number;
  children?: ReactNode;
}

/** Barra de herramientas común: buscador + filtros + contador de resultados. */
const AdminToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters = [],
  count,
  total,
  children,
}: AdminToolbarProps) => (
  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-foreground/50" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="surface-input pl-9"
        />
      </div>

      {filters.map((filter) => (
        <Select key={filter.placeholder} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className={`surface-input ${filter.width ?? 'w-full sm:w-44'}`}>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover">
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap text-sm text-surface-foreground/60">
        {count} de {total}
      </span>
      {children}
    </div>
  </div>
);

export default AdminToolbar;
