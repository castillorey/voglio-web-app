import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

import supabase from "../../supabase-client";
import { ProductResult } from "../../services/productSearch";
import VoglioFormStep1 from "./VoglioFormStep1";
import VoglioFormStep2 from "./VoglioFormStep2";
import VoglioFormStep3 from "./VoglioFormStep3";

export interface IVoglio {
  id: number | null;
  name: string;
  notes: string;
  price: number | null;
  categoryId: string | null;
  referenceLink: string;
  sizeId: string | null;
  imageUrl: string;
  imageFile?: File | null;
  quantity: number;
  isPrivate: boolean;
  isTaken: boolean;
  userId?: string;
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
  price: number | null;
  is_private: boolean;
  user_id?: string;
}

export interface ICategory {
  id: number | null;
  name: string;
  description: string;
  emojiCode: string;
  vogliosCount?: number;
  isPrivate: boolean;
}

interface FormErrors {
  name?: string;
  imageUrl?: string;
  categoryId?: string;
}

export default function VoglioForm({
  categoryId,
  editVoglioData,
  onCreateVoglio,
  onUpdateVoglio,
}: {
  categoryId?: number | null;
  editVoglioData?: IVoglio | null;
  onCreateVoglio?: (newVoglio: IVoglio) => void;
  onUpdateVoglio?: (editedVoglio: IVoglio) => void;
}) {
  const CDNURL = import.meta.env.VITE_CDNURL;
  const session: string = localStorage.getItem("session")!;
  const user = session && JSON.parse(session)?.user;

  const [step, setStep] = useState(1);
  const [categoryList, setCategoryList] = useState<ICategory[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleFormChange = (newFormData: IVoglio) => {  
    setFormData(newFormData);
    setErrors({});
  };

  const handleProductSelected = (data: IVoglio) => {
    setFormData(data);
    setErrors({});
    setStep(2);
  };

  const handleQuickCreateCategory = (newCategory: ICategory) => {
    setCategoryList((prev) => [...prev, newCategory]);
    setFormData((prev) => ({ ...prev, categoryId: newCategory.id?.toString() ?? null }));
    setErrors((prev) => ({ ...prev, categoryId: undefined }));
  };

  const handleNextStep = () => {
    const newErrors: FormErrors = {};
    if (step === 1) {
      // search step — no required validation
    }
    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Title is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setStep(step + 1);
  };

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
    price: null,
    isPrivate: false,
    isTaken: false,
    userId: user?.id ?? "",
  };
  const [formData, setFormData] = useState<IVoglio>(emptyForm);
  let imageUrl = "";

  useEffect(() => {
    fetchCategoryList();
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
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (error) {
      console.log("Error fetching category list: ", error);
    } else {
      setCategoryList(data);
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
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Title is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) setStep(2);
      else if (newErrors.categoryId) setStep(3);
      return;
    }

    if (formData.imageFile) {
      await uploadImage(formData.imageFile);
    } else {
      imageUrl = formData.imageUrl;
    }

    const voglioInfo = {
      name: formData.name,
      notes: formData.notes,
      category_id: formData.categoryId,
      reference_link: formData.referenceLink,
      size_id: formData.sizeId,
      image_url: imageUrl,
      quantity: formData.quantity,
      is_private: formData.isPrivate,
    };

    // Update
    if (formData.id) {
      const voglioInfoUpdate = {...voglioInfo, id: formData.id}
      const { error } = await supabase
        .from("voglio")
        .update(voglioInfoUpdate)
        .eq("id", voglioInfoUpdate.id)
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
          onCreateVoglio({ ...formData, id: data[0].id, imageUrl });
        }
      }
    }

    setFormData({ ...emptyForm });
  };

  return (
    <form>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            step >= 1 ? "bg-[#7B61FF]" : "bg-[#E0E1E8]"
          }`}
        />
        <span
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            step >= 2 ? "bg-[#7B61FF]" : "bg-[#E0E1E8]"
          }`}
        />
        <span
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            step >= 3 ? "bg-[#7B61FF]" : "bg-[#E0E1E8]"
          }`}
        />
      </div>

      {step === 1 && (
        <VoglioFormStep1
          formData={formData}
          errors={errors}
          onFormChange={handleFormChange}
          onProductSelected={handleProductSelected}
          searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      searchResults={searchResults}
      setSearchResults={setSearchResults}
      searching={searching}
      setSearching={setSearching}
      searched={searched}
      setSearched={setSearched}

        />
      )}
      {step === 2 && (
        <VoglioFormStep2
          formData={formData}
          errors={errors}
          onFormChange={handleFormChange}
        />
      )}
      {step === 3 && (
        <VoglioFormStep3
          formData={formData}
          errors={errors}
          categoryList={categoryList}
          onFormChange={handleFormChange}
          onQuickCreateCategory={handleQuickCreateCategory}
        />
      )}
      <div className="mt-6 pt-4 border-t border-[#F0F1F6] xs:flex justify-end gap-3">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrevStep}
            className="w-full xs:w-auto text-xs font-bold"
          >
            Previous
          </Button>
        )}
        {step < 3 && (
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full xs:w-auto mt-2 xs:mt-0 text-xs font-bold"
          >
            Next
          </Button>
        )}
        {step === 3 && (
          <Button
            type="button"
            onClick={formDataPublish}
            className="w-full xs:w-auto mt-2 xs:mt-0 text-xs font-bold"
          >
            {editVoglioData ? "Update voglio" : "Create voglio"}
          </Button>
        )}
      </div>
    </form>
  );
}
