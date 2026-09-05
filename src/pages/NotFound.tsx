import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageShell className="flex items-center justify-center">
      <div className="px-4 text-center">
        <h1 className="editorial-title mb-2 text-9xl text-surface-foreground/20">404</h1>
        <h2 className="editorial-title mb-4 text-3xl">Página no encontrada</h2>
        <p className="mx-auto mb-8 max-w-md text-surface-foreground/60">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button className="brand-button">
              <Home className="mr-2 h-4 w-4" />Ir al Catálogo
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-surface-border/30 text-surface-foreground hover:bg-surface/10"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />Volver
          </Button>
        </div>
      </div>
    </PageShell>
  );
};

export default NotFound;
