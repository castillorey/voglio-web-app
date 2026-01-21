import { Button } from "@/components/ui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { Pencil, Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ImageUploader({
  formData,
  onImageChange,
}: {
  formData: any;
  onImageChange: (imageFile: File | null) => void;
}) {
  const inputFile = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const uploadImage = async (e: any) => {
    e.preventDefault();
    let file = e?.target?.files[0];
    if (!file) return;

    onImageChange(file);
  };

  useEffect(() => {
    if (formData.imageUrl) {
      setImageSrc(formData.imageUrl);
    } else if (formData.imageFile) {
      setImageSrc(URL.createObjectURL(formData.imageFile)!);
    } else {
      setImageSrc(null);
    }
  }, [formData]);

  return (
    <div className="mt-4">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium text-gray-900"
      >
        Reference image
      </label>
      {imageSrc ? (
        <>
          <div className="relative w-20 h-20 group mt-2 bg-gray-200 rounded-lg">
            <img
              src={imageSrc}
              alt="Upload image previewer"
              className="opacity-50 w-full h-full object-cover rounded-lg"
            />
            <div className="w-auto h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
              <Pencil
                color="white"
                className="cursor-pointer"
                size={18}
                onClick={() => {
                  inputFile.current?.click();
                }}
              />
              <Eraser
                color="#F87C63"
                className="cursor-pointer"
                size={18}
                onClick={() => {
                  setImageSrc(null);
                  onImageChange(null);
                  if(inputFile?.current)
                    inputFile.current.value = "";
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-20 mt-2 flex flex-col justify-center items-center text-center rounded-lg border-2 border-dashed border-gray-250 py-5">
          <div className="flex text-sm/6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white"
            >
              <ArrowUpTrayIcon
                aria-hidden="true"
                className="mx-auto size-8 text-gray-400"
              />
            </label>
          </div>
        </div>
      )}
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        accept="image/png, image/jpeg"
        ref={inputFile}
        onChange={(e) => uploadImage(e)}
        className="sr-only"
      />
    </div>
  );
}
