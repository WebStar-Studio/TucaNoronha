import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Accommodation, InsertAccommodation } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

type AccommodationsState = {
  accommodations: Accommodation[];
  featuredAccommodations: Accommodation[];
  isLoading: boolean;
  error: string | null;
  loadAccommodations: () => Promise<void>;
  loadFeaturedAccommodations: () => Promise<void>;
  getAccommodationById: (id: number) => Promise<Accommodation | null>;
  createAccommodation: (accommodation: InsertAccommodation) => Promise<Accommodation | null>;
  updateAccommodation: (id: number, accommodation: Partial<InsertAccommodation>) => Promise<Accommodation | null>;
  deleteAccommodation: (id: number) => Promise<boolean>;
  clearError: () => void;
};

export const useAccommodationsStore = create<AccommodationsState>((set, get) => ({
  accommodations: [],
  featuredAccommodations: [],
  isLoading: false,
  error: null,

  loadAccommodations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        accommodations: data as Accommodation[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  loadFeaturedAccommodations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('featured', true)
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        featuredAccommodations: data as Accommodation[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  getAccommodationById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Accommodation;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  createAccommodation: async (accommodation) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .insert([accommodation])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        accommodations: [...state.accommodations, data as Accommodation],
        isLoading: false 
      }));

      // If the accommodation is featured, update featured accommodations
      if (accommodation.featured) {
        set(state => ({ 
          featuredAccommodations: [...state.featuredAccommodations, data as Accommodation] 
        }));
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations'] });
      
      return data as Accommodation;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  updateAccommodation: async (id, accommodation) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('accommodations')
        .update(accommodation)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        accommodations: state.accommodations.map(acc => 
          acc.id === id ? { ...acc, ...data } as Accommodation : acc
        ),
        featuredAccommodations: state.featuredAccommodations.map(acc => 
          acc.id === id ? { ...acc, ...data } as Accommodation : acc
        ),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations', id.toString()] });
      
      return data as Accommodation;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  deleteAccommodation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('accommodations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        accommodations: state.accommodations.filter(acc => acc.id !== id),
        featuredAccommodations: state.featuredAccommodations.filter(acc => acc.id !== id),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations'] });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return false;
    }
  },

  clearError: () => set({ error: null })
}));
