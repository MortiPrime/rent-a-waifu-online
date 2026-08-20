import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { MEXICO_STATES, getMunicipalitiesByState } from '@/data/mexicoStates';

export interface CatalogFilterValues {
  state: string;
  municipality: string;
  nameSearch: string;
  planFilter: string;
  sortBy: string;
  ageRange: [number, number];
}

interface CatalogFiltersProps {
  values: CatalogFilterValues;
  onChange: <K extends keyof CatalogFilterValues>(key: K, value: CatalogFilterValues[K]) => void;
  onClear: () => void;
  resultCount: number;
}

const PLAN_LABELS: Record<string, string> = {
  basic: 'Básico',
  premium: 'Premium',
  vip: 'VIP',
};

const CatalogFilters = ({ values, onChange, onClear, resultCount }: CatalogFiltersProps) => {
  const [expanded, setExpanded] = useState(false);
  const municipalities = values.state ? getMunicipalitiesByState(values.state) : [];

  const chips: { label: string; onRemove: () => void }[] = [];
  if (values.state) chips.push({ label: values.state, onRemove: () => onChange('state', '') });
  if (values.municipality) chips.push({ label: values.municipality, onRemove: () => onChange('municipality', '') });
  if (values.planFilter && values.planFilter !== 'all')
    chips.push({ label: PLAN_LABELS[values.planFilter] ?? values.planFilter, onRemove: () => onChange('planFilter', '') });
  if (values.ageRange[0] > 18 || values.ageRange[1] < 60)
    chips.push({ label: `${values.ageRange[0]}-${values.ageRange[1]} años`, onRemove: () => onChange('ageRange', [18, 60]) });
  if (values.nameSearch.trim())
    chips.push({ label: `"${values.nameSearch.trim()}"`, onRemove: () => onChange('nameSearch', '') });

  return (
    <Card className="surface-card mb-8">
      <CardContent className="p-4 space-y-4">
        {/* Fila principal */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-foreground/50" />
            <Input
              placeholder="Buscar por nombre..."
              value={values.nameSearch}
              onChange={(e) => onChange('nameSearch', e.target.value)}
              className="pl-10 field-dark"
              aria-label="Buscar companion por nombre"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex lg:w-auto">
            <Select
              value={values.state || 'all'}
              onValueChange={(v) => onChange('state', v === 'all' ? '' : v)}
            >
              <SelectTrigger className="field-dark lg:w-44" aria-label="Estado">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-72">
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.keys(MEXICO_STATES).map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={values.sortBy} onValueChange={(v) => onChange('sortBy', v)}>
              <SelectTrigger className="field-dark lg:w-44" aria-label="Ordenar por">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="best_rated">Mejor valoradas</SelectItem>
                <SelectItem value="youngest">Menor edad</SelectItem>
                <SelectItem value="oldest">Mayor edad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setExpanded((v) => !v)}
            className="border-surface-border/30 bg-surface/5 text-surface-foreground hover:bg-surface/15"
            aria-expanded={expanded}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Más filtros
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Filtros avanzados */}
        {expanded && (
          <div className="grid grid-cols-1 gap-4 border-t border-surface-border/10 pt-4 md:grid-cols-3">
            <div>
              <Label className="text-surface-foreground/80">Municipio</Label>
              <Select
                value={values.municipality || 'all'}
                onValueChange={(v) => onChange('municipality', v === 'all' ? '' : v)}
                disabled={!values.state}
              >
                <SelectTrigger className="field-dark mt-1.5">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-72">
                  <SelectItem value="all">Todos</SelectItem>
                  {municipalities.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-surface-foreground/80">Plan</Label>
              <Select
                value={values.planFilter || 'all'}
                onValueChange={(v) => onChange('planFilter', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="field-dark mt-1.5">
                  <SelectValue placeholder="Todos los planes" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all">Todos los planes</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-surface-foreground/80">
                Edad: {values.ageRange[0]} - {values.ageRange[1]} años
              </Label>
              <div className="px-1 pt-4">
                <Slider
                  min={18}
                  max={60}
                  step={1}
                  value={values.ageRange}
                  onValueChange={(v) => onChange('ageRange', [v[0], v[1]] as [number, number])}
                />
              </div>
            </div>
          </div>
        )}

        {/* Chips activos + conteo */}
        <div className="flex flex-wrap items-center gap-2 border-t border-surface-border/10 pt-3">
          <span className="text-sm text-surface-foreground/60">
            {resultCount} companion{resultCount !== 1 ? 's' : ''}
          </span>
          {chips.map((chip) => (
            <Badge
              key={chip.label}
              className="cursor-pointer border-brand/30 bg-brand/15 text-surface-foreground hover:bg-brand/25"
              onClick={chip.onRemove}
            >
              {chip.label}
              <X className="ml-1.5 h-3 w-3" />
            </Badge>
          ))}
          {chips.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="ml-auto h-7 text-surface-foreground/70 hover:bg-surface/10 hover:text-surface-foreground"
            >
              Limpiar todo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CatalogFilters;
