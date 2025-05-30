
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
      let query = supabase
        .from('companion_listings')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.state) {
        query = query.eq('state', filters.state);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.municipality) {
        query = query.eq('municipality', filters.municipality);
      }

      const { data, error } = await query;

      if (error) throw error;
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
      // Cargar estados únicos
      const { data: statesData } = await supabase
        .from('companion_listings')
        .select('state')
        .not('state', 'is', null)
        .eq('is_active', true);

      if (statesData) {
        const uniqueStates = [...new Set(statesData.map(item => item.state).filter(Boolean))];
        setStates(uniqueStates);
      }

      // Cargar ciudades únicas
      const { data: citiesData } = await supabase
        .from('companion_listings')
        .select('city')
        .not('city', 'is', null)
        .eq('is_active', true);

      if (citiesData) {
        const uniqueCities = [...new Set(citiesData.map(item => item.city).filter(Boolean))];
        setCities(uniqueCities);
      }

      // Cargar municipios únicos
      const { data: municipalitiesData } = await supabase
        .from('companion_listings')
        .select('municipality')
        .not('municipality', 'is', null)
        .eq('is_active', true);

      if (municipalitiesData) {
        const uniqueMunicipalities = [...new Set(municipalitiesData.map(item => item.municipality).filter(Boolean))];
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
