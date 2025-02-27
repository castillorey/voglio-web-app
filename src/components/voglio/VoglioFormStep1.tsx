import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
        <Label className="text-xs" htmlFor="category">
          Category:
        </Label>
        {categoryList.length > 0 && (
          <Select
            name="category"
            defaultValue={"" + formData.categoryId}
            onValueChange={(value) => {
              return onFormChange({ ...formData, categoryId: +value });
            }}
          >
            <SelectTrigger className="w-auto text-xs">
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
          onFormChange({ ...formData, imageUrl: "", imageFile: newImageFile })
        }
      />
      {/* Name */}
      <div className="mt-2">
        <Label htmlFor="name" className="text-xs">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, name: event.target.value });
          }}
          value={formData.name}
          className="mt-2 text-sm"
        />
      </div>
    </div>
  );
}
