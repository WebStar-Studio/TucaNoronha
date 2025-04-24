import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xyzcompany.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseUser = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  role: string;
};

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: 'user',
      }
    }
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return { data, error };
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  return { data, error };
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { user: null, error };
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  return { 
    user: user ? {
      id: user.id,
      email: user.email as string,
      first_name: user.user_metadata.first_name,
      last_name: user.user_metadata.last_name,
      profile_picture: user.user_metadata.profile_picture,
      role: user.user_metadata.role,
    } as SupabaseUser : null, 
    error: null 
  };
}

export async function updateProfile(userId: string, userData: Partial<SupabaseUser>) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      first_name: userData.first_name,
      last_name: userData.last_name,
    }
  });
  
  return { data, error };
}

export async function uploadProfilePicture(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });
  
  if (error) {
    return { url: null, error };
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  
  // Update user metadata with new profile picture URL
  const { data: userData, error: updateError } = await supabase.auth.updateUser({
    data: { profile_picture: publicUrl }
  });
  
  return { url: publicUrl, error: updateError };
}
