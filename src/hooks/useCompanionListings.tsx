
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
    loadAllListings();
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
      setListings(data as CompanionListing[] || []);
    } catch (error: any) {
      console.error('Error loading listings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las companions",
        variant: "destructive",
      });
      setListings([]);
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
  };

  const loadAllListings = async () => {
    try {
      setLoading(true);
      console.log('Cargando todas las listings...');
      
      // Verificar y sincronizar companion_profiles con companion_listings
      const { data: profilesCheck } = await supabase
        .from('companion_profiles')
        .select('id, stage_name, status, is_active')
        .eq('is_active', true)
        .in('status', ['approved', 'Activa']);
      
      console.log('Companion_profiles activos encontrados:', profilesCheck?.length || 0);
      
      if (profilesCheck && profilesCheck.length > 0) {
        // Verificar cuáles no tienen listing
        const { data: existingListings } = await supabase
          .from('companion_listings')
          .select('companion_id')
          .in('companion_id', profilesCheck.map(p => p.id));
        
        const existingIds = existingListings?.map(l => l.companion_id) || [];
        const missingProfiles = profilesCheck.filter(p => !existingIds.includes(p.id));
        
        if (missingProfiles.length > 0) {
          console.log('Perfiles sin listing encontrados:', missingProfiles.length);
          
          // Crear listings faltantes
          for (const profile of missingProfiles) {
            console.log('Creando listing para perfil:', profile.id);
            
            try {
              // Obtener datos completos del perfil
              const { data: fullProfile } = await supabase
                .from('companion_profiles')
                .select('*')
                .eq('id', profile.id)
                .single();
              
              if (fullProfile) {
                const listingData = {
                  companion_id: fullProfile.id,
                  user_id: fullProfile.user_id,
                  stage_name: fullProfile.stage_name,
                  description: fullProfile.description,
                  age: fullProfile.age,
                  state: fullProfile.state,
                  city: fullProfile.city,
                  municipality: fullProfile.municipality,
                  contact_number: fullProfile.contact_number,
                  pricing: fullProfile.pricing,
                  promotion_plan: fullProfile.promotion_plan || 'basic',
                  is_active: fullProfile.is_active,
                  updated_at: new Date().toISOString()
                };
                
                const { error: insertError } = await supabase
                  .from('companion_listings')
                  .insert(listingData);
                
                if (insertError) {
                  console.error('Error creando listing:', insertError);
                } else {
                  console.log('Listing creado exitosamente para perfil:', profile.id);
                }
              }
            } catch (profileError) {
              console.error('Error obteniendo perfil completo:', profileError);
            }
          }
        }
      }
      
      // Cargar TODAS las listings activas
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
      setListings(data as CompanionListing[] || []);
    } catch (error: any) {
      console.error('Error loading all listings:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las companions",
        variant: "destructive",
      });
      setListings([]);
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
