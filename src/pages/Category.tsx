import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { useLocation, useParams } from "react-router";
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

import VoglioForm, {
  ICategory,
  IVoglio,
} from "../components/voglio/VoglioForm";
import VoglioPreview from "../components/voglio/VoglioPreview";

export default function Category() {
  const { categoryId } = useParams();
  const { state } = useLocation();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");
  const [categoryData, setCategoryData] = useState<ICategory>({} as ICategory);
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [openNewVoglioDialog, setOpenNewVoglioDialog] = useState(false);

  const fetchCategory = async () => {
    if (state) {
      setCategoryData(state);
      return;
    }

    const { data, error } = await supabase
      .from("category")
      .select(`*, voglio(count:count())`)
      .eq("id", categoryId);

    if (error) {
      console.log("Error fetching: ", error);
    } else {
      setCategoryData({ ...data[0], emojiCode: data[0].emoji_code });
    }
  };

  useEffect(() => {
    if (!categoryId) return;
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
          <h2 className="text-xl font-bold">{categoryData.name}</h2>
          <p className="text-sm">{categoryData.description}</p>
          <p className="mt-2 text-xs text-gray-500">
            {categoryData.vogliosCount} voglios
          </p>
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
                <Plus size={14} />{" "}
                <span className="hidden xs:block">Add new</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mb-5">
              <DrawerHeader className="text-left">
                <DrawerTitle>New Voglio</DrawerTitle>
              </DrawerHeader>
              <DrawerDescription aria-describedby="New voglio form">
              </DrawerDescription>
                <VoglioForm
                  categoryId={categoryData.id}
                  onCreateVoglio={(newVoglio) => {
                    setVoglioList([...voglioList, newVoglio]);
                  }}
                />
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog
            open={openNewVoglioDialog}
            onOpenChange={setOpenNewVoglioDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus size={14} />
                <span className="hidden xs:block text-xs">Add new</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Voglio</DialogTitle>
                <DialogDescription aria-describedby="New voglio form" />
              </DialogHeader>
              <VoglioForm
                categoryId={categoryData.id}
                onCreateVoglio={(newVoglio) => {
                  setVoglioList([...voglioList, newVoglio]);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Voglio list */}
      <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {voglioList.map((voglio) => (
          <VoglioPreview
            key={voglio.id}
            props={voglio}
            onDeleteVoglio={(voglioId: number) =>
              setVoglioList(voglioList.filter((v) => v.id !== voglioId))
            }
          />
        ))}
      </div>
    </>
  );
}
