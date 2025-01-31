import { useState } from "react";
import { Button } from "@headlessui/react";

import Voglio from "../components/Voglio";
import SimpleDialog from "../components/SimpleDialog";
import VoglioForm from "../components/VoglioForm";

export default function Voglios() {
  const [voglios, setVoglios] = useState([
    { name: "Iphone 16", description: "El mejor celular del mundo" },
    { name: "Play 4", description: "Version Slim con disco" },
  ]);
  const [openNewVoglioDialog, setOpenNewVoglioDialog] = useState(false);

  const voglioListItems = voglios.map((item) => {
    return (
      <Voglio key={item.name} name={item.name} description={item.description} />
    );
  });
  return (
    <div>
      <SimpleDialog
        open={openNewVoglioDialog}
        onClose={() => setOpenNewVoglioDialog(false)}
        content={<VoglioForm />}
      />
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
