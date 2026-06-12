import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import supabase from "../supabase-client";
import { useLocation, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ChevronLeft } from "lucide-react";

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
      .select(`*, voglio(count)`)
      .eq("id", categoryId);

    if (error) {
      console.log("Error fetching: ", error);
    } else if (data?.[0]) {
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
          categoryId: voglio.category_id?.toString() ?? null,
          referenceLink: voglio.reference_link ?? "",
          sizeId: voglio.size_id,
          imageUrl: voglio.image_url ?? "",
          quantity: voglio.quantity,
          price: voglio.price,
          isPrivate: voglio.is_private,
          isTaken: voglio.is_taken ?? false,
          userId: voglio.user_id,
        };
      });

      setVoglioList(transformedVoglios);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 self-start text-[#6B6E85] hover:text-[#1B1B2D]"
          onClick={() => navigate("/collections")}
        >
          <ChevronLeft className="size-5" />
        </Button>

        <div className="flex items-center justify-center mt-2 w-16 h-16 rounded-full bg-[#F1EEFF] text-3xl">
          <span>{categoryData.emojiCode}</span>
        </div>

        <div className="mt-3 text-center">
          <h2 className="font-display text-2xl text-[#1B1B2D]">
            {categoryData.name}
          </h2>
          {categoryData.description && (
            <p className="mt-1 text-sm text-[#6B6E85]">{categoryData.description}</p>
          )}
        </div>
      </div>

      <div className="mt-6 mb-8 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card
          className="rounded-[20px] overflow-hidden cursor-pointer border-2 border-dashed border-[#E0E1E8] hover:border-[#7B61FF]/40 hover:bg-[#F5F3FF] transition-all flex items-center justify-center min-h-[200px]"
          onClick={() => {
            setEditVoglioData(null);
            setOpenNewVoglioDialog(true);
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#F1EEFF] flex items-center justify-center">
              <Plus strokeWidth="2" className="size-6 text-[#7B61FF]" />
            </div>
            <span className="text-xs font-semibold text-[#6B6E85]">New voglio</span>
          </div>
        </Card>

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
              voglio.id === editedVoglio.id ? editedVoglio : voglio,
            );
            refreshedVoglioList = refreshedVoglioList.filter(
              (voglio) => categoryData.id?.toString() == voglio.categoryId,
            );
            setVoglioList(refreshedVoglioList);
            setOpenNewVoglioDialog(false);
          }}
        />
      </VoglioDialog>
    </>
  );
}
