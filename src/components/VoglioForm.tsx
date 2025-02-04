import { useState } from "react";
import VoglioFormStep1 from "./VoglioFormStep1";
import VoglioFormStep2 from "./VoglioFormStep2";
import supabase from "../supabase-client";
import { v4 as uuidv4 } from "uuid";

export default function VoglioForm({
  onCreateVoglio,
}: {
  onCreateVoglio: (newVoglio: any) => void;
}) {
  const CDNURL =
    "https://bblscslptefmqyjhizvl.supabase.co/storage/v1/object/public/images/";
  const [step, setStep] = useState(1);
  const session: string = localStorage.getItem("session")!;
  const user = session && JSON.parse(session)?.user;

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step > 1 ? step - 1 : 1);

  const categoryList = [
    { id: 0, name: "Select an option" },
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
    { id: 3, name: "Category 3" },
  ];
  const sizeList = [
    { id: 0, name: "Select an option" },
    { id: 1, name: "Size 1" },
    { id: 2, name: "Size 2" },
    { id: 3, name: "Size 3" },
  ];

  const emptyForm = {
    name: "",
    notes: "",
    categoryId: null,
    referenceLink: "",
    sizeId: null,
    imageFile: null,
    imageUrl: "",
  };

  let [formData, setFormData] = useState(emptyForm);

  const uploadImage = async (imageFile: File) => {
    if (!imageFile) return;
    const fileName = user.id + "/" + uuidv4();
    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, imageFile);

      if (!error) {
        setFormData(prev => ({ ...prev, imageUrl: CDNURL + fileName }));
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
      category_id: formData.categoryId,
      reference_link: formData.referenceLink,
      size_id: formData.sizeId,
      image_url: formData.imageUrl
    };

    const { data, error } = await supabase
      .from("voglio")
      .insert([newVoglioInfo])
      .single();

    if (error) {
      console.log("Error adding new Voglio: ", error);
    } else {
      onCreateVoglio(newVoglioInfo);
    }

    setFormData(emptyForm);
  };

  return (
    <form>
      {step === 1 && (
        <VoglioFormStep1
          formData={formData}
          categoryList={categoryList}
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
        className={`mt-6 pt-3 border-t border-gray-900/10 sm:flex ${
          step == 2 ? "justify-between" : "justify-end"
        }`}
      >
        {step > 1 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-full sm:w-auto justify-self-start rounded-lg bg-gray-500 px-5 py-3 text-sm font-medium text-white"
          >
            Previous
          </button>
        )}
        {step < 2 && (
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full sm:w-auto justify-self-end rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
          >
            Next
          </button>
        )}
        {step == 2 && (
          <button
            type="button"
            onClick={formDataPublish}
            className="w-full mt-3 sm:mt-0 sm:w-auto justify-self-end rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
          >
            Create
          </button>
        )}
      </div>
    </form>
  );
}
