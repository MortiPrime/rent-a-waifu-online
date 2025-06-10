
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanionListing, LocationFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCompanionListings = () => {
  const [listings, setListings] = useState<CompanionListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
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
      
      // Primero verificar si hay companion_profiles activos (sin filtro de status)
      const { data: profilesData, error: profilesError } = await supabase
        .from('companion_profiles')
        .select('*')
        .eq('is_active', true);

      if (profilesError) {
        console.error('Error cargando companion_profiles:', profilesError);
      } else {
        console.log('Companion profiles activos encontrados:', profilesData?.length || 0);
        console.log('Sample profiles:', profilesData?.slice(0, 2));
      }

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
      if (filters?.municipality && filters.municipality !== 'all' && filters.municipality !== '') {
        query = query.eq('municipality', filters.municipality);
      }
      if (filters?.phoneNumber && filters.phoneNumber.trim() !== '') {
        query = query.ilike('contact_number', `%${filters.phoneNumber}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error en query de companion_listings:', error);
        throw error;
      }
      
      console.log('Companion listings encontrados:', data?.length || 0);
      console.log('Datos de listings:', data);
      
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
      
      // Cargar estados únicos desde companion_listings
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

      // Cargar municipios únicos desde companion_listings
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

  // Nueva función para cargar todas las listings sin filtros
  const loadAllListings = async () => {
    try {
      setLoading(true);
      console.log('Cargando todas las listings...');
      
      // Debug: verificar companion_profiles primero (sin filtro de status)
      const { data: profilesCheck } = await supabase
        .from('companion_profiles')
        .select('id, stage_name, status, is_active')
        .eq('is_active', true)
        .limit(10);
      
      console.log('Sample companion_profiles activos:', profilesCheck);
      
      const { data, error } = await supabase
        .from('companion_listings')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando todas las listings:', error);
        throw error;
      }
      
      console.log('Todas las listings cargadas:', data?.length || 0);
      console.log('Sample listings data:', data?.slice(0, 2));
      setListings(data as CompanionListing[]);
    } catch (error: any) {
      console.error('Error loading all listings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las companions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    listings,
    loading,
    states,
    municipalities,
    loadListings,
    loadLocations,
    loadAllListings,
  };
};
