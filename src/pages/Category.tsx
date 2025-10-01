import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import { useLocation, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { CirclePlus, ChevronLeft } from "lucide-react";

import VoglioForm, {
  ICategory,
  IVoglio,
} from "../components/voglio/VoglioForm";
import VoglioPreview from "../components/voglio/VoglioPreview";
import VoglioDialog from "@/components/VoglioDialog";

export default function Category() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { state } = useLocation();
  const [categoryData, setCategoryData] = useState<ICategory>({} as ICategory);
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [openNewVoglioDialog, setOpenNewVoglioDialog] = useState(false);
  const [editVoglioData, setEditVoglioData] = useState<IVoglio | null>(null);

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
          categoryId: voglio.category_id.toString(),
          referenceLink: voglio.reference_link,
          sizeId: voglio.size_id,
          imageUrl: voglio.image_url,
          quantity: voglio.quantity,
        };
      });

      setVoglioList(transformedVoglios);
    }
  };

  return (
    <>
      <Button variant="secondary" size="icon" className="size-8 mb-5"
        onClick={() => navigate("/")}>
        <ChevronLeft />
      </Button>
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
        <Button
          onClick={() => {
            setEditVoglioData(null);
            setOpenNewVoglioDialog(true);
          }}
        >
          <CirclePlus size={12} />{" "}
          <span className="hidden xs:block text-xs">Add new</span>
        </Button>
        <VoglioDialog
          open={openNewVoglioDialog}
          onClose={() => setOpenNewVoglioDialog(false)}
        >
          <VoglioForm
            categoryId={categoryData.id}
            onCreateVoglio={(newVoglio) => {
              setVoglioList([...voglioList, newVoglio]);
              setOpenNewVoglioDialog(false);
            }}
            editVoglioData={editVoglioData}
            onUpdateVoglio={(editedVoglio) => {
              let refreshedVoglioList = voglioList.map((voglio) =>
                voglio.id === editedVoglio.id ? editedVoglio : voglio
              );
              refreshedVoglioList = refreshedVoglioList.filter(
                (voglio) => categoryData.id.toString() == voglio.categoryId
              );
              setVoglioList(refreshedVoglioList);
              setOpenNewVoglioDialog(false);
            }}
          />
        </VoglioDialog>
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
            OnEditClick={(voglio) => {
              setEditVoglioData(voglio);
              setOpenNewVoglioDialog(true);
            }}
          />
        ))}
      </div>
    </>
  );
}
