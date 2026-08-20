import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import supabase from "../supabase-client";
import { getProfileByUsername, IProfile } from "../services/profile";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

import { fetchTakenVoglioIds, toggleVoglioTaken } from "../services/voglioTaken";
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

export default function UserCategory() {
  const { username, categoryId } = useParams<{ username: string; categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [takenMap, setTakenMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takenFilter, setTakenFilter] = useState("all");
  const [selectedVoglio, setSelectedVoglio] = useState<IVoglio | null>(null);
  const { getCurrentUserId } = useAuth();
  const currentUserId = getCurrentUserId();

  const filteredAndSorted = useMemo(() => {
    let list = [...voglioList];

    if (takenFilter === "taken") {
      list = list.filter((v) => takenMap.has(v.id!));
    } else if (takenFilter === "untaken") {
      list = list.filter((v) => !takenMap.has(v.id!));
    }

    list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

    return list;
  }, [voglioList, takenFilter, takenMap]);

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
        setError(t("friends.profileRequired"));
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

      const voglioIds = items.map((v) => v.id!).filter(Boolean);
      const map = await fetchTakenVoglioIds(voglioIds);
      setTakenMap(map);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleToggleTaken = async (voglioId: number) => {
    if (!currentUserId) return;

    const result = await toggleVoglioTaken(voglioId, currentUserId);

    setTakenMap((prev) => {
      const next = new Map(prev);
      if (result.taken) {
        next.set(voglioId, result.taker!);
      } else {
        next.delete(voglioId);
      }
      return next;
    });
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
        onClick={() => navigate(-1)}
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
              {voglioList.length} voglios
              {voglioList.some((v) => v.isTaken) && (
                <> · {voglioList.filter((v) => v.isTaken).length} taken</>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center sm:justify-end">
          <Select value={takenFilter} onValueChange={setTakenFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs rounded-xl border-[#EFEFF4]">
              <BookmarkCheck className="size-3.5 mr-1 text-[#6B6E85]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#F0F1F6]">
              <SelectItem value="all" className="text-xs">{t("userCategory.all")}</SelectItem>
              <SelectItem value="taken" className="text-xs">{t("userCategory.taken")}</SelectItem>
              <SelectItem value="untaken" className="text-xs">{t("userCategory.notTaken")}</SelectItem>
            </SelectContent>
          </Select>
      </div>

      <div className="mt-4 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2">
        {filteredAndSorted.map((voglio) => (
          <VoglioPreview
            key={voglio.id}
            props={voglio}
            onDeleteVoglio={() => {}}
            OnEditClick={() => {}}
            isReadOnly
            isTaken={takenMap.has(voglio.id!)}
            takenBy={takenMap.get(voglio.id!) || null}
            onToggleTaken={() => handleToggleTaken(voglio.id!)}
            onCardClick={() => setSelectedVoglio(voglio)}
            currency={profile?.currency}
          />
        ))}
        {filteredAndSorted.length === 0 && (
          <p className="col-span-full text-center text-[#6B6E85] text-sm mt-8">
            {voglioList.length === 0
              ? t("userCategory.noPublicVoglios")
              : t("userCategory.noVogliosMatch")}
          </p>
        )}
      </div>

      {selectedVoglio && (
        <VoglioDetailDialog
          open={!!selectedVoglio}
          onClose={() => setSelectedVoglio(null)}
          voglio={selectedVoglio}
          isTaken={takenMap.has(selectedVoglio.id!)}
          takenBy={takenMap.get(selectedVoglio.id!) || null}
          onToggleTaken={() => handleToggleTaken(selectedVoglio.id!)}
          currency={profile?.currency}
        />
      )}
    </>
  );
}
