import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ChevronDown } from "lucide-react";
import { LinkIcon } from "@heroicons/react/24/solid";

import { ICategory, IVoglio } from "./VoglioForm";

export default function VoglioFormStep2({
  formData,
  errors,
  categoryList,
  onFormChange,
}: {
  formData: IVoglio;
  errors: { name?: string; imageUrl?: string; categoryId?: string };
  categoryList: ICategory[];
  onFormChange: (formData: IVoglio) => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-4 mt-2">
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

      {/* Category */}
      <div>
        <Label htmlFor="category" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          Category
        </Label>
        <Select
          name="category"
          value={formData?.categoryId ?? undefined}
          onValueChange={(value) => {
            if (value) return onFormChange({ ...formData, categoryId: value });
          }}
        >
          <SelectTrigger className={`mt-1.5 w-full ${errors.categoryId ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoryList.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category?.id?.toString() ?? ""}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
        )}
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between pt-2">
        <div className="pr-4">
          <p className="text-sm font-medium text-[#1B1B2D]">
            Private voglio
          </p>
          <p className="text-xs text-[#6B6E85] mt-0.5">
            Only visible to you and your friends
          </p>
        </div>
        <Switch
          id="is-private"
          checked={formData.isPrivate}
          onCheckedChange={(checked) =>
            onFormChange({ ...formData, isPrivate: checked })
          }
        />
      </div>

      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#7B61FF] uppercase tracking-wider"
      >
        <ChevronDown
          size={14}
          className={`transition-transform ${showMore ? "rotate-180" : ""}`}
        />
        {showMore ? "Less" : "Add more"}
      </button>

      {showMore && (
        <div className="flex gap-4">
          {/* Price */}
          <div className="flex-1">
            <Label htmlFor="price" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
              Price <span className="text-xs font-normal normal-case text-[#8C8F9E]">(Optional)</span>
            </Label>

            <Input
              id="price"
              name="price"
              type="number"
              onChange={(event) => {
                onFormChange({ ...formData, price: +event.target.value });
              }}
              value={formData.price ?? ""}
              placeholder="0.00"
              className="mt-1.5"
            />
          </div>

          {/* Quantity */}
          <div className="flex-1">
            <Label htmlFor="quantity" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
              Quantity
            </Label>

            <div className="mt-2 flex items-center gap-1.5">
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
                className="size-8 rounded-lg"
              >
                <Minus size={14} />
              </Button>
              <span className="w-14 text-sm text-center rounded-xl border border-[#E8E9EE] bg-white px-3 py-2 text-[#1B1B2D]">
                {formData.quantity}
              </span>
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
                className="size-8 rounded-lg"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
