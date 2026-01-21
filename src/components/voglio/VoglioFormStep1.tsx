
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { LinkIcon } from "@heroicons/react/24/solid";

import { IVoglio } from "./VoglioForm";

export default function VoglioFormStep1({
  formData,
  onFormChange,
}: {
  formData: IVoglio;
  onFormChange: (formData: IVoglio) => void;
}) {
  return (
    <>
    {/* Reference link */}
      <div className="relative">
        <Label htmlFor="referenceLink" className="text-sm text-gray-900">
          Reference link <span className="text-xs text-gray-400">(Optional)</span>
        </Label>
        <Input
          id="referenceLink"
          name="referenceLink"
          type="text"
          onChange={(event) => {
            onFormChange({ ...formData, referenceLink: event.target.value });
          }}
          value={formData.referenceLink}
          className="mt-2 text-xs"
        />
        <span className="absolute inset-y-0  top-8 end-3 grid place-content-center">
          <LinkIcon className="size-4 text-gray-300" />
        </span>
      </div>

    </>
  );
}
