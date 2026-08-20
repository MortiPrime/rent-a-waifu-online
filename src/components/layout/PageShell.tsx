import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageShellProps {
  children: ReactNode;
  /** Ancho máximo del contenedor interno */
  width?: 'default' | 'narrow' | 'wide';
  /** Oculta el footer (por ejemplo en páginas de pantalla completa) */
  hideFooter?: boolean;
  className?: string;
}

const widths: Record<NonNullable<PageShellProps['width']>, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1600px]',
};

/**
 * Contenedor visual compartido por todas las páginas:
 * fondo degradado de marca + halos difusos + navbar y footer.
 */
const PageShell = ({ children, width = 'default', hideFooter = false, className }: PageShellProps) => (
  <div className="relative min-h-screen flex flex-col bg-gradient-app">
    {/* Halos decorativos */}
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-brand-glow/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-info/10 blur-3xl" />
    </div>

    <Navbar />

    <main className={cn('relative flex-1 pt-24 pb-16 px-4', className)}>
      <div className={cn('mx-auto w-full', widths[width])}>{children}</div>
    </main>

    {!hideFooter && (
      <div className="relative">
        <Footer />
      </div>
    )}
  </div>
);

export default PageShell;
