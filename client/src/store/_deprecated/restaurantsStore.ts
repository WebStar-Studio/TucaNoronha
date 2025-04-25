import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Restaurant, InsertRestaurant } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

type RestaurantsState = {
  restaurants: Restaurant[];
  featuredRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  loadRestaurants: () => Promise<void>;
  loadFeaturedRestaurants: () => Promise<void>;
  getRestaurantById: (id: number) => Promise<Restaurant | null>;
  createRestaurant: (restaurant: InsertRestaurant) => Promise<Restaurant | null>;
  updateRestaurant: (id: number, restaurant: Partial<InsertRestaurant>) => Promise<Restaurant | null>;
  deleteRestaurant: (id: number) => Promise<boolean>;
  clearError: () => void;
};

export const useRestaurantsStore = create<RestaurantsState>((set, get) => ({
  restaurants: [],
  featuredRestaurants: [],
  isLoading: false,
  error: null,

  loadRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        restaurants: data as Restaurant[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  loadFeaturedRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('featured', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        featuredRestaurants: data as Restaurant[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  getRestaurantById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Restaurant;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  createRestaurant: async (restaurant) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([restaurant])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        restaurants: [...state.restaurants, data as Restaurant],
        isLoading: false 
      }));

      // If the restaurant is featured, update featured restaurants
      if (restaurant.featured) {
        set(state => ({ 
          featuredRestaurants: [...state.featuredRestaurants, data as Restaurant] 
        }));
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/restaurants'] });
      
      return data as Restaurant;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  updateRestaurant: async (id, restaurant) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(restaurant)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        restaurants: state.restaurants.map(r => 
          r.id === id ? { ...r, ...data } as Restaurant : r
        ),
        featuredRestaurants: state.featuredRestaurants.map(r => 
          r.id === id ? { ...r, ...data } as Restaurant : r
        ),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['/api/restaurants', id.toString()] });
      
      return data as Restaurant;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  deleteRestaurant: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        restaurants: state.restaurants.filter(r => r.id !== id),
        featuredRestaurants: state.featuredRestaurants.filter(r => r.id !== id),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/restaurants'] });
      
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
