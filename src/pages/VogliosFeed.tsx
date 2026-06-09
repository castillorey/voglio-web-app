import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
        <h2 className="text-xl font-bold">Voglios</h2>
        <p className="mt-2 text-sm text-gray-500">Sign in to see your feed</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold">Voglios</h2>
      <p className="mt-2 h-2 w-full border-b border-gray-300" />

      {loading ? (
        <div className="mt-8 text-center text-gray-500">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="mt-16 text-center text-gray-500">
          <Users className="mx-auto size-10 mb-3 text-gray-300" />
          <p>No categories from friends yet</p>
          <p className="text-sm mt-1">Follow users to see their public categories here</p>
        </div>
      ) : (
        <div className="mt-8 mb-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const profile = profileMap[category.user_id];
            return (
              <Card key={category.id} className="rounded-md overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={() => profile && navigate(`/u/${profile.username}`)}
                  >
                    <div className="flex items-center justify-center size-7 rounded-full bg-gray-200 shrink-0">
                      <Users className="size-3 text-gray-500" />
                    </div>
                    <p className="text-xs font-semibold truncate">
                      {profile?.display_name || profile?.username || "Unknown"}
                    </p>
                  </div>
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => profile && navigate(`/u/${profile.username}/category/${category.id}`)}
                  >
                    <p className="pt-4 pb-3 bg-gray-100 text-5xl">
                      <span>{category.emoji_code}</span>
                    </p>
                    <h3 className="mt-2 font-bold text-sm">{category.name}</h3>
                    {category.description && (
                      <p className="mt-1 px-3 text-xs text-gray-500 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <p className="mt-2 mb-3 text-xs text-gray-400">
                      {category.voglio?.[0]?.count ?? 0} voglios
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
