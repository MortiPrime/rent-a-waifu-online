
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanionListing, CompanionPhoto, LocationFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CompanionListingWithPhotos extends CompanionListing {
  photos?: CompanionPhoto[];
  primary_photo_url?: string;
}

export const useCompanionListings = () => {
  const [listings, setListings] = useState<CompanionListingWithPhotos[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchPhotosForListings = async (companionListings: CompanionListing[]): Promise<CompanionListingWithPhotos[]> => {
    if (companionListings.length === 0) return [];

    // Fetch all photos for active companions
    const companionIds = companionListings.map(l => l.companion_id).filter(Boolean);
    const userIds = companionListings.map(l => l.user_id).filter(Boolean);
    
    // Try fetching by companion_id first, then by matching user_id to companion profiles
    let photos: CompanionPhoto[] = [];
    
    if (companionIds.length > 0 && companionIds.some(id => id != null)) {
      const { data } = await supabase
        .from('companion_photos')
        .select('*')
        .in('companion_id', companionIds.filter(id => id != null))
        .order('display_order', { ascending: true });
      photos = (data || []) as CompanionPhoto[];
    }

    // If no photos found by companion_id, try via companion_profiles
    if (photos.length === 0 && userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('companion_profiles')
        .select('id, user_id')
        .in('user_id', userIds);
      
      if (profiles && profiles.length > 0) {
        const profileIds = profiles.map(p => p.id);
        const { data } = await supabase
          .from('companion_photos')
          .select('*')
          .in('companion_id', profileIds)
          .order('display_order', { ascending: true });
        
        photos = (data || []) as CompanionPhoto[];
        
        // Map companion_id to user_id for matching
        const profileUserMap = new Map(profiles.map(p => [p.id, p.user_id]));
        return companionListings.map(listing => {
          const profile = profiles.find(p => p.user_id === listing.user_id);
          const listingPhotos = profile ? photos.filter(p => p.companion_id === profile.id) : [];
          const primaryPhoto = listingPhotos.find(p => p.is_primary) || listingPhotos[0];
          return {
            ...listing,
            photos: listingPhotos,
            primary_photo_url: primaryPhoto?.photo_url
          };
        });
      }
    }

    // Map photos to listings by companion_id
    const photosByCompanion = new Map<string, CompanionPhoto[]>();
    photos.forEach(photo => {
      const existing = photosByCompanion.get(photo.companion_id) || [];
      existing.push(photo);
      photosByCompanion.set(photo.companion_id, existing);
    });

    return companionListings.map(listing => {
      const listingPhotos = listing.companion_id ? (photosByCompanion.get(listing.companion_id) || []) : [];
      const primaryPhoto = listingPhotos.find(p => p.is_primary) || listingPhotos[0];
      return {
        ...listing,
        photos: listingPhotos,
        primary_photo_url: primaryPhoto?.photo_url
      };
    });
  };

  const loadListings = useCallback(async (filters?: LocationFilter) => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      let query = supabase
        .from('companion_listings')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

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
      if (error) throw error;
      
      const withPhotos = await fetchPhotosForListings((data || []) as CompanionListing[]);
      setListings(withPhotos);
    } catch (error: any) {
      console.error('Error loading listings:', error);
      toast({ title: "Error", description: "No se pudieron cargar las companions", variant: "destructive" });
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [toast, loading]);

  const loadLocations = useCallback(async () => {
    try {
      const { data: statesData } = await supabase
        .from('companion_listings')
        .select('state')
        .not('state', 'is', null)
        .eq('is_active', true);

      const uniqueStates = [...new Set(statesData?.map(item => item.state).filter(Boolean) || [])];
      setStates(uniqueStates);

      const { data: municipalitiesData } = await supabase
        .from('companion_listings')
        .select('municipality')
        .not('municipality', 'is', null)
        .eq('is_active', true);

      const uniqueMunicipalities = [...new Set(municipalitiesData?.map(item => item.municipality).filter(Boolean) || [])];
      setMunicipalities(uniqueMunicipalities);
    } catch (error: any) {
      console.error('Error loading locations:', error);
    }
  }, []);

  const loadAllListings = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('companion_listings')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('promotion_plan', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const withPhotos = await fetchPhotosForListings((data || []) as CompanionListing[]);
      setListings(withPhotos);
    } catch (error: any) {
      console.error('Error loading all listings:', error);
      toast({ title: "Error", description: "No se pudieron cargar las companions", variant: "destructive" });
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

