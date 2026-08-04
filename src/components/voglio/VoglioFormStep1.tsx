import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

import { IVoglio } from "./VoglioForm";
import { searchProducts, ProductResult } from "../../services/productSearch";
import { useTranslation } from "react-i18next";

export default function VoglioFormStep1({
  formData,
  onProductSelected,
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  searching,
  setSearching,
  searched,
  setSearched,
}: {
  formData: IVoglio;
  errors: { name?: string; imageUrl?: string; categoryId?: string };
  onFormChange: (formData: IVoglio) => void;
  onProductSelected?: (data: IVoglio) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchResults: ProductResult[];
  setSearchResults: (v: ProductResult[]) => void;
  searching: boolean;
  setSearching: (v: boolean) => void;
  searched: boolean;
  setSearched: (v: boolean) => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearched(true);
    const data = await searchProducts(searchQuery.trim());
    setSearchResults(data);
    setSearching(false);
  };

  const handleSelectResult = (item: ProductResult) => {
    onProductSelected?.({
      ...formData,
      name: item.title,
      notes: item.description,
      referenceLink: item.link,
      imageUrl: item.thumbnail,
      imageFile: null,
      price: item.price ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || null : null,
    });
  };

  return (
    <div className="space-y-4 mt-2">
      <div>
        <div className="flex flex-col items-center pt-4 pb-2">
          <p className="text-sm text-[#6B6E85] text-center">
            {t("voglioForm.searchSubtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder={t("voglioForm.searchPlaceholder")}
              className="pr-9"
            />
            {searching && (
              <Loader2 className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C7D3] animate-spin" />
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleSearch}
            disabled={!searchQuery.trim() || searching}
            className="shrink-0"
          >
            <Search className="size-4" />
          </Button>
        </div>

        {searched && !searching && searchResults.length === 0 && (
          <p className="mt-2 text-xs text-[#8C8F9E]">{t("voglioForm.noProducts")}</p>
        )}

        {searchResults.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
            {searchResults.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectResult(item)}
                className="text-left rounded-xl border border-[#F0F1F6] bg-white p-2 hover:border-[#7B61FF] hover:shadow-sm transition-all"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-[#F8F7FC] mb-2 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#C4C7D3] text-xs">No image</div>
                  )}
                </div>
                <p className="text-xs font-medium text-[#1B1B2D] line-clamp-2 leading-snug min-h-[2em]">
                  {item.title}
                </p>
                <p className="text-xs font-semibold text-[#7B61FF] mt-0.5">{item.price}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
