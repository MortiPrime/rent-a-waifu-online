import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

/** Cuadrícula bento de 6 columnas en escritorio. */
export const BentoGrid = ({ children, className }: BentoGridProps) => (
  <div className={cn('bento-grid', className)}>{children}</div>
);

type TileSize = 'sm' | 'md' | 'lg' | 'full';
type TileTone = 'default' | 'accent' | 'gold';

interface BentoTileProps {
  children: ReactNode;
  /** sm = 2 col, md = 3 col, lg = 4 col, full = 6 col */
  size?: TileSize;
  tone?: TileTone;
  className?: string;
}

const sizes: Record<TileSize, string> = {
  sm: 'lg:col-span-2',
  md: 'lg:col-span-3',
  lg: 'lg:col-span-4',
  full: 'sm:col-span-2 lg:col-span-6',
};

const tones: Record<TileTone, string> = {
  default: '',
  accent: 'bento-tile-accent',
  gold: 'bento-tile-gold',
};

export const BentoTile = ({ children, size = 'sm', tone = 'default', className }: BentoTileProps) => (
  <div className={cn('bento-tile animate-fade-up', sizes[size], tones[tone], className)}>{children}</div>
);

export default BentoGrid;
