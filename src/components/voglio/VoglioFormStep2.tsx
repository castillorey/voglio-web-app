import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import ImageUploader from "../ImageUploader";

import { ICategory, IVoglio } from "./VoglioForm";

export default function VoglioFormStep2({
  formData,
  categoryList,
  onFormChange,
}: {
  formData: IVoglio;
  categoryList: ICategory[];
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
          <SelectTrigger className="mt-1.5 w-full">
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
