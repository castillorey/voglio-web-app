import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Users, Search, ArrowUpDown, BookmarkCheck } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [takenFilter, setTakenFilter] = useState("all");
  const currentUserId = getCurrentUserId();

  const filteredAndSorted = useMemo(() => {
    let list = [...voglioList];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.notes && v.notes.toLowerCase().includes(q))
      );
    }

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
  }, [voglioList, search, sortBy, takenFilter]);

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

  if (loading) return <div className="mt-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="mt-8 text-center text-red-500">{error}</div>;
  if (!profile || !category) return <div className="mt-8 text-center text-gray-500">Not found</div>;

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

      <div className="flex items-center gap-3 mt-4">
        <div className="flex items-center justify-center size-12 rounded-full bg-gray-100">
          <Users className="text-gray-500" />
        </div>
        <h2 className="text-l font-bold">{profile.display_name || profile.username}</h2>
      </div>

      <p className="mt-6 h-2 w-full border-b border-gray-300" />

      <div className="flex items-center gap-2 mt-4">
        <span className="text-xl">{category.emoji_code}</span>
        <h3 className="text-lg font-bold">{category.name}</h3>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search voglios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
            <ArrowUpDown className="size-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-asc">Price low-high</SelectItem>
            <SelectItem value="price-desc">Price high-low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={takenFilter} onValueChange={setTakenFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm">
            <BookmarkCheck className="size-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="taken">Taken</SelectItem>
            <SelectItem value="untaken">Not taken</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          <p className="col-span-full text-center text-gray-500 mt-8">
            {voglioList.length === 0
              ? "No public voglios in this category"
              : "No voglios match your search"}
          </p>
        )}
      </div>
    </>
  );
}
