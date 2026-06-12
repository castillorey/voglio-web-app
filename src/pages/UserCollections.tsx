import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import supabase from "../supabase-client";
import {
  getProfileByUsername,
  getCurrentUserId,
  IProfile,
} from "../services/profile";
import { followUser, unfollowUser, isFollowing } from "../services/follow";
import CategoryPreview from "../components/category/CategoryPreview";
import { ICategory } from "@/components/voglio/VoglioForm";

export default function UserCollections() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!username) return;
    loadUser();
  }, [username]);

  const loadUser = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      const prof = await getProfileByUsername(username);
      if (!prof) {
        setError("User not found");
        setLoading(false);
        return;
      }
      setProfile(prof);

      if (currentUserId && prof.id !== currentUserId) {
        const fol = await isFollowing(currentUserId, prof.id);
        setFollowing(fol);
      }

      const { data: categories, error: catError } = await supabase
        .from("category")
        .select(`id, name, description, emoji_code, is_private, voglio(count)`)
        .eq("user_id", prof.id)
        .eq("is_private", false);

      if (catError) throw catError;

      setCategoryList(
        (categories || []).map((item) => ({
          id: item.id,
          name: item.name,
          emojiCode: item.emoji_code,
          description: item.description,
          vogliosCount: item.voglio?.[0]?.count ?? 0,
          isPrivate: item.is_private,
        })),
      );
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    if (!profile || !currentUserId) return;
    try {
      if (following) {
        await unfollowUser(profile.id);
        setFollowing(false);
      } else {
        await followUser(profile.id);
        setFollowing(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <div className="mt-8 text-center text-[#6B6E85] text-sm">Loading...</div>;
  if (error)
    return <div className="mt-8 text-center text-red-500 text-sm">{error}</div>;
  if (!profile)
    return <div className="mt-8 text-center text-[#6B6E85] text-sm">User not found</div>;

  const isOwnProfile = currentUserId === profile.id;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 self-start text-[#6B6E85] hover:text-[#1B1B2D]"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="size-5" />
      </Button>

      <div className="flex items-start gap-4 mt-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full p-[2px]" style={{ background: "linear-gradient(135deg, #FF59C7, #7B61FF)" }}>
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <Avatar className="w-full h-full">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || ""} />
                <AvatarFallback className="text-lg font-bold bg-[#F1EEFF] text-[#7B61FF]">
                  {(profile.display_name || profile.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h2 className="font-display text-xl text-[#1B1B2D]">
            {profile.display_name || profile.username}
          </h2>
          <p className="text-sm text-[#6B6E85]">@{profile.username}</p>
        </div>
        {!isOwnProfile && currentUserId && (
          <Button
            variant={following ? "outline" : "default"}
            size="sm"
            onClick={handleFollow}
            className={following
              ? "rounded-full border-[#E6E2FF] text-[#7B61FF] bg-[#F7F5FF] hover:bg-[#F0ECFF] text-xs font-bold h-9 px-4"
              : "rounded-full bg-[#7B61FF] hover:bg-[#6B4EFF] text-white shadow-md shadow-[#7B61FF]/10 text-xs font-bold h-9 px-4"
            }
          >
            {following ? "Following" : "Follow"}
          </Button>
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wide">Public collections</p>
      </div>

      <div className="mt-4 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryList.map((category) => (
          <div
            key={category.id}
            onClick={() =>
              navigate(
                isOwnProfile
                  ? `/category/${category.id}`
                  : `/friends/u/${username}/category/${category.id}`,
              )
            }
          >
            <CategoryPreview
              props={category}
              onDeleteClick={() => {}}
              OnEditClick={() => {}}
              isReadOnly
            />
          </div>
        ))}
        {categoryList.length === 0 && (
          <p className="col-span-full text-center text-[#6B6E85] text-sm mt-8">
            No public collections yet
          </p>
        )}
      </div>
    </>
  );
}
