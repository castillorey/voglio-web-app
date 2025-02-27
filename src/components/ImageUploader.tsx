import { Button } from "@/components/ui/button";
import { PhotoIcon } from "@heroicons/react/24/solid";
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
        className="block text-xs font-medium text-gray-900"
      >
        Reference image
      </label>
      {imageSrc ? (
        <>
          <div className="h-40 w-full group mt-2 bg-gray-100 rounded-lg">
            <img
              src={imageSrc}
              alt="Upload image previewer"
              className="opacity-50 w-full h-full object-cover rounded-lg"
            />
            <div className="w-auto h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => {
                  inputFile.current?.click();
                }}
              >
                <Pencil size={22} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => {
                  setImageSrc(null);
                  onImageChange(null);
                }}
              >
                <Eraser size={22} color="red" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full mt-2 flex flex-col justify-center items-center text-center rounded-lg border-2 border-dashed border-gray-250 px-6 py-3">
          <PhotoIcon
            aria-hidden="true"
            className="mx-auto size-12 text-gray-300"
          />
          <div className="flex text-sm/6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <span>Upload a file</span>
            </label>
            <p className="pl-1">or drag and drop</p>
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
