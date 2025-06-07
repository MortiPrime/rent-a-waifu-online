
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanionListing, LocationFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCompanionListings = () => {
  const [listings, setListings] = useState<CompanionListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadListings();
    loadLocations();
  }, []);

  const loadListings = async (filters?: LocationFilter) => {
    try {
      setLoading(true);
      console.log('Cargando listings con filtros:', filters);
      
      let query = supabase
        .from('companion_listings')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      // Aplicar filtros solo si tienen valores válidos y no son 'all'
      if (filters?.state && filters.state !== 'all' && filters.state !== '') {
        query = query.eq('state', filters.state);
      }
      if (filters?.city && filters.city !== 'all' && filters.city !== '') {
        query = query.eq('city', filters.city);
      }
      if (filters?.municipality && filters.municipality !== 'all' && filters.municipality !== '') {
        query = query.eq('municipality', filters.municipality);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error en query:', error);
        throw error;
      }
      
      console.log('Datos recibidos:', data);
      setListings(data as CompanionListing[]);
    } catch (error: any) {
      console.error('Error loading listings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las companions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      console.log('Cargando ubicaciones...');
      
      // Cargar estados únicos
      const { data: statesData, error: statesError } = await supabase
        .from('companion_listings')
        .select('state')
        .not('state', 'is', null)
        .eq('is_active', true);

      if (statesError) {
        console.error('Error cargando estados:', statesError);
      } else {
        const uniqueStates = [...new Set(statesData.map(item => item.state).filter(Boolean))];
        console.log('Estados encontrados:', uniqueStates);
        setStates(uniqueStates);
      }

      // Cargar ciudades únicas
      const { data: citiesData, error: citiesError } = await supabase
        .from('companion_listings')
        .select('city')
        .not('city', 'is', null)
        .eq('is_active', true);

      if (citiesError) {
        console.error('Error cargando ciudades:', citiesError);
      } else {
        const uniqueCities = [...new Set(citiesData.map(item => item.city).filter(Boolean))];
        console.log('Ciudades encontradas:', uniqueCities);
        setCities(uniqueCities);
      }

      // Cargar municipios únicos
      const { data: municipalitiesData, error: municipalitiesError } = await supabase
        .from('companion_listings')
        .select('municipality')
        .not('municipality', 'is', null)
        .eq('is_active', true);

      if (municipalitiesError) {
        console.error('Error cargando municipios:', municipalitiesError);
      } else {
        const uniqueMunicipalities = [...new Set(municipalitiesData.map(item => item.municipality).filter(Boolean))];
        console.log('Municipios encontrados:', uniqueMunicipalities);
        setMunicipalities(uniqueMunicipalities);
      }
    } catch (error: any) {
      console.error('Error loading locations:', error);
    }
  };

  return {
    listings,
    loading,
    states,
    cities,
    municipalities,
    loadListings,
    loadLocations,
  };
};
