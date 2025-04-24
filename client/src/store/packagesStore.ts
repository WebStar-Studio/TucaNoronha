import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Package, InsertPackage } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

type PackagesState = {
  packages: Package[];
  featuredPackages: Package[];
  isLoading: boolean;
  error: string | null;
  loadPackages: () => Promise<void>;
  loadFeaturedPackages: () => Promise<void>;
  getPackageById: (id: number) => Promise<Package | null>;
  createPackage: (pkg: InsertPackage) => Promise<Package | null>;
  updatePackage: (id: number, pkg: Partial<InsertPackage>) => Promise<Package | null>;
  deletePackage: (id: number) => Promise<boolean>;
  clearError: () => void;
};

export const usePackagesStore = create<PackagesState>((set, get) => ({
  packages: [],
  featuredPackages: [],
  isLoading: false,
  error: null,

  loadPackages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        packages: data as Package[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  loadFeaturedPackages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('featured', true)
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        featuredPackages: data as Package[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  getPackageById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Package;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  createPackage: async (pkg) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([pkg])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        packages: [...state.packages, data as Package],
        isLoading: false 
      }));

      // If the package is featured, update featured packages
      if (pkg.featured) {
        set(state => ({ 
          featuredPackages: [...state.featuredPackages, data as Package] 
        }));
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      
      return data as Package;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  updatePackage: async (id, pkg) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(pkg)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        packages: state.packages.map(p => 
          p.id === id ? { ...p, ...data } as Package : p
        ),
        featuredPackages: state.featuredPackages.map(p => 
          p.id === id ? { ...p, ...data } as Package : p
        ),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages', id.toString()] });
      
      return data as Package;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  deletePackage: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        packages: state.packages.filter(p => p.id !== id),
        featuredPackages: state.featuredPackages.filter(p => p.id !== id),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      
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
