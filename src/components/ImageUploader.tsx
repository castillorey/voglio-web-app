import { PhotoIcon } from "@heroicons/react/24/solid";

export default function ImageUploader({formData, onImageChange}: {formData: any; onImageChange: (imageFile: File) => void;}) {
  const uploadImage = async (e: any) => {
    e.preventDefault();
    let file = e?.target?.files[0];
    if (!file) return;

    onImageChange(file);
  };

  return (
    <div className="mt-4">
      <label
        htmlFor="cover-photo"
        className="block text-sm/6 font-medium text-gray-900"
      >
        Reference image
      </label>
      {formData.imageFile ? (
        <img src={URL.createObjectURL(formData.imageFile)} alt="Upload image previewer" className="h-40 w-full mt-2 rounded-lg object-cover" />
      ) : (
        <div className="w-full mt-2 flex flex-col justify-center items-center text-center rounded-lg border border-dashed border-gray-900/25 px-6 py-3">
            <PhotoIcon
              aria-hidden="true"
              className="mx-auto size-12 text-gray-300"
            />
            <div className="flex text-sm/6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => uploadImage(e)}
                  value={""}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
      )}
    </div>
  );
}
