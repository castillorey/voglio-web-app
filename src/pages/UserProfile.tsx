import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  User,
  Shirt,
  Footprints,
  Heart,
  Palette,
  UtensilsCrossed,
  Sparkles,
  Scissors,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import supabase from "../supabase-client";
import { getProfileByUsername, IProfile } from "../services/profile";
import { fetchPreferences, PreferenceMap } from "../services/preferences";
import { formatDate, getZodiacSign } from "@/components/profile/profile-utils";
import { Chip } from "@/components/profile/profile-shared";
import CategoryPreview from "../components/category/CategoryPreview";
import { ICategory } from "@/components/voglio/VoglioForm";
import { useTranslation } from "react-i18next";

export default function UserProfile({ isPublic = false }: { isPublic?: boolean }) {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { key } = useLocation();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [preferences, setPreferences] = useState<PreferenceMap>({});
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const goBack = () => {
    if (key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);

    try {
      const prof = await getProfileByUsername(username);
      if (!prof) {
        setError(isPublic ? t("userProfile.userNotFound") : t("friends.profileRequired"));
        setLoading(false);
        return;
      }
      setProfile(prof);
      const prefs = await fetchPreferences(prof.id);
      const grouped: PreferenceMap = {};
      for (const p of prefs) {
        if (!grouped[p.category_name]) grouped[p.category_name] = [];
        grouped[p.category_name].push(p);
      }
      setPreferences(grouped);

      if (isPublic) {
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
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="mt-8 text-center text-[#6B6E85] text-sm">{t("common.loading")}</div>
    );
  if (error)
    return (
      <div className="mt-8 text-center text-red-500 text-sm">{error}</div>
    );
  if (!profile)
    return (
      <div className="mt-8 text-center text-[#6B6E85] text-sm">
        {t("common.error")}
      </div>
    );

  const zodiacSign = getZodiacSign(profile.birth_date || "");
  const formattedDate = formatDate(profile.birth_date || "");

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

      {/* Avatar + Name */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-24 h-24 rounded-full p-[2px]" style={{ background: "linear-gradient(135deg, #FF59C7, #7B61FF)" }}>
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={profile.avatar_url || undefined}
                alt={profile.display_name || ""}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-[#F1EEFF] text-[#7B61FF]">
                {(profile.display_name || profile.username)
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <h2 className="mt-3 font-display text-xl text-[#1B1B2D]">
          {profile.display_name || profile.username}
        </h2>
        <p className="text-sm text-[#6B6E85]">@{profile.username}</p>
      </div>

      {/* Details Cards */}
      <div className="mt-6 mb-8 space-y-3">
        {/* Location */}
        {(profile.location || profile.city) && (
          <Card className="rounded-[16px] border-[#F0F1F6] shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-[#7B61FF]" />
              </div>
              <div>
                <p className="text-xs text-[#6B6E85] font-medium">{t("userProfile.location")}</p>
                <p className="text-sm font-semibold text-[#1B1B2D]">
                  {profile.location ? (profile.city ? `${profile.location}, ${profile.city}` : profile.location) : (profile.city || "")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Birthday + Zodiac */}
        {profile.birth_date && (
          <Card className="rounded-[16px] border-[#F0F1F6] shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
                <Calendar className="size-5 text-[#7B61FF]" />
              </div>
              <div>
                <p className="text-xs text-[#6B6E85] font-medium">{t("userProfile.birthday")}</p>
                <p className="text-sm font-semibold text-[#1B1B2D]">
                  {formattedDate}
                </p>
              </div>
              {zodiacSign && (
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#F1EEFF] rounded-full">
                  <Sparkles className="size-3.5 text-[#7B61FF]" />
                  <span className="text-xs font-semibold text-[#7B61FF]">
                    {zodiacSign}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Gender */}
        {profile.gender && (
          <Card className="rounded-[16px] border-[#F0F1F6] shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
                <User className="size-5 text-[#7B61FF]" />
              </div>
              <div>
                <p className="text-xs text-[#6B6E85] font-medium">{t("userProfile.gender")}</p>
                <p className="text-sm font-semibold text-[#1B1B2D]">
                  {profile.gender}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sizes */}
        {(profile.shirt_size || profile.pants_size || profile.shoe_size) && (
          <Card className="rounded-[16px] border-[#F0F1F6] shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
                  <Shirt className="size-5 text-[#7B61FF]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B6E85] font-medium">{t("userProfile.sizes")}</p>
                  {profile.sizing_format && (
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold text-[#7B61FF] bg-[#F1EEFF] rounded-full">
                      {profile.sizing_format.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 ml-[52px]">
                {profile.shirt_size && (
                  <div className="text-center p-2 bg-[#F8F8FB] rounded-xl">
                    <Shirt className="size-4 mx-auto text-[#6B6E85] mb-1" />
                    <p className="text-[10px] text-[#6B6E85]">{t("profile.shirt")}</p>
                    <p className="text-sm font-bold text-[#1B1B2D]">
                      {profile.shirt_size}
                    </p>
                  </div>
                )}
                {profile.pants_size && (
                  <div className="text-center p-2 bg-[#F8F8FB] rounded-xl">
                    <Scissors className="size-4 mx-auto text-[#6B6E85] mb-1" />
                    <p className="text-[10px] text-[#6B6E85]">{t("profile.pants")}</p>
                    <p className="text-sm font-bold text-[#1B1B2D]">
                      {profile.pants_size}
                    </p>
                  </div>
                )}
                {profile.shoe_size && (
                  <div className="text-center p-2 bg-[#F8F8FB] rounded-xl">
                    <Footprints className="size-4 mx-auto text-[#6B6E85] mb-1" />
                    <p className="text-[10px] text-[#6B6E85]">{t("profile.shoe")}</p>
                    <p className="text-sm font-bold text-[#1B1B2D]">
                      {profile.shoe_size}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favorites */}
        {(() => {
          const favoriteColors = preferences["Colores favoritos"] || [];
          const hasFavorites = favoriteColors.length > 0 || profile.favorite_color || profile.favorite_food;
          if (!hasFavorites) return null;
          return (
            <Card className="rounded-[16px] border-[#F0F1F6] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
                    <Heart className="size-5 text-[#7B61FF]" />
                  </div>
                  <p className="text-xs text-[#6B6E85] font-medium">{t("userProfile.favorites")}</p>
                </div>
                <div className="ml-[52px] space-y-2">
                  {favoriteColors.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <Palette className="size-4 text-[#6B6E85]" />
                      <span className="text-sm text-[#1B1B2D]">{c.item_value}</span>
                    </div>
                  ))}
                  {profile.favorite_color && (
                    <div className="flex items-center gap-2">
                      <Palette className="size-4 text-[#6B6E85]" />
                      <span className="text-sm text-[#1B1B2D]">{profile.favorite_color}</span>
                    </div>
                  )}
                  {profile.favorite_food && (
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="size-4 text-[#6B6E85]" />
                      <span className="text-sm text-[#1B1B2D]">{profile.favorite_food}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        }        )()}

        {/* Custom preferences */}
        {Object.entries(preferences)
          .filter(([catName]) => catName !== "Colores favoritos")
          .map(([catName, items]) => (
            <Card key={catName} className="rounded-[16px] border-[#F0F1F6] shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-[#6B6E85] font-medium mb-2">{catName}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Chip key={item.id}>{item.item_value}</Chip>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

        {/* Public categories */}
        {isPublic && (
          <>
            <div className="mt-6">
              <p className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wide">{t("userCollections.publicCategories")}</p>
            </div>
            <div className="mt-4 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2">
              {categoryList.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    navigate(`/${username}/public/${category.id}`)
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
                  {t("userCollections.noPublicCategories")}
                </p>
              )}
            </div>
          </>
        )}

        {/* No details */}
        {!profile.location &&
          !profile.city &&
          !profile.birth_date &&
          !profile.gender &&
          !profile.shirt_size &&
          !profile.pants_size &&
          !profile.shoe_size &&
          Object.keys(preferences).length === 0 && (
            <p className="text-center text-[#6B6E85] text-sm mt-8">
              {t("userProfile.noDetails")}
            </p>
          )}
      </div>
    </>
  );
}
