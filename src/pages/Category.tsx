import { useEffect, useState } from "react";
import supabase from "../supabase-client";
import { IVoglio } from "./Voglios";

export default function Category({ name }: { name: string }) {
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);

  useEffect(() => {
    fetchVoglios();
  }, []);

  const fetchVoglios = async () => {
    const { data, error } = await supabase.from("voglio").select("*");

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

  return <h2>{name}</h2>;
}
