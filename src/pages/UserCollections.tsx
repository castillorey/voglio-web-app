import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";
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
    return <div className="mt-8 text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  if (!profile)
    return <div className="mt-8 text-center text-gray-500">User not found</div>;

  const isOwnProfile = currentUserId === profile.id;

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="size-8 self-start"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
      </Button>

      <div className="flex items-start gap-3 mt-4">
        <div className="flex items-center justify-center size-12 rounded-full bg-gray-100">
          <Users className="text-gray-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            {profile.display_name || profile.username}
          </h2>
          <p className="text-sm text-gray-500">@{profile.username}</p>
        </div>
        {!isOwnProfile && currentUserId && (
          <Button
            variant={following ? "outline" : "default"}
            size="sm"
            onClick={handleFollow}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      <p className="mt-4 h-2 w-full border-b border-gray-300" />
      <p className="mt-3 text-sm text-gray-500">Public collections</p>

      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryList.map((category) => (
          <div
            key={category.id}
            onClick={() =>
              navigate(
                isOwnProfile
                  ? `/category/${category.id}`
                  : `/u/${username}/category/${category.id}`,
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
          <p className="col-span-full text-center text-gray-500 mt-8">
            No public collections yet
          </p>
        )}
      </div>
    </>
  );
}
