import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";

import CategoryPreview from "../components/CategoryPreview";
import SimpleDialog from "../components/SimpleDialog";
import { ICategory } from "../components/VoglioForm";
import supabase from "../supabase-client";
import CategoryForm from "../components/CategoryForm";
import { Link } from "react-router";

export default function Voglios() {
  const [openNewCategoryDialog, setOpenNewCategoryDialog] = useState(false);

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
      <SimpleDialog
        open={openNewCategoryDialog}
        onClose={() => setOpenNewCategoryDialog(false)}
      >
        <CategoryForm
          onCreateCategory={(newCategory) => {
            setCategoryList([...categoryList, newCategory]);
            setOpenNewCategoryDialog(false);
          }}
        />
      </SimpleDialog>
      <h2 className="font-bold text-lg uppercase">Categories</h2>
      <Button
        onClick={() => setOpenNewCategoryDialog(!openNewCategoryDialog)}
        className="mt-2 group relative inline-block focus:ring-3 focus:outline-hidden"
      >
        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-gray-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

        <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold tracking-widest text-black uppercase">
          New Category
        </span>
      </Button>
      <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryListItems}
      </div>
    </div>
  );
}
