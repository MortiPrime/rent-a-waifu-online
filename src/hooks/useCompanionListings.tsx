
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanionListing, LocationFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCompanionListings = () => {
  const [listings, setListings] = useState<CompanionListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const { toast } = useToast();

  const loadListings = useCallback(async (filters?: LocationFilter) => {
    if (loading) return; // Prevent multiple simultaneous requests
    
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
      
      // Ensure we always set an array, even if data is null
      const companionListings = data || [];
      setListings(companionListings as CompanionListing[]);
    } catch (error: any) {
      console.error('Error loading listings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las companions",
        variant: "destructive",
      });
      // Set empty array on error to prevent UI issues
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [toast, loading]);

  const loadLocations = useCallback(async () => {
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
        const uniqueStates = [...new Set(statesData?.map(item => item.state).filter(Boolean) || [])];
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
        const uniqueMunicipalities = [...new Set(municipalitiesData?.map(item => item.municipality).filter(Boolean) || [])];
        console.log('Municipios encontrados:', uniqueMunicipalities);
        setMunicipalities(uniqueMunicipalities);
      }
    } catch (error: any) {
      console.error('Error loading locations:', error);
    }
  }, []);

  const loadAllListings = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    try {
      setLoading(true);
      console.log('Cargando todas las listings...');
      
      // Cargar TODAS las listings activas directamente
      const { data, error } = await supabase
        .from('companion_listings')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('promotion_plan', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando todas las listings:', error);
        throw error;
      }
      
      console.log('Todas las listings cargadas:', data?.length || 0);
      
      // Ensure we always set an array, even if data is null
      const companionListings = data || [];
      setListings(companionListings as CompanionListing[]);
    } catch (error: any) {
      console.error('Error loading all listings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las companions",
        variant: "destructive",
      });
      // Set empty array on error to prevent UI issues
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [toast, loading]);

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
