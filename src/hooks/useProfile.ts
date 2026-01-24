import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  class_id: string;
  semester_id: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    }

    setProfile(data);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const createProfile = async (profileData: {
    first_name: string;
    last_name: string;
    class_id: string;
    semester_id: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        ...profileData,
      })
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const updateProfile = async (profileData: {
    first_name?: string;
    last_name?: string;
    class_id?: string;
    semester_id?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const deleteProfile = async () => {
    if (!user) return { error: new Error("Not authenticated") };

    // Delete grades first
    await supabase.from("grades").delete().eq("user_id", user.id);

    // Then delete profile
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user.id);

    if (!error) {
      setProfile(null);
    }

    return { error };
  };

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: fetchProfile,
  };
};
