import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CategoryPreview from "../components/CategoryPreview";
import { ICategory } from "../components/VoglioForm";
import supabase from "../supabase-client";
import CategoryForm from "../components/CategoryForm";

export default function Voglios() {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    const { data, error } = await supabase.from("category").select("*");

    if (error) {
      console.log("Error fetching category list: ", error);
    } else {
      setCategoryList(
        data.map((item) => ({ emojiCode: item.emoji_code, ...item }))
      );
    }
  };

  const categoryListItems = categoryList.map((item: ICategory) => {
    return (
      <Link key={item.id} to={`category/${item.id}`}>
        <CategoryPreview
          name={item.name}
          description={item.description}
          emojiCode={item.emojiCode}
        />
      </Link>
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">Categories</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-3 sm:mt-0">
              <Plus/> <span className="hidden xs:block">New Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
              <DialogDescription>
                <CategoryForm
                  onCreateCategory={(newCategory) => {
                    setCategoryList([...categoryList, newCategory]);
                  }}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <p className="mt-4 h-2 w-full border-b border-gray-300"></p>
      <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryListItems}
      </div>
    </div>
  );
}
