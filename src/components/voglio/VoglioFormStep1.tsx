import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "../ImageUploader";

import { IVoglio } from "./VoglioForm";

export default function VoglioFormStep1({
  formData,
  errors,
  onFormChange,
}: {
  formData: IVoglio;
  errors: { name?: string; imageUrl?: string; categoryId?: string };
  onFormChange: (formData: IVoglio) => void;
}) {
  return (
    <div className="space-y-4 mt-2">
      {/* Title */}
      <div>
        <Label htmlFor="name" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          Title
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, name: event.target.value });
          }}
          value={formData.name}
          className={`mt-1.5 ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="notes" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          Description
        </Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          onChange={(event) => {
            onFormChange({ ...formData, notes: event.target.value });
          }}
          value={formData.notes}
          className="mt-1.5"
        />
      </div>

      {/* Reference image */}
      <div>
        <Label htmlFor="image" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          Reference image
        </Label>
        <ImageUploader
          formData={formData}
          onImageChange={(newImageFile) =>
            onFormChange({ ...formData, imageUrl: "", imageFile: newImageFile })
          }
        />
        {/* {errors.imageUrl && (
          <p className="mt-1 text-xs text-red-500">{errors.imageUrl}</p>
        )} */}
      </div>
    </div>
  );
}
