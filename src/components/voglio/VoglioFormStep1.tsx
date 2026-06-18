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
    <div className="space-y-4 mt-2">
      <div className="text-center py-6">
        <p className="text-sm text-[#6B6E85]">
          Start by pasting a link to the item you want
        </p>
        <p className="text-xs text-[#8C8F9E] mt-1">
          We'll try to fetch the details automatically
        </p>
      </div>

      {/* Reference link */}
      <div className="relative">
        <Label htmlFor="referenceLink" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          Reference link <span className="text-xs font-normal normal-case text-[#8C8F9E]">(Optional)</span>
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
          <LinkIcon className="size-4 text-[#C4C7D3]" />
        </span>
      </div>
    </div>
  );
}
