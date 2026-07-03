import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "../ImageUploader";

import { IVoglio } from "./VoglioForm";

export default function VoglioFormStep1({
  formData,
  onFormChange,
}: {
  formData: IVoglio;
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
          className="mt-1.5"
        />
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
          Reference image <span className="text-xs font-normal normal-case text-[#8C8F9E]">(Optional)</span>
        </Label>
        <ImageUploader
          formData={formData}
          onImageChange={(newImageFile) =>
            onFormChange({ ...formData, imageUrl: "", imageFile: newImageFile })
          }
        />
      </div>
    </div>
  );
}
