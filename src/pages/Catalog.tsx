import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCompanionListings, CompanionListingWithPhotos } from '@/hooks/useCompanionListings';
import { useListingRatings } from '@/hooks/useReviews';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, LogIn, UserPlus, Star, Sparkles } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import SectionHeading from '@/components/layout/SectionHeading';
import EmptyState from '@/components/EmptyState';
import CompanionCatalogView from '@/components/CompanionCatalogView';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import CompanionProfileModal from '@/components/CompanionProfileModal';
import CatalogFilters, { CatalogFilterValues } from '@/components/catalog/CatalogFilters';
import CompanionCard from '@/components/catalog/CompanionCard';
import { CatalogSkeletonGrid } from '@/components/CatalogCardSkeleton';

const PAGE_SIZE = 12;

const INITIAL_FILTERS: CatalogFilterValues = {
  state: '',
  municipality: '',
  nameSearch: '',
  planFilter: '',
  sortBy: 'newest',
  ageRange: [18, 60],
};

const Catalog = () => {
  const { user, profile } = useAuth();
  const { listings, loading, loadListings, loadAllListings } = useCompanionListings();
  const { ratings, fetchRatings } = useListingRatings();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [selectedCompanion, setSelectedCompanion] = useState<CompanionListingWithPhotos | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filters, setFilters] = useState<CatalogFilterValues>(INITIAL_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const isCompanion = !!user && profile?.user_role === 'girlfriend';

  useEffect(() => {
    if (!isCompanion) loadAllListings();
  }, [isCompanion]);

  useEffect(() => {
    if (listings.length > 0) fetchRatings(listings.map((l) => l.id));
  }, [listings]);

  useEffect(() => {
    if (isCompanion) return;
    if (filters.state || filters.municipality) {
      const timeoutId = setTimeout(() => {
        loadListings({ state: filters.state, municipality: filters.municipality, phoneNumber: '' });
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    loadAllListings();
  }, [filters.state, filters.municipality, isCompanion]);

  const handleFilterChange = <K extends keyof CatalogFilterValues>(key: K, value: CatalogFilterValues[K]) => {
    setVisibleCount(PAGE_SIZE);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'state' ? { municipality: '' } : {}),
    }));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setVisibleCount(PAGE_SIZE);
  };

  const filteredCompanions = useMemo(() => {
    let result = [...(listings || [])];

    if (filters.nameSearch.trim()) {
      const term = filters.nameSearch.toLowerCase();
      result = result.filter((c) => c.stage_name?.toLowerCase().includes(term));
    }
    if (filters.ageRange[0] > 18 || filters.ageRange[1] < 60) {
      result = result.filter((c) => c.age >= filters.ageRange[0] && c.age <= filters.ageRange[1]);
    }
    if (filters.planFilter && filters.planFilter !== 'all') {
      result = result.filter((c) => (c.promotion_plan || 'basic') === filters.planFilter);
    }

    if (filters.sortBy === 'best_rated') {
      result.sort((a, b) => (ratings.get(b.id)?.average || 0) - (ratings.get(a.id)?.average || 0));
    } else if (filters.sortBy === 'youngest') {
      result.sort((a, b) => a.age - b.age);
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => b.age - a.age);
    }

    return result;
  }, [listings, filters, ratings]);

  const visibleCompanions = filteredCompanions.slice(0, visibleCount);

  if (isCompanion) {
    return (
      <PageShell>
        <CompanionCatalogView />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SectionHeading
        title="Encuentra tu"
        highlight="Companion Perfecta"
        subtitle="Conecta con personas reales y auténticas en un ambiente seguro y respetuoso. Descubre conversaciones significativas y experiencias únicas."
      >
        {!user && (
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="brand-button px-8">
                <LogIn className="mr-2 h-5 w-5" />Iniciar Sesión
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="border-surface-border/30 bg-surface/10 px-8 text-surface-foreground hover:bg-surface/20"
              >
                <UserPlus className="mr-2 h-5 w-5" />Registrarse
              </Button>
            </Link>
          </div>
        )}
      </SectionHeading>

      <AnnouncementBanner location="catalog" />

      <CatalogFilters
        values={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
        resultCount={filteredCompanions.length}
      />

      {user && profile?.user_role === 'client' && (
        <Card className="mb-8 border-success/30 bg-success/15">
          <CardContent className="flex items-center justify-center gap-3 p-5 text-center">
            <Sparkles className="h-5 w-5 shrink-0 text-success" />
            <p className="text-surface-foreground/90">
              <span className="font-semibold">¡Acceso completo y gratuito!</span> Ves todos los perfiles y su
              información de contacto sin costo.
            </p>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card className="surface-card mb-8">
          <CardContent className="p-6 text-center">
            <h3 className="mb-2 text-xl font-semibold text-surface-foreground">¿Quieres ser Companion?</h3>
            <p className="mb-4 text-surface-foreground/70">
              Únete a la plataforma y comienza a conectar con personas increíbles.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/become-companion">
                <Button className="brand-button">
                  <Star className="mr-2 h-4 w-4" />Ser Companion
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="border-surface-border/30 text-surface-foreground hover:bg-surface/10">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <CatalogSkeletonGrid />
      ) : filteredCompanions.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No se encontraron companions"
          description="Ninguna companion coincide con los filtros aplicados. Prueba ampliando la búsqueda."
        >
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-surface-border/30 text-surface-foreground hover:bg-surface/10"
          >
            Limpiar filtros
          </Button>
        </EmptyState>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleCompanions.map((companion, index) => (
              <CompanionCard
                key={companion.id}
                companion={companion}
                index={index % PAGE_SIZE}
                rating={ratings.get(companion.id)}
                isAuthenticated={!!user}
                isFavorite={isFavorite(companion.id)}
                onToggleFavorite={toggleFavorite}
                onViewProfile={(c) => {
                  setSelectedCompanion(c);
                  setProfileModalOpen(true);
                }}
              />
            ))}
          </div>

          {visibleCount < filteredCompanions.length && (
            <div className="mt-10 text-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="border-surface-border/30 bg-surface/10 text-surface-foreground hover:bg-surface/20"
              >
                Cargar más ({filteredCompanions.length - visibleCount} restantes)
              </Button>
            </div>
          )}
        </>
      )}

      <CompanionProfileModal
        companion={selectedCompanion}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        canSeeContact={!!user}
      />
    </PageShell>
  );
};

export default Catalog;
