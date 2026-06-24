import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
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

import CategoryPreview from "../components/category/CategoryPreview";
import supabase from "../supabase-client";
import CategoryForm from "../components/category/CategoryForm";
import { ICategory } from "@/components/voglio/VoglioForm";
import { useMediaQuery } from "@uidotdev/usehooks";
import { getCurrentUserId } from "../services/profile";

export default function Collections() {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 500px)");
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    setLoading(true);
    setError(null);

    if (!currentUserId) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("category")
      .select(`id, name, description, emoji_code, is_private, voglio(count)`)
      .eq("user_id", currentUserId);
    if (error) {
      console.log("Error fetching category list: ", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setCategoryList(
      data.map((item) => ({
        id: item.id,
        name: item.name,
        emojiCode: item.emoji_code,
        description: item.description,
        vogliosCount: item.voglio?.[0]?.count ?? 0,
        isPrivate: item.is_private,
      }))
    );
    setLoading(false);
  };

  const categoryListItems = categoryList.map((item) => {
    return (
      <CategoryPreview
          key={item.id}
          props={item}
          onDeleteClick={(categoryId: number | null) =>
            setCategoryList(categoryList.filter((v) => v.id !== categoryId))
          }
          OnEditClick={(category) => {
              setEditCategoryData(category);
              setOpen(true);
            }}
        />
    );
  });

  const NewCategoryCard = () => (
    <Card
      className="rounded-[20px] overflow-hidden cursor-pointer border-2 border-dashed border-[#E0E1E8] hover:border-[#7B61FF]/40 hover:bg-[#F5F3FF] transition-all flex items-center justify-center min-h-[240px]"
      onClick={() => {
        setEditCategoryData(null);
        setOpen(true);
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[#F1EEFF] flex items-center justify-center">
          <Plus strokeWidth="2" className="size-6 text-[#7B61FF]" />
        </div>
        <span className="text-xs font-semibold text-[#6B6E85]">New collection</span>
      </div>
    </Card>
  );

  const DialogForm = () => {
    if (isSmallDevice) {
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="px-5 pb-6">
            <DrawerHeader className="text-left px-0">
              <DrawerTitle className="font-display text-xl text-[#1B1B2D]">{editCategoryData ? "Edit category" : "New category"}</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription aria-describedby="Category form" className="sr-only" />
            <CategoryForm
              editCategoryData={editCategoryData}
              onCreateCategory={(newCategory) => {
                setOpen(false);
                setCategoryList([...categoryList, newCategory]);
              }}
              onUpdateCategory={(editedCategory) => {
                let refreshedCategoryList = categoryList.map((category) =>
                  category.id === editedCategory.id ? editedCategory : category
                );
                setCategoryList(refreshedCategoryList);
                setOpen(false);
              }}
            />
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#1B1B2D]">{editCategoryData ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription aria-describedby="Category form" className="sr-only" />
          </DialogHeader>
          <CategoryForm
            editCategoryData={editCategoryData}
            onCreateCategory={(newCategory) => {
              setOpen(false);
              setCategoryList([...categoryList, newCategory]);
            }}
            onUpdateCategory={(editedCategory) => {
              let refreshedCategoryList = categoryList.map((category) =>
                category.id === editedCategory.id ? editedCategory : category
              );
              setCategoryList(refreshedCategoryList);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl text-[#1B1B2D]">My Voglios</h1>
      </div>

      {loading ? (
        <div className="mt-8 text-center text-[#6B6E85] text-sm">Loading...</div>
      ) : error ? (
        <div className="mt-8 text-center text-red-500 text-sm">
          Failed to load: {error}
        </div>
      ) : categoryList.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="text-5xl mb-5">👋</div>
          <h2 className="font-display text-2xl text-[#1B1B2D] mb-2">Welcome to Voglio!</h2>
          <p className="text-sm text-[#6B6E85] mb-8 leading-relaxed max-w-xs mx-auto">
            Start building your wishlist. Create your first collection and add the things you want.
          </p>
          <div className="max-w-[200px] mx-auto">
            <NewCategoryCard />
          </div>
        </div>
      ) : (
        <div className="mt-6 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2">
          <NewCategoryCard />
          {categoryListItems}
        </div>
      )}
      <DialogForm />
    </>
  );
}
