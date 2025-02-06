import { useEffect, useState } from "react";
import { Button } from "@headlessui/react";

import Voglio from "../components/Voglio";
import SimpleDialog from "../components/SimpleDialog";
import VoglioForm from "../components/VoglioForm";
import supabase from "../supabase-client";

export interface IVoglio {
  id: number | null;
  name: string;
  notes: string;
  category_id: number | null;
  reference_link: string;
  size_id: number | null;
  image_url: string;
}

export default function Voglios() {
  const [voglioList, setVoglioList] = useState<IVoglio[]>([]);
  const [openNewVoglioDialog, setOpenNewVoglioDialog] = useState(false);

  const voglioListItems = voglioList.map((item: IVoglio) => {
    return (
      <Voglio
        key={item.id}
        name={item.name}
        notes={item.notes}
        imageSrc={item.image_url}
      />
    );
  });

  useEffect(() => {
    fetchVoglios();
  }, []);

  const fetchVoglios = async () => {
    const { data, error } = await supabase.from("voglio").select("*");

    if (error) {
      console.log("Error fetching: ", error);
    } else {
      setVoglioList(data);
    }
  };

  return (
    <div>
      <SimpleDialog
        open={openNewVoglioDialog}
        onClose={() => setOpenNewVoglioDialog(false)}
      >
        <VoglioForm
          onCreateVoglio={(newVoglio) => {
            setVoglioList([...voglioList, newVoglio]);
            setOpenNewVoglioDialog(false);
          }}
        />
      </SimpleDialog>
      <Button
        onClick={() => setOpenNewVoglioDialog(!openNewVoglioDialog)}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        New Voglio
      </Button>
      <div className="mt-5 grid grid-cols-2 gap-4">{voglioListItems}</div>
    </div>
  );
}
