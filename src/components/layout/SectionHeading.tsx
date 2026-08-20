import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: ReactNode;
  /** Segunda línea resaltada con el degradado de marca */
  highlight?: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  size?: 'lg' | 'md';
  className?: string;
  children?: ReactNode;
}

const SectionHeading = ({
  title,
  highlight,
  subtitle,
  align = 'center',
  size = 'lg',
  className,
  children,
}: SectionHeadingProps) => (
  <div
    className={cn(
      'mb-10',
      align === 'center' ? 'text-center' : 'text-left',
      className,
    )}
  >
    <h1
      className={cn(
        'font-playfair font-bold text-surface-foreground',
        size === 'lg' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl',
      )}
    >
      {title}
      {highlight && <span className="block brand-gradient-text">{highlight}</span>}
    </h1>
    {subtitle && (
      <p
        className={cn(
          'mt-4 text-surface-foreground/70 text-lg',
          align === 'center' && 'mx-auto max-w-3xl',
        )}
      >
        {subtitle}
      </p>
    )}
    {children && <div className="mt-6">{children}</div>}
  </div>
);

export default SectionHeading;
