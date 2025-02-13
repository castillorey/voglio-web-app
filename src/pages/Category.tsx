import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@uidotdev/usehooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
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
import { Plus } from "lucide-react";

import VoglioForm, { ICategory, IVoglio } from "../components/VoglioForm";
import VoglioPreview from "../components/VoglioPreview";

export default function Category() {
  const { categoryId } = useParams();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");
  const [categoryData, setCategoryData] = useState<ICategory>({} as ICategory);
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [openNewVoglioDialog, setOpenNewVoglioDialog] = useState(false);

  const fetchCategory = async () => {
    if (!categoryId) return;
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .eq("id", categoryId);

    if (error) {
      console.log("Error fetching: ", error);
    } else {
      setCategoryData({ ...data[0], emojiCode: data[0].emoji_code });
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchVoglios();
  }, []);

  const fetchVoglios = async () => {
    const { data, error } = await supabase
      .from("voglio")
      .select("*")
      .eq("category_id", categoryId);

    if (error) {
      console.log("Error fetching: ", error);
    } else {
      const transformedVoglios: IVoglio[] = data.map((voglio) => {
        return {
          id: voglio.id,
          name: voglio.name,
          notes: voglio.notes,
          categoryId: voglio.category_id,
          referenceLink: voglio.reference_link,
          sizeId: voglio.size_id,
          imageUrl: voglio.image_url,
        };
      });

      setVoglioList(transformedVoglios);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="w-28 flex items-center justify-center p-4 text-center text-6xl rounded-lg bg-gray-100">
          <span>{categoryData.emojiCode}</span>
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold">{categoryData.name}</h2>
          <p className="text-sm">{categoryData.description}</p>
        </div>
      </div>
      <p className="mt-2 h-2 w-full border-b border-gray-300"></p>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-bold">Voglios</p>
        {isSmallDevice ? (
          <Drawer
            open={openNewVoglioDialog}
            onOpenChange={setOpenNewVoglioDialog}
          >
            <DrawerTrigger asChild>
              <Button>
                <Plus /> <span className="hidden xs:block">Add new</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mb-5">
              <DrawerHeader className="text-left">
                <DrawerTitle>New Voglio</DrawerTitle>
              </DrawerHeader>
              <DrawerDescription className="px-5">
                <VoglioForm
                  onCreateVoglio={(newVoglio) => {
                    setVoglioList([...voglioList, newVoglio]);
                  }}
                />
              </DrawerDescription>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog
            open={openNewVoglioDialog}
            onOpenChange={setOpenNewVoglioDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus /> <span className="hidden xs:block">Add new</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Voglio</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <VoglioForm
                  onCreateVoglio={(newVoglio) => {
                    setVoglioList([...voglioList, newVoglio]);
                  }}
                />
              </DialogDescription>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {voglioList.map((voglio) => (
          <VoglioPreview
            name={voglio.name}
            imageUrl={voglio.imageUrl}
            notes={voglio.notes}
            key={voglio.id}
          />
        ))}
      </div>
    </>
  );
}
