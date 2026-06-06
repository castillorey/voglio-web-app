import supabase from "../supabase-client";

export interface IProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as IProfile | null;
};

export const getProfileByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data as IProfile | null;
};

export const createProfile = async (profile: {
  id: string;
  username: string;
  display_name?: string;
}) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select()
    .single();

  if (error) throw error;
  return data as IProfile;
};

export const updateProfile = async (
  userId: string,
  updates: { display_name?: string; avatar_url?: string; username?: string }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as IProfile;
};

export const searchProfiles = async (query: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20);

  if (error) throw error;
  return data as IProfile[];
};

export const getCurrentUserId = () => {
  const session = localStorage.getItem("session");
  if (!session) return null;
  return JSON.parse(session)?.user?.id as string | null;
};
