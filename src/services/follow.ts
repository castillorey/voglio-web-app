import supabase from "../supabase-client";

export interface IFollow {
  id: number;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export const followUser = async (followingId: string) => {
  const session = localStorage.getItem("session");
  if (!session) throw new Error("Not authenticated");
  const userId = JSON.parse(session).user.id;

  const { data, error } = await supabase
    .from("follows")
    .insert([{ follower_id: userId, following_id: followingId }])
    .select()
    .single();

  if (error) throw error;
  return data as IFollow;
};

export const unfollowUser = async (followingId: string) => {
  const session = localStorage.getItem("session");
  if (!session) throw new Error("Not authenticated");
  const userId = JSON.parse(session).user.id;

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", userId)
    .eq("following_id", followingId);

  if (error) throw error;
};

export const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (error) throw error;
  return data.map((f) => f.following_id) as string[];
};

export const isFollowing = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};
