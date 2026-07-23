import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LayoutGrid, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import CategoryForm from "./category/CategoryForm";
import VoglioForm from "./voglio/VoglioForm";
import { ICategory, IVoglio } from "./voglio/VoglioForm";
import { useTranslation } from "react-i18next";

type Mode = "choose" | "category" | "voglio";

interface CategoryConfig {
  editData?: ICategory | null;
  onCreate?: (category: ICategory) => void;
  onUpdate?: (category: ICategory) => void;
}

export default function CreateDialog({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category?: CategoryConfig;
}) {
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 500px)");
  const [mode, setMode] = useState<Mode>(category ? "category" : "choose");
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setMode(category ? "category" : "choose");
    }
  }, [open, category]);

  const resetAndClose = () => {
    setMode("choose");
    onClose();
  };

  const handleCategoryCreated = (newCategory: ICategory) => {
    if (category?.onCreate) {
      category.onCreate(newCategory);
      resetAndClose();
    } else {
      resetAndClose();
      navigate(`/category/${newCategory.id}`);
    }
  };

  const handleCategoryUpdated = (editedCategory: ICategory) => {
    if (category?.onUpdate) {
      category.onUpdate(editedCategory);
      resetAndClose();
    }
  };

  const handleVoglioCreated = (newVoglio: IVoglio) => {
    resetAndClose();
    if (newVoglio.categoryId) {
      navigate(`/category/${newVoglio.categoryId}`);
    }
  };

  const title =
    mode === "choose"
      ? t("common.createNew")
      : mode === "category"
        ? category?.editData ? t("common.editCategory") : t("common.newCategory")
        : t("common.newVoglio");

  const HeaderContent = () => (
    <div className="flex items-center gap-2">
      {mode !== "choose" && !category && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-[#6B6E85] hover:text-[#1B1B2D]"
          onClick={() => setMode("choose")}
        >
          <ChevronLeft className="size-5" />
        </Button>
      )}
      <DialogTitle className="font-display text-xl text-[#1B1B2D]">{title}</DialogTitle>
    </div>
  );

  const content = (
    <>
      {mode === "choose" && !category && (
        <div className="flex flex-col gap-3 mt-1">
          <button
            type="button"
            className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-dashed border-[#E0E1E8] bg-white hover:border-[#7B61FF]/40 hover:bg-[#F5F3FF] transition-all text-left cursor-pointer"
            onClick={() => setMode("category")}
          >
            <div className="w-11 h-11 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
              <LayoutGrid className="size-5 text-[#7B61FF]" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#1B1B2D]">
                {t("common.newCategory")}
              </p>
              <p className="text-xs text-[#6B6E85] mt-0.5">
                {t("common.createCategoryForWishes")}
              </p>
            </div>
          </button>
          <button
            type="button"
            className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-dashed border-[#E0E1E8] bg-white hover:border-[#7B61FF]/40 hover:bg-[#F5F3FF] transition-all text-left cursor-pointer"
            onClick={() => setMode("voglio")}
          >
            <div className="w-11 h-11 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
              <Package className="size-5 text-[#7B61FF]" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#1B1B2D]">
                {t("common.newVoglio")}
              </p>
              <p className="text-xs text-[#6B6E85] mt-0.5">
                {t("common.addWishlistItem")}
              </p>
            </div>
          </button>
        </div>
      )}
      {mode === "category" && (
        <CategoryForm
          editCategoryData={category?.editData ?? null}
          onCreateCategory={handleCategoryCreated}
          onUpdateCategory={category?.onUpdate ? handleCategoryUpdated : undefined}
        />
      )}
      {mode === "voglio" && (
        <VoglioForm onCreateVoglio={handleVoglioCreated} />
      )}
    </>
  );

  if (isSmallDevice) {
    return (
      <MobileSheet open={open} onClose={resetAndClose}>
        <div className="flex items-center gap-2 mb-4">
          {mode !== "choose" && !category && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-[#6B6E85] hover:text-[#1B1B2D]"
              onClick={() => setMode("choose")}
            >
              <ChevronLeft className="size-5" />
            </Button>
          )}
          <h2 className="font-display text-xl text-[#1B1B2D]">{title}</h2>
        </div>
        {content}
      </MobileSheet>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) resetAndClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <HeaderContent />
          <DialogDescription aria-describedby="Create form" className="sr-only" />
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
