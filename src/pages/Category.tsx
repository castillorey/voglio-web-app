import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { ICategory, IVoglio } from "../components/VoglioForm";
import { useParams } from "react-router";
import VoglioPreview from "../components/VoglioPreview";
import { Button } from "@headlessui/react";

export default function Category() {
  const { categoryId } = useParams();
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
      <div className="text-center">
        <p className="py-5 text-center text-6xl rounded-lg bg-gray-100">
          {categoryData.emojiCode}
        </p>
      </div>
      <span className="relative flex justify-center">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

        <span className="relative z-10 bg-white px-6 text-center">
          <h2 className="mt-2 text-2xl font-bold">{categoryData.name}</h2>
          <p className="text-gray-800 text-sm">{categoryData.description}</p>
        </span>
      </span>
      <Button
            onClick={() => setOpenNewVoglioDialog(!openNewVoglioDialog)}
            className="mt-2 group relative inline-block focus:ring-3 focus:outline-hidden"
          >
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-gray-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
    
            <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold tracking-widest text-black uppercase">
              New Voglio
            </span>
          </Button>
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
