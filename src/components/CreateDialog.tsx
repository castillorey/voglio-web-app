import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LayoutGrid, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import CategoryForm from "./category/CategoryForm";
import VoglioForm from "./voglio/VoglioForm";
import { ICategory, IVoglio } from "./voglio/VoglioForm";

type Mode = "choose" | "category" | "voglio";

export default function CreateDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 500px)");
  const [mode, setMode] = useState<Mode>("choose");

  const resetAndClose = () => {
    setMode("choose");
    onClose();
  };

  const handleCategoryCreated = (newCategory: ICategory) => {
    resetAndClose();
    navigate(`/category/${newCategory.id}`);
  };

  const handleVoglioCreated = (newVoglio: IVoglio) => {
    resetAndClose();
    if (newVoglio.categoryId) {
      navigate(`/category/${newVoglio.categoryId}`);
    }
  };

  const title =
    mode === "choose"
      ? "Create new"
      : mode === "category"
        ? "New category"
        : "New voglio";

  const HeaderContent = () => (
    <div className="flex items-center gap-2">
      {mode !== "choose" && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-[#6B6E85] hover:text-[#1B1B2D]"
          onClick={() => setMode("choose")}
        >
          <ChevronLeft className="size-5" />
        </Button>
      )}
      <DialogTitle className="text-xl">{title}</DialogTitle>
    </div>
  );

  const content = (
    <>
      {mode === "choose" && (
        <div className="flex flex-col gap-3 mt-2">
          <Button
            variant="outline"
            className="h-20 gap-3 text-base justify-start px-6 rounded-xl border-2 border-dashed border-[#E0E1E8] hover:border-[#7B61FF]/40 hover:bg-[#F5F3FF] transition-all"
            onClick={() => setMode("category")}
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
              <LayoutGrid className="size-5 text-[#7B61FF]" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-[#1B1B2D]">
                New category
              </div>
              <div className="text-xs text-[#6B6E85] font-normal mt-0.5">
                Create a collection for your wishes
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-20 gap-3 text-base justify-start px-6 rounded-xl border-2 border-dashed border-[#E0E1E8] hover:border-[#7B61FF]/40 hover:bg-[#F5F3FF] transition-all"
            onClick={() => setMode("voglio")}
          >
            <div className="w-10 h-10 rounded-full bg-[#F1EEFF] flex items-center justify-center shrink-0">
              <Package className="size-5 text-[#7B61FF]" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm text-[#1B1B2D]">
                New voglio
              </div>
              <div className="text-xs text-[#6B6E85] font-normal mt-0.5">
                Add a wishlist item
              </div>
            </div>
          </Button>
        </div>
      )}
      {mode === "category" && (
        <CategoryForm
          editCategoryData={null}
          onCreateCategory={handleCategoryCreated}
        />
      )}
      {mode === "voglio" && (
        <VoglioForm onCreateVoglio={handleVoglioCreated} />
      )}
    </>
  );

  if (isSmallDevice) {
    return (
      <Drawer
        open={open}
        onOpenChange={(o) => {
          if (!o) resetAndClose();
        }}
      >
        <DrawerContent className="mb-5 px-5">
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-2">
              {mode !== "choose" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-[#6B6E85] hover:text-[#1B1B2D]"
                  onClick={() => setMode("choose")}
                >
                  <ChevronLeft className="size-5" />
                </Button>
              )}
              <DrawerTitle className="text-xl">{title}</DrawerTitle>
            </div>
          </DrawerHeader>
          <DrawerDescription aria-describedby="Create form" />
          {content}
        </DrawerContent>
      </Drawer>
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
          <DialogDescription aria-describedby="Create form" />
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
