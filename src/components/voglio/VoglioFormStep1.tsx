import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ICategory } from "./VoglioForm";
import ImageUploader from "../ImageUploader";

export default function VoglioFormStep1({
  formData,
  categoryList,
  onFormChange,
}: {
  formData: any;
  categoryList: ICategory[];
  onFormChange: (formData: any) => void;
}) {
  return (
    <div>
      {/* Category */}
      <div className="flex items-center gap-4">
        <label className="text-xs font-medium text-gray-900" htmlFor="category">
          Category:
        </label>
        {categoryList.length > 0 && (
          <Select
            name="category"
            defaultValue={"" + formData.categoryId}
            onValueChange={(value) => {
              console.log("I am entering here:", value);
              return onFormChange({ ...formData, categoryId: +value });
            }}
          >
            <SelectTrigger className="w-auto h-[25px] text-xs">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categoryList.map((category) => (
                  <SelectItem
                    className="text-xs"
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Reference image */}
      <ImageUploader
        formData={formData}
        onImageChange={(newImageFile) =>
          onFormChange({ ...formData, imageFile: newImageFile })
        }
      />
      {/* Name */}
      <div className="mt-2">
        <label
          htmlFor="name"
          className="block text-xs font-medium text-gray-900"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, name: event.target.value });
          }}
          value={formData.name}
          className="mt-2 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
        />
      </div>
    </div>
  );
}
