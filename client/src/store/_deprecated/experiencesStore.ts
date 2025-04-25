import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Experience, InsertExperience } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

type ExperiencesState = {
  experiences: Experience[];
  featuredExperiences: Experience[];
  isLoading: boolean;
  error: string | null;
  loadExperiences: () => Promise<void>;
  loadFeaturedExperiences: () => Promise<void>;
  getExperienceById: (id: number) => Promise<Experience | null>;
  createExperience: (experience: InsertExperience) => Promise<Experience | null>;
  updateExperience: (id: number, experience: Partial<InsertExperience>) => Promise<Experience | null>;
  deleteExperience: (id: number) => Promise<boolean>;
  clearError: () => void;
};

export const useExperiencesStore = create<ExperiencesState>((set, get) => ({
  experiences: [],
  featuredExperiences: [],
  isLoading: false,
  error: null,

  loadExperiences: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        experiences: data as Experience[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  loadFeaturedExperiences: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('featured', true)
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        featuredExperiences: data as Experience[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  getExperienceById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Experience;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  createExperience: async (experience) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('experiences')
        .insert([experience])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        experiences: [...state.experiences, data as Experience],
        isLoading: false 
      }));

      // If the experience is featured, update featured experiences
      if (experience.featured) {
        set(state => ({ 
          featuredExperiences: [...state.featuredExperiences, data as Experience] 
        }));
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      
      return data as Experience;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  updateExperience: async (id, experience) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('experiences')
        .update(experience)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        experiences: state.experiences.map(exp => 
          exp.id === id ? { ...exp, ...data } as Experience : exp
        ),
        featuredExperiences: state.featuredExperiences.map(exp => 
          exp.id === id ? { ...exp, ...data } as Experience : exp
        ),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences', id.toString()] });
      
      return data as Experience;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  deleteExperience: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        experiences: state.experiences.filter(exp => exp.id !== id),
        featuredExperiences: state.featuredExperiences.filter(exp => exp.id !== id),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      
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
