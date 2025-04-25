import { create } from 'zustand';
import { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

// Define travel preferences interface
export interface TravelPreferences {
  travelDates?: { from: Date; to: Date };
  groupSize?: number;
  travelInterests?: string[];
  accommodationPreference?: string;
  dietaryRestrictions?: string[];
  activityLevel?: string;
  transportPreference?: string;
  specialRequirements?: string;
  previousVisit?: boolean;
}

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    travelPreferences?: TravelPreferences
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string | null>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  
  initAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      
      if (!response.ok) {
        set({ 
          isAuthenticated: false, 
          user: null,
          isLoading: false
        });
        return;
      }
      
      const data = await response.json();
      
      set({ 
        isAuthenticated: !!data.user, 
        user: data.user,
        isLoading: false
      });
    } catch (error) {
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },
  
  signUp: async (email, password, firstName, lastName, travelPreferences) => {
    set({ isLoading: true, error: null });
    try {
      // Prepare user data
      const userData = {
        email,
        password,
        firstName,
        lastName,
        ...travelPreferences
      };
      
      const response = await apiRequest('POST', '/api/auth/register', userData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      set({ 
        isLoading: false,
        user: data.user,
        isAuthenticated: true
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      throw error;
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      set({ 
        isAuthenticated: true,
        user: data.user,
        isLoading: false
      });
    } catch (error) {
      set({ 
        isAuthenticated: false,
        isLoading: false,
        error: (error as Error).message 
      });
      throw error;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('POST', '/api/auth/logout');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
      
      set({ 
        isAuthenticated: false, 
        user: null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
    }
  },
  
  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('POST', '/api/auth/reset-password', { email });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      throw error;
    }
  },
  
  updatePassword: async (newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('POST', '/api/auth/update-password', { newPassword });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password update failed');
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('User not authenticated');
      
      const response = await apiRequest('PATCH', '/api/auth/profile', userData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }
      
      const data = await response.json();
      
      set({ 
        user: data.user,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      throw error;
    }
  },
  
  uploadProfilePicture: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = get();
      if (!user) throw new Error('User not authenticated');
      
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await fetch('/api/auth/profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }
      
      const data = await response.json();
      
      // Update local user state with new profile picture
      set({ 
        user: { ...user, profilePicture: data.url },
        isLoading: false 
      });
      
      return data.url;
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      return null;
    }
  },
  
  clearError: () => set({ error: null })
}));
