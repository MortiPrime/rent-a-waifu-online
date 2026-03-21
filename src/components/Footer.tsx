import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-bold text-white">AnimeDating</span>
          </div>
          <p className="text-white/60 text-sm">
            Conecta con personas reales y auténticas en un ambiente seguro y respetuoso.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-white/60 hover:text-pink-400 transition-colors">Catálogo</Link></li>
            <li><Link to="/become-companion" className="text-white/60 hover:text-pink-400 transition-colors">Ser Companion</Link></li>
            <li><Link to="/donations" className="text-white/60 hover:text-pink-400 transition-colors">Donaciones</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="text-white/60">Términos y Condiciones</span></li>
            <li><span className="text-white/60">Política de Privacidad</span></li>
            <li><span className="text-white/60">Contacto: soporte@animedating.com</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-6 text-center">
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} AnimeDating. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
