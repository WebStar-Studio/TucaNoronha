import { createClient } from '@supabase/supabase-js';
import { TravelPreferences } from '@/store/authStore';

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
  // Travel preferences fields 
  travel_dates?: { from: string; to: string };
  group_size?: number;
  travel_interests?: string[];
  accommodation_preference?: string;
  dietary_restrictions?: string[];
  activity_level?: string;
  transport_preference?: string;
  special_requirements?: string;
  previous_visit?: boolean;
};

export async function signUp(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string,
  travelPreferences?: TravelPreferences
) {
  // Prepare metadata object with basic user info
  const userMetadata: Record<string, any> = {
    first_name: firstName,
    last_name: lastName,
    role: 'user',
  };

  // Add travel preferences to metadata if provided
  if (travelPreferences) {
    // Convert dates to strings if they exist
    const travel_dates = travelPreferences.travelDates ? {
      from: travelPreferences.travelDates.from.toISOString(),
      to: travelPreferences.travelDates.to.toISOString()
    } : undefined;

    // Add all travel preferences
    Object.assign(userMetadata, {
      travel_dates,
      group_size: travelPreferences.groupSize,
      travel_interests: travelPreferences.travelInterests,
      accommodation_preference: travelPreferences.accommodationPreference,
      dietary_restrictions: travelPreferences.dietaryRestrictions,
      activity_level: travelPreferences.activityLevel,
      transport_preference: travelPreferences.transportPreference,
      special_requirements: travelPreferences.specialRequirements,
      previous_visit: travelPreferences.previousVisit,
    });
  }

  // Register user with metadata
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userMetadata
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
  
  if (!user) {
    return { user: null, error: null };
  }
  
  // Extract user metadata
  const { 
    id,
    email,
    user_metadata: {
      first_name,
      last_name,
      profile_picture,
      role,
      // Travel preferences
      travel_dates,
      group_size,
      travel_interests,
      accommodation_preference,
      dietary_restrictions,
      activity_level,
      transport_preference,
      special_requirements,
      previous_visit
    }
  } = user;
  
  // Return complete user object with travel preferences
  return { 
    user: {
      id,
      email: email as string,
      first_name,
      last_name,
      profile_picture,
      role,
      // Include travel preferences if they exist
      ...(travel_dates && { travel_dates }),
      ...(group_size !== undefined && { group_size }),
      ...(travel_interests && { travel_interests }),
      ...(accommodation_preference && { accommodation_preference }),
      ...(dietary_restrictions && { dietary_restrictions }),
      ...(activity_level && { activity_level }),
      ...(transport_preference && { transport_preference }),
      ...(special_requirements && { special_requirements }),
      ...(previous_visit !== undefined && { previous_visit }),
    } as SupabaseUser, 
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
