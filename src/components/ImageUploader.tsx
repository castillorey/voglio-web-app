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
    <div className="mt-1.5">
      {imageSrc ? (
        <div className="relative w-20 h-20 group rounded-xl overflow-hidden border border-[#F0F1F6] bg-[#F8F7FC]">
          <img
            src={imageSrc}
            alt="Upload image previewer"
            className="opacity-60 w-full h-full object-cover group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputFile.current?.click()}
              className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer"
            >
              <Pencil size={14} className="text-[#1B1B2D]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                onImageChange(null);
                if (inputFile?.current) inputFile.current.value = "";
              }}
              className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer"
            >
              <Eraser size={14} className="text-red-400" />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed border-[#E0E1E8] bg-white hover:border-[#7B61FF]/30 hover:bg-[#F5F3FF] transition-all cursor-pointer"
        >
          <ArrowUpTrayIcon
            aria-hidden="true"
            className="size-7 text-[#C4C7D3]"
          />
        </label>
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
