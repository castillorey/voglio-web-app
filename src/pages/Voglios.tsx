import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button"

import CategoryPreview from "../components/CategoryPreview";
import SimpleDialog from "../components/SimpleDialog";
import { ICategory } from "../components/VoglioForm";
import supabase from "../supabase-client";
import CategoryForm from "../components/CategoryForm";

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
      <Button
        onClick={() => setOpenNewCategoryDialog(!openNewCategoryDialog)}
        className="mt-2"
      >
        New Category
      </Button>
      <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryListItems}
      </div>
    </div>
  );
}
