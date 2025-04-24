import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { VehicleRental, InsertVehicleRental } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

type VehiclesState = {
  vehicles: VehicleRental[];
  isLoading: boolean;
  error: string | null;
  loadVehicles: () => Promise<void>;
  getVehicleById: (id: number) => Promise<VehicleRental | null>;
  createVehicle: (vehicle: InsertVehicleRental) => Promise<VehicleRental | null>;
  updateVehicle: (id: number, vehicle: Partial<InsertVehicleRental>) => Promise<VehicleRental | null>;
  deleteVehicle: (id: number) => Promise<boolean>;
  clearError: () => void;
};

export const useVehiclesStore = create<VehiclesState>((set, get) => ({
  vehicles: [],
  isLoading: false,
  error: null,

  loadVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vehicle_rentals')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      set({ 
        vehicles: data as VehicleRental[],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },

  getVehicleById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('vehicle_rentals')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as VehicleRental;
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },

  createVehicle: async (vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vehicle_rentals')
        .insert([vehicle])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        vehicles: [...state.vehicles, data as VehicleRental],
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      
      return data as VehicleRental;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  updateVehicle: async (id, vehicle) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('vehicle_rentals')
        .update(vehicle)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        vehicles: state.vehicles.map(v => 
          v.id === id ? { ...v, ...data } as VehicleRental : v
        ),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles', id.toString()] });
      
      return data as VehicleRental;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },

  deleteVehicle: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('vehicle_rentals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      set(state => ({ 
        vehicles: state.vehicles.filter(v => v.id !== id),
        isLoading: false 
      }));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      
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
