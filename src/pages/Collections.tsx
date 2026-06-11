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

export default function Voglios() {
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
      className="rounded-md overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
      onClick={() => {
        setEditCategoryData(null);
        setOpen(true);
      }}
    >
        <Plus strokeWidth="1.5" className="size-16 text-gray-300" />
    </Card>
  );

  const DialogForm = () => {
    if (isSmallDevice) {
      return (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="mb-5 px-5">
            <DrawerHeader className="text-left">
              <DrawerTitle>{editCategoryData ? "Edit Category" : "New Category"}</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription aria-describedby="Category form" />
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
            <DialogTitle>{editCategoryData ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription aria-describedby="Category form" />
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Collections</h2>
      </div>
      <p className="mt-4 h-2 w-full border-b border-gray-300"></p>
      {loading ? (
        <div className="mt-8 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="mt-8 text-center text-red-500">
          Failed to load categories: {error}
        </div>
      ) : (
        <div className="mt-8 mb-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <NewCategoryCard />
          {categoryListItems}
        </div>
      )}
      <DialogForm />
    </>
  );
}
