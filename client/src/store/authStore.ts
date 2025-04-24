import { create } from 'zustand';
import { 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
  updatePassword as supabaseUpdatePassword,
  getCurrentUser,
  updateProfile as supabaseUpdateProfile,
  uploadProfilePicture as supabaseUploadProfilePicture,
  SupabaseUser
} from '@/lib/supabase';

type AuthState = {
  isAuthenticated: boolean;
  user: SupabaseUser | null;
  isLoading: boolean;
  error: string | null;
  initAuth: () => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (userData: Partial<SupabaseUser>) => Promise<void>;
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
      const { user, error } = await getCurrentUser();
      if (error) throw error;
      
      set({ 
        isAuthenticated: !!user, 
        user,
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
  
  signUp: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabaseSignUp(email, password, firstName, lastName);
      if (error) throw error;
      
      set({ isLoading: false });
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
      const { data, error } = await supabaseSignIn(email, password);
      if (error) throw error;
      
      const { user } = await getCurrentUser();
      
      set({ 
        isAuthenticated: true,
        user,
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
      const { error } = await supabaseSignOut();
      if (error) throw error;
      
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
      const { error } = await supabaseResetPassword(email);
      if (error) throw error;
      
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
      const { error } = await supabaseUpdatePassword(newPassword);
      if (error) throw error;
      
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
      
      const { error } = await supabaseUpdateProfile(user.id, userData);
      if (error) throw error;
      
      set({ 
        user: { ...user, ...userData },
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
      
      const { url, error } = await supabaseUploadProfilePicture(user.id, file);
      if (error) throw error;
      
      // Update local user state with new profile picture
      if (url) {
        set({ 
          user: { ...user, profile_picture: url },
          isLoading: false 
        });
      }
      
      return url;
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
