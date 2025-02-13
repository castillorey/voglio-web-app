import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid";

import supabase from "../supabase-client";
import VoglioFormStep1 from "./VoglioFormStep1";
import VoglioFormStep2 from "./VoglioFormStep2";


export interface IVoglio {
  id: number | null;
  name: string;
  notes: string;
  categoryId: number | null;
  referenceLink: string;
  sizeId: number | null;
  imageUrl: string;
}

export interface ISize {
  id: number;
  value: string;
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  emojiCode: string;
}

export default function VoglioForm({
  onCreateVoglio,
}: {
  onCreateVoglio: (newVoglio: IVoglio) => void;
}) {
  const CDNURL =
    "https://bblscslptefmqyjhizvl.supabase.co/storage/v1/object/public/images/";
  const session: string = localStorage.getItem("session")!;
  const user = session && JSON.parse(session)?.user;

  const [step, setStep] = useState(1);
  const [sizeList, setSizeList] = useState<ISize[]>([]);

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step > 1 ? step - 1 : 1);

  const emptyForm = {
    name: "",
    notes: "",
    categoryId: null,
    referenceLink: "",
    sizeId: null,
    imageFile: null,
  };
  const [formData, setFormData] = useState(emptyForm);
  let imageUrl = "";

  useEffect(() => {
    fetchSizeList();
  }, []);

  const fetchSizeList = async () => {
    const { data, error } = await supabase.from("size").select("*");

    if (error) {
      console.log("Error fetching sis=ze list: ", error);
    } else {
      setSizeList([...sizeList, ...data]);
    }
  };

  const uploadImage = async (imageFile: File) => {
    if (!imageFile) return;
    const fileName = user.id + "/" + uuidv4();
    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, imageFile);

    if (!error) {
      imageUrl = CDNURL + fileName;
    } else {
      console.log(error);
    }
  };

  const formDataPublish = async () => {
    if (formData.imageFile) {
      await uploadImage(formData.imageFile);
    }
    const newVoglioInfo = {
      name: formData.name,
      notes: formData.notes,
      categoryId: formData.categoryId,
      referenceLink: formData.referenceLink,
      sizeId: formData.sizeId,
      imageUrl: imageUrl,
    };

    const { data, error } = await supabase
      .from("voglio")
      .insert([newVoglioInfo])
      .select();

    if (error) {
      console.log("Error adding new Voglio: ", error);
    } else {
      onCreateVoglio({ id: data[0].id, ...newVoglioInfo });
    }

    setFormData(emptyForm);
  };

  return (
    <form>
      {step === 1 && (
        <VoglioFormStep1
          formData={formData}
          sizeList={sizeList}
          onFormChange={setFormData}
        />
      )}
      {step === 2 && (
        <VoglioFormStep2
          formData={formData}
          sizeList={sizeList}
          onFormChange={setFormData}
        />
      )}
      <div
        className={`mt-6 pt-3 border-t border-gray-900/10 xs:flex ${
          step == 2 ? "justify-between" : "justify-end"
        }`}
      >
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrevStep}
            className="w-full xs:w-auto px-5 py-3 xs:justify-self-start text-sm font-mediumrounded-lg"
          >
            Previous
          </Button>
        )}
        {step < 2 && (
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full xs:w-auto px-5 py-3 xs:justify-self-end text-sm font-medium rounded-lg"
          >
            Next
          </Button>
        )}
        {step == 2 && (
          <Button
            type="button"
            onClick={formDataPublish}
            className="w-full xs:w-auto mt-2 xs:mt-0 px-5 py-3 xs:justify-self-end text-sm font-medium rounded-lg"
          >
            Create
          </Button>
        )}
      </div>
    </form>
  );
}
