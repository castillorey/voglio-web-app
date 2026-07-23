import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, ChevronDown } from "lucide-react";
import ImageUploader from "../ImageUploader";

import { IVoglio } from "./VoglioForm";
import { useTranslation } from "react-i18next";

export default function VoglioFormStep2({
  formData,
  errors,
  onFormChange,
}: {
  formData: IVoglio;
  errors: { name?: string; imageUrl?: string; categoryId?: string };
  onFormChange: (formData: IVoglio) => void;
}) {
  const [showDescription, setShowDescription] = useState(!!formData.notes);
  const { t } = useTranslation();

  return (
    <div className="space-y-4 mt-2">
      {/* Reference image */}
      <div>
        <Label htmlFor="image" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          {t("voglioForm.referenceImage")}
        </Label>
        <ImageUploader
          formData={formData}
          onImageChange={(newImageFile) =>
            onFormChange({ ...formData, imageUrl: "", imageFile: newImageFile })
          }
        />
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="name" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          {t("voglioForm.title")}
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

      {/* Description toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#7B61FF] uppercase tracking-wider"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${showDescription ? "rotate-180" : ""}`}
          />
          {showDescription ? t("voglioForm.hideDescription") : t("voglioForm.addDescription")}
        </button>
        {showDescription && (
          <div className="mt-3">
            <Label htmlFor="notes" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
              {t("voglioForm.description")}
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
        )}
      </div>

      {/* Reference link */}
      <div className="relative">
        <Label htmlFor="referenceLink" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          {t("voglioForm.referenceLink")} <span className="text-xs font-normal normal-case text-[#8C8F9E]">({t("common.optional")})</span>
        </Label>
        <Input
          id="referenceLink"
          name="referenceLink"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, referenceLink: event.target.value });
          }}
          value={formData.referenceLink}
          placeholder="https://..."
          className="mt-1.5 pr-10"
        />
        <span className="absolute inset-y-0 top-8 end-3 grid place-content-center pointer-events-none">
          <Link className="size-4 text-[#C4C7D3]" />
        </span>
      </div>
    </div>
  );
}
