import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import CategoryPreview from "../components/category/CategoryPreview";
import supabase from "../supabase-client";
import CategoryForm from "../components/category/CategoryForm";
import { ICategory } from "@/components/voglio/VoglioForm";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function Voglios() {
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [open, setOpen] = useState(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    const { data, error } = await supabase
      .from("category")
      .select(`id, name,description, emoji_code, voglio(count:count())`);
    if (error) {
      console.log("Error fetching category list: ", error);
    } else {
      setCategoryList(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          emojiCode: item.emoji_code,
          description: item.description,
          vogliosCount: item.voglio[0].count,
        }))
      );
    }
  };

  const categoryListItems = categoryList.map((item) => {
    return (
      <Link key={item.id} to={`category/${item.id}`} state={item}>
        <CategoryPreview
          name={item.name}
          vogliosCount={item.vogliosCount!}
          emojiCode={item.emojiCode}
        />
      </Link>
    );
  });

  const DesktopDialog = () => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} className="mt-3 sm:mt-0">
            <CirclePlus size={14} />{" "}
            <span className="hidden xs:block text-xs">New Category</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription aria-describedby="New category form" />
          </DialogHeader>
          <CategoryForm
            onCreateCategory={(newCategory) => {
              setOpen(false);
              setCategoryList([...categoryList, newCategory]);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  };

  const MobileDialog = () => {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>
            <CirclePlus size={14} /> <span className="hidden xs:block">Add new</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mb-5 px-5">
          <DrawerHeader className="text-left">
            <DrawerTitle>New Voglio</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription aria-describedby="New voglio form"></DrawerDescription>
          <CategoryForm
            onCreateCategory={(newCategory) => {
              setOpen(false);
              setCategoryList([...categoryList, newCategory]);
            }}
          />
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Collections</h2>
        {isSmallDevice ? <MobileDialog /> : <DesktopDialog />}
      </div>
      <p className="mt-4 h-2 w-full border-b border-gray-300"></p>
      <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryListItems}
      </div>
    </div>
  );
}
