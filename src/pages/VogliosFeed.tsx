import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import supabase from "../supabase-client";
import { getProfile, getCurrentUserId, IProfile } from "../services/profile";
import { getFollowing } from "../services/follow";

interface FeedCategory {
  id: number;
  name: string;
  description: string | null;
  emoji_code: string;
  user_id: string;
  voglio: { count: number }[];
}

export default function VogliosFeed() {
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [categories, setCategories] = useState<FeedCategory[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, IProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      loadFeed();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const loadFeed = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const followingIds = await getFollowing(currentUserId);
      if (followingIds.length === 0) {
        setCategories([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("category")
        .select(`id, name, description, emoji_code, user_id, voglio(count)`)
        .in("user_id", followingIds)
        .eq("is_private", false)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      const items = (data || []) as FeedCategory[];
      setCategories(items);

      const userIds = [...new Set(items.map((c) => c.user_id))];
      const profiles = (await Promise.all(userIds.map((id) => getProfile(id)))).filter(Boolean) as IProfile[];
      const map: Record<string, IProfile> = {};
      profiles.forEach((p) => { map[p.id] = p; });
      setProfileMap(map);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (!currentUserId) {
    return (
      <div className="mt-16 text-center">
        <h1 className="font-display text-3xl text-[#1B1B2D]">Voglios</h1>
        <p className="mt-2 text-sm text-[#6B6E85]">Sign in to see your feed</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl text-[#1B1B2D] mb-1">Voglios</h1>

      {loading ? (
        <div className="mt-8 text-center text-[#6B6E85] text-sm">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F1EEFF] flex items-center justify-center mx-auto mb-4">
            <Users className="size-7 text-[#7B61FF]" />
          </div>
          <p className="text-sm font-medium text-[#1B1B2D]">No categories from friends yet</p>
          <p className="text-xs text-[#6B6E85] mt-1">Follow users to see their public categories here</p>
        </div>
      ) : (
        <div className="mt-6 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2">
          {categories.map((category) => {
            const profile = profileMap[category.user_id];
            return (
              <div key={category.id} className="bg-white rounded-[20px] border border-[#F0F1F6] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b border-[#F3F4F7] cursor-pointer hover:bg-[#FAFAFD] transition-colors"
                  onClick={() => profile && navigate(`/friends/u/${profile.username}`)}
                >
                  <div className="flex items-center justify-center size-7 rounded-full bg-[#F1EEFF] shrink-0">
                    <Users className="size-3.5 text-[#7B61FF]" />
                  </div>
                  <p className="text-xs font-semibold text-[#1B1B2D] truncate">
                    {profile?.display_name || profile?.username || "Unknown"}
                  </p>
                </div>
                <div
                  className="text-center cursor-pointer"
                  onClick={() => profile && navigate(`/friends/u/${profile.username}/category/${category.id}`)}
                >
                  <div className="pt-5 pb-4 bg-[#F8F7FC] text-5xl">
                    <span>{category.emoji_code}</span>
                  </div>
                  <div className="px-4 pt-3 pb-4">
                    <h3 className="font-bold text-sm text-[#1B1B2D]">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 text-xs text-[#6B6E85] line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[#A0A3B5] font-medium">
                      {category.voglio?.[0]?.count ?? 0} voglios
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
