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
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { ISize, IVoglio } from "./VoglioForm";

export default function VoglioFormStep2({
  formData,
  sizeList,
  onFormChange,
}: {
  formData: IVoglio;
  sizeList: ISize[];
  onFormChange: (formData: IVoglio) => void;
}) {
  return (
    <div>
      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="text-xs">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          onChange={(event) => {
            onFormChange({ ...formData, notes: event.target.value });
          }}
          value={formData.notes}
          className="mt-2 text-sm"
        />
      </div>

      <div className="mt-2 flex justify-evenly gap-6">
        {/* Size */}
        <div className="w-full">
          <Label htmlFor="size" className="text-xs">
            Size
          </Label>

          <Select
            name="size"
            value={formData?.sizeId ? "" + formData.sizeId: undefined}
            onValueChange={(value) =>
              onFormChange({ ...formData, sizeId: value })
            }
          >
            <SelectTrigger className="mt-1.5 w-full text-xs">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sizeList.map((size) => (
                  <SelectItem
                    className="text-xs"
                    key={size.id}
                    value={size.id.toString()}
                  >
                    {size.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity */}
        <div className="w-full">
          <Label htmlFor="quantity" className="text-xs">
            Quantity
          </Label>

          <div className="mt-1.5 flex items-center gap-1">
            <span className="w-full h-9 text-xs rounded-md border border-neutral-200 bg-transparent px-3 py-2 shadow-sm">
              {formData.quantity}
            </span>
            <Button
              variant="secondary"
              size="icon"
              type="button"
              onClick={() => {
                if (formData.quantity > 1) {
                  onFormChange({
                    ...formData,
                    quantity: formData.quantity - 1,
                  });
                }
              }}
              className="px-2"
            >
              <Minus size={12} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              type="button"
              onClick={() => {
                onFormChange({
                  ...formData,
                  quantity: formData.quantity + 1,
                });
              }}
              className="px-2"
            >
              <Plus size={12} />
            </Button>
          </div>
        </div>
      </div>

      {/* Reference link */}
      <div className="mt-2 relative">
        <Label htmlFor="referenceLink" className="text-xs">
          Reference link
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
    </div>
  );
}
