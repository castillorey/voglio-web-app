import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

import supabase from "../../supabase-client";
import VoglioFormStep1 from "./VoglioFormStep1";
import VoglioFormStep2 from "./VoglioFormStep2";

export interface IVoglio {
  id: number | null;
  name: string;
  notes: string;
  categoryId: string | null;
  referenceLink: string;
  sizeId: string | null;
  imageUrl: string;
  imageFile?: File | null;
  quantity: number;
}

export interface IVoglioDto {
  id: number | null;
  name: string;
  notes: string;
  category_id: number | null;
  reference_link: string;
  size_id: number | null;
  image_url: string;
  quantity: number | null;
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
  vogliosCount?: number;
}

export default function VoglioForm({
  categoryId,
  editVoglioData,
  onCreateVoglio,
  onUpdateVoglio,
}: {
  categoryId?: number;
  editVoglioData?: IVoglio | null;
  onCreateVoglio?: (newVoglio: IVoglio) => void;
  onUpdateVoglio?: (editedVoglio: IVoglio) => void;
}) {
  const CDNURL =
    "https://bblscslptefmqyjhizvl.supabase.co/storage/v1/object/public/images/";
  const session: string = localStorage.getItem("session")!;
  const user = session && JSON.parse(session)?.user;

  const [step, setStep] = useState(1);
  const [sizeList, setSizeList] = useState<ISize[]>([]);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step > 1 ? step - 1 : 1);

  const emptyForm = {
    id: null,
    name: "",
    notes: "",
    categoryId: null,
    referenceLink: "",
    sizeId: null,
    imageUrl: "",
    quantity: 1,
  };
  const [formData, setFormData] = useState<IVoglio>(emptyForm);
  let imageUrl = "";

  useEffect(() => {
    fetchCategoryList();
    fetchSizeList();
    if (editVoglioData) {
      setFormData({ ...formData, ...editVoglioData });
    } else if (categoryId) {
      setFormData({ ...formData, categoryId: categoryId.toString() });
    }
  }, []);

  const fetchCategoryList = async () => {
    const { data, error } = await supabase
      .from("category")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log("Error fetching category list: ", error);
    } else {
      setCategoryList(data);
    }
  };

  const fetchSizeList = async () => {
    const { data, error } = await supabase.from("size").select("*");

    if (error) {
      console.log("Error fetching size list: ", error);
    } else {
      setSizeList(data);
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
    } else {
      imageUrl = formData.imageUrl;
    }

    const voglioInfo = {
      id: formData.id,
      name: formData.name,
      notes: formData.notes,
      category_id: formData.categoryId,
      reference_link: formData.referenceLink,
      size_id: formData.sizeId,
      image_url: imageUrl,
      quantity: formData.quantity,
    };

    // Update
    if (voglioInfo.id) {
      const { error } = await supabase
        .from("voglio")
        .update(voglioInfo)
        .eq("id", voglioInfo.id)
        .select();

      if (error) {
        console.log("Error updating new Voglio: ", error);
      } else {
        if (onUpdateVoglio) {
          onUpdateVoglio({ ...formData, imageUrl });
        }
      }
    } else {
      // Create
      const { data, error } = await supabase
        .from("voglio")
        .insert([voglioInfo])
        .select();

      if (error) {
        console.log("Error adding new Voglio: ", error);
      } else {
        if (onCreateVoglio) {
          onCreateVoglio({ ...formData, id: data[0].id });
        }
      }
    }

    setFormData({ ...emptyForm });
  };

  return (
    <form>
      {step === 1 && (
        <VoglioFormStep1
          formData={formData}
          categoryList={categoryList}
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
      <div className="mt-2 pt-3 xs:flex justify-end gap-4">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrevStep}
            className="w-full xs:w-auto xs:justify-self-start text-xs"
          >
            Previous
          </Button>
        )}
        {step < 2 && (
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full xs:w-auto xs:justify-self-end text-xs"
          >
            Next
          </Button>
        )}
        {step == 2 && (
          <Button
            type="button"
            onClick={formDataPublish}
            className="w-full xs:w-auto mt-3 xs:mt-0 xs:justify-self-end text-xs"
          >
            {editVoglioData ? "Update" : "Create"}
          </Button>
        )}
      </div>
    </form>
  );
}
