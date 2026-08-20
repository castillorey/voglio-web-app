import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import supabase from "../supabase-client";
import { getProfileByUsername, IProfile } from "../services/profile";
import { useTranslation } from "react-i18next";
import VoglioPreview from "../components/voglio/VoglioPreview";
import VoglioDetailDialog from "../components/voglio/VoglioDetailDialog";
import { IVoglio } from "@/components/voglio/VoglioForm";

interface CategoryDetail {
  id: number;
  name: string;
  description: string | null;
  emoji_code: string;
  user_id: string;
}

export default function UserPublicCategory() {
  const { username, categoryId } = useParams<{ username: string; categoryId: string }>();
  const navigate = useNavigate();
  const { key } = useLocation();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoglio, setSelectedVoglio] = useState<IVoglio | null>(null);

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
        setError(t("userProfile.userNotFound"));
        setLoading(false);
        return;
      }
      setProfile(prof);

      const { data: catData, error: catError } = await supabase
        .from("category")
        .select(`id, name, description, emoji_code, user_id`)
        .eq("id", categoryId)
        .eq("user_id", prof.id)
        .eq("is_private", false)
        .single();

      if (catError || !catData) {
        setError(t("userCategory.noPublicVoglios"));
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

      const items = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        notes: item.notes,
        price: item.price,
        currency: profile?.currency || null,
        categoryId: item.category_id?.toString() ?? null,
        referenceLink: item.reference_link ?? "",
        sizeId: item.size_id,
        imageUrl: item.image_url ?? "",
        quantity: item.quantity,
        isPrivate: item.is_private,
        isTaken: item.is_taken ?? false,
        userId: item.user_id,
      }));
      setVoglioList(items);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const goBack = () => {
    if (key !== "default") {
      navigate(-1);
    } else {
      navigate(`/${username}/public`);
    }
  };

  if (loading) return <div className="mt-8 text-center text-[#6B6E85] text-sm">{t("common.loading")}</div>;
  if (error) return <div className="mt-8 text-center text-red-500 text-sm">{error}</div>;
  if (!profile || !category) return <div className="mt-8 text-center text-[#6B6E85] text-sm">{t("common.error")}</div>;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 self-start text-[#6B6E85] hover:text-[#1B1B2D]"
        onClick={goBack}
      >
        <ChevronLeft className="size-5" />
      </Button>

      <div className="flex items-center gap-3 mt-4">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full p-[2px]" style={{ background: "linear-gradient(135deg, #FF59C7, #7B61FF)" }}>
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <Avatar className="w-full h-full">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || ""} />
                <AvatarFallback className="text-sm font-bold bg-[#F1EEFF] text-[#7B61FF]">
                  {(profile.display_name || profile.username).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <h2 className="font-display text-lg text-[#1B1B2D]">{profile.display_name || profile.username}</h2>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F1EEFF] text-xl">
          <span>{category.emoji_code}</span>
        </div>
        <div>
          <h3 className="font-bold text-base text-[#1B1B2D]">{category.name}</h3>
          {!loading && (
            <p className="text-xs text-[#A0A3B5] font-medium mt-0.5">
              {voglioList.length} {t("common.voglios")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2">
        {voglioList.map((voglio) => (
          <VoglioPreview
            key={voglio.id}
            props={voglio}
            onDeleteVoglio={() => {}}
            OnEditClick={() => {}}
            isReadOnly
            onCardClick={() => setSelectedVoglio(voglio)}
            currency={profile?.currency}
          />
        ))}
        {voglioList.length === 0 && (
          <p className="col-span-full text-center text-[#6B6E85] text-sm mt-8">
            {t("userCategory.noPublicVoglios")}
          </p>
        )}
      </div>

      {selectedVoglio && (
        <VoglioDetailDialog
          open={!!selectedVoglio}
          onClose={() => setSelectedVoglio(null)}
          voglio={selectedVoglio}
          isTaken={false}
          takenBy={null}
          onToggleTaken={() => {}}
          currency={profile?.currency}
        />
      )}
    </>
  );
}
