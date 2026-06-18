import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "../supabase-client";
import { getCurrentUserId } from "../services/profile";
import { toggleVoglioTaken } from "../services/voglioTaken";
import VoglioPreview from "../components/voglio/VoglioPreview";
import { IVoglio } from "@/components/voglio/VoglioForm";

interface BookmarkedVoglio {
  voglio: IVoglio;
  takenAt: string;
  categoryEmoji: string;
  categoryName: string;
  categoryId: number;
  ownerUsername: string;
}

export default function Bookmarked() {
  const navigate = useNavigate();
  const [items, setItems] = useState<BookmarkedVoglio[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchBookmarked();
  }, []);

  const fetchBookmarked = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const { data: takenRows } = await supabase
      .from("voglio_taken")
      .select("voglio_id, created_at")
      .eq("user_id", currentUserId)
      .order("created_at", { ascending: false });

    if (!takenRows?.length) {
      setLoading(false);
      return;
    }

    const voglioIds = takenRows.map((r) => r.voglio_id);
    const takenAtMap = new Map(
      takenRows.map((r) => [r.voglio_id, r.created_at]),
    );

    const { data: voglios } = await supabase
      .from("voglio")
      .select("*, category:category_id(*)")
      .in("id", voglioIds);

    if (!voglios?.length) {
      setLoading(false);
      return;
    }

    const userIds = [...new Set(voglios.map((v) => v.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, p]),
    );

    const bookmarkedItems: BookmarkedVoglio[] = voglios.map((v) => {
      const profile = profileMap.get(v.user_id);
      const category = v.category as any;
      return {
        voglio: {
          id: v.id,
          name: v.name,
          notes: v.notes,
          price: v.price,
          categoryId: v.category_id?.toString() ?? null,
          referenceLink: v.reference_link ?? "",
          sizeId: v.size_id,
          imageUrl: v.image_url ?? "",
          quantity: v.quantity,
          isPrivate: v.is_private,
          isTaken: true,
          userId: v.user_id,
        },
        takenAt: takenAtMap.get(v.id) || "",
        categoryEmoji: category?.emoji_code || "",
        categoryName: category?.name || "",
        categoryId: v.category_id,
        ownerUsername: profile?.username || "",
      };
    });

    setItems(bookmarkedItems);
    setLoading(false);
  };

  const handleUnmark = async (voglioId: number) => {
    if (!currentUserId) return;
    await toggleVoglioTaken(voglioId, currentUserId, true);
    setItems((prev) =>
      prev.filter((item) => item.voglio.id !== voglioId),
    );
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-[#6B6E85] hover:text-[#1B1B2D]"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <h1 className="font-display text-2xl text-[#1B1B2D]">Saved items</h1>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-[#6B6E85] text-sm">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F1EEFF] flex items-center justify-center mb-4">
            <Heart className="size-7 text-[#C4C7D3]" />
          </div>
          <h2 className="font-display text-lg text-[#1B1B2D]">
            No saved items yet
          </h2>
          <p className="text-sm text-[#6B6E85] mt-2 max-w-xs">
            Browse your friends' collections and bookmark items you like
          </p>
          <Button
            variant="secondary"
            className="mt-6 text-xs"
            onClick={() => navigate("/friends")}
          >
            Find friends
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xs:grid-cols-2">
          {items.map((item) => (
            <div key={item.voglio.id}>
              <VoglioPreview
                props={item.voglio}
                onDeleteVoglio={() => {}}
                OnEditClick={() => {}}
                isTaken
                onToggleTaken={() => handleUnmark(item.voglio.id!)}
              />
              <Link
                to={`/friends/u/${item.ownerUsername}/category/${item.categoryId}`}
                className="flex items-center gap-1.5 mt-2 px-1 hover:opacity-80 transition-opacity"
              >
                <span className="text-xs">{item.categoryEmoji}</span>
                <span className="text-xs text-[#6B6E85]">
                  {item.categoryName}
                </span>
                <span className="text-xs text-[#C4C7D3]">·</span>
                <span className="text-xs text-[#6B6E85]">
                  @{item.ownerUsername}
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
