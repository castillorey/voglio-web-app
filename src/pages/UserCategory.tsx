import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowUpDown, BookmarkCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import supabase from "../supabase-client";
import { getProfileByUsername, getCurrentUserId, IProfile } from "../services/profile";

import { fetchTakenVoglioIds, toggleVoglioTaken } from "../services/voglioTaken";
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
  const [takenSet, setTakenSet] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [takenFilter, setTakenFilter] = useState("all");
  const currentUserId = getCurrentUserId();

  const filteredAndSorted = useMemo(() => {
    let list = [...voglioList];

    if (takenFilter === "taken") {
      list = list.filter((v) => v.isTaken);
    } else if (takenFilter === "untaken") {
      list = list.filter((v) => !v.isTaken);
    }

    switch (sortBy) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return list;
  }, [voglioList, sortBy, takenFilter]);

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

      const items = (data || []).map((item) => ({
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
        isTaken: item.is_taken ?? false,
        userId: item.user_id,
      }));
      setVoglioList(items);

      if (currentUserId) {
        const taken = await fetchTakenVoglioIds(
          items.map((v) => v.id!),
          currentUserId
        );
        setTakenSet(taken);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleToggleTaken = async (voglioId: number) => {
    if (!currentUserId) return;
    const currentlyTaken = takenSet.has(voglioId);
    const newState = await toggleVoglioTaken(voglioId, currentUserId, currentlyTaken);
    setTakenSet((prev) => {
      const next = new Set(prev);
      if (newState) {
        next.add(voglioId);
      } else {
        next.delete(voglioId);
      }
      return next;
    });
    setVoglioList((prev) =>
      prev.map((v) => (v.id === voglioId ? { ...v, isTaken: newState } : v))
    );
  };

  if (loading) return <div className="mt-8 text-center text-[#6B6E85] text-sm">Loading...</div>;
  if (error) return <div className="mt-8 text-center text-red-500 text-sm">{error}</div>;
  if (!profile || !category) return <div className="mt-8 text-center text-[#6B6E85] text-sm">Not found</div>;

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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs rounded-xl border-[#EFEFF4]">
            <ArrowUpDown className="size-3.5 mr-1 text-[#6B6E85]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#F0F1F6]">
            <SelectItem value="newest" className="text-xs">Newest</SelectItem>
            <SelectItem value="name" className="text-xs">Name A-Z</SelectItem>
            <SelectItem value="price-asc" className="text-xs">Price low-high</SelectItem>
            <SelectItem value="price-desc" className="text-xs">Price high-low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={takenFilter} onValueChange={setTakenFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs rounded-xl border-[#EFEFF4]">
            <BookmarkCheck className="size-3.5 mr-1 text-[#6B6E85]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#F0F1F6]">
            <SelectItem value="all" className="text-xs">All</SelectItem>
            <SelectItem value="taken" className="text-xs">Taken</SelectItem>
            <SelectItem value="untaken" className="text-xs">Not taken</SelectItem>
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
            isTaken={takenSet.has(voglio.id!)}
            onToggleTaken={() => handleToggleTaken(voglio.id!)}
          />
        ))}
        {filteredAndSorted.length === 0 && (
          <p className="col-span-full text-center text-[#6B6E85] text-sm mt-8">
            {voglioList.length === 0
              ? "No public voglios in this category"
              : "No voglios match this filter"}
          </p>
        )}
      </div>
    </>
  );
}
