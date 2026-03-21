import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-white/20 font-playfair mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Página no encontrada</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Home className="w-4 h-4 mr-2" />Ir al Catálogo
            </Button>
          </Link>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />Volver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
