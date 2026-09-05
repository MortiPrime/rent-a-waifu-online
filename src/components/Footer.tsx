import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const linkClass = 'text-surface-foreground/60 transition-colors hover:text-brand';

const Footer = () => (
  <footer className="mt-16 border-t border-surface-border/10 bg-surface/[0.04] backdrop-blur-md">
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-6 w-6 text-brand" />
            <span className="editorial-title text-2xl">AnimeDating</span>
          </div>
          <p className="max-w-xs text-sm text-surface-foreground/60">
            Conecta con personas reales y auténticas en un ambiente seguro y respetuoso.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-[0.22em] text-surface-foreground/50">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className={linkClass}>Catálogo</Link></li>
            <li><Link to="/become-companion" className={linkClass}>Ser Companion</Link></li>
            <li><Link to="/donations" className={linkClass}>Donaciones</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-[0.22em] text-surface-foreground/50">Legal</h4>
          <ul className="space-y-2 text-sm text-surface-foreground/60">
            <li>Términos y Condiciones</li>
            <li>Política de Privacidad</li>
            <li>Contacto: soporte@animedating.com</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-surface-border/10 pt-6 text-center">
        <p className="text-sm text-surface-foreground/40">
          © {new Date().getFullYear()} AnimeDating. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
