import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";
import supabase from "../supabase-client";
import { getProfileByUsername, getCurrentUserId, IProfile } from "../services/profile";
import { followUser, unfollowUser, isFollowing } from "../services/follow";
import VoglioPreview from "../components/voglio/VoglioPreview";
import { IVoglio } from "@/components/voglio/VoglioForm";

interface CategoryDetail {
  id: number;
  name: string;
  description: string | null;
  emoji_code: string;
  user_id: string;
}

export default function UserCategory() {
  const { username, categoryId } = useParams<{ username: string; categoryId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!username || !categoryId) return;
    loadPage();
  }, [username, categoryId]);

  const loadPage = async () => {
    if (!username || !categoryId) return;
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

      const { data: catData, error: catError } = await supabase
        .from("category")
        .select(`id, name, description, emoji_code, user_id`)
        .eq("id", categoryId)
        .eq("user_id", prof.id)
        .eq("is_private", false)
        .single();

      if (catError || !catData) {
        setError("Category not found");
        setLoading(false);
        return;
      }
      setCategory(catData);

      const { data, error: voglioError } = await supabase
        .from("voglio")
        .select(`*`)
        .eq("category_id", categoryId)
        .eq("is_private", false);

      if (voglioError) throw voglioError;

      setVoglioList(
        (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          notes: item.notes,
          price: item.price,
          categoryId: item.category_id?.toString() ?? null,
          referenceLink: item.reference_link ?? "",
          sizeId: item.size_id,
          imageUrl: item.image_url ?? "",
          quantity: item.quantity,
          isPrivate: item.is_private,
          userId: item.user_id,
        }))
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

  if (loading) return <div className="mt-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="mt-8 text-center text-red-500">{error}</div>;
  if (!profile || !category) return <div className="mt-8 text-center text-gray-500">Not found</div>;

  const isOwnProfile = currentUserId === profile.id;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="self-start"
        onClick={() => navigate(`/u/${username}`)}
      >
        <ChevronLeft className="mr-1 size-4" /> Back
      </Button>

      <div className="flex items-start gap-3 mt-4">
        <div className="flex items-center justify-center size-12 rounded-full bg-gray-100">
          <Users className="text-gray-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{profile.display_name || profile.username}</h2>
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

      <div className="flex flex-col items-center mt-6">
        <div className="flex items-center justify-center size-20 rounded-full bg-gray-100 text-4xl">
          <span>{category.emoji_code}</span>
        </div>
        <h3 className="mt-3 text-2xl font-bold">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-gray-500 text-center max-w-md">{category.description}</p>
        )}
      </div>

      <p className="mt-6 h-2 w-full border-b border-gray-300" />

      <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {voglioList.map((voglio) => (
          <VoglioPreview
            key={voglio.id}
            props={voglio}
            onDeleteVoglio={() => {}}
            OnEditClick={() => {}}
            isReadOnly
          />
        ))}
        {voglioList.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-8">No public voglios in this category</p>
        )}
      </div>
    </>
  );
}
