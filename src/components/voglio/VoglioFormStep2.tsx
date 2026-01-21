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
    <>
      {/* Title */}
      <div className="mt-2">
        <Label htmlFor="name" className="text-sm text-gray-900">
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
          className="mt-1 text-sm"
        />
      </div>

      <div className="mt-2 flex justify-evenly gap-8">
        {/* Price */}
        <div className="w-full">
          <Label htmlFor="price" className="text-sm text-gray-900">
            Price
          </Label>

          <Input
            id="price"
            name="price"
            type="number"
            onChange={(event) => {
              onFormChange({ ...formData, price: +event.target.value });
            }}
            value={formData.price}
            className="mt-1 text-sm"
          />
        </div>

        {/* Quantity */}
        <div className="w-full">
          <Label htmlFor="quantity" className="text-sm text-gray-900">
            Quantity
          </Label>

          <div className="mt-1.5 flex items-center gap-1">
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
            <span className="w-16 text-sm text-center rounded-md border border-neutral-200 bg-transparent px-3 py-2 shadow-sm">
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
              className="px-2"
            >
              <Plus size={12} />
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="notes" className="text-sm text-gray-900">
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
          className="mt-2 text-sm"
        />
      </div>

      {/* Category */}
      <div className="flex items-center gap-4 mt-4">
        <Label className="text-sm text-gray-900" htmlFor="category">
          Category:
        </Label>

        <Select
          name="category"
          value={formData?.categoryId ?? undefined}
          onValueChange={(value) => {
            if (value) return onFormChange({ ...formData, categoryId: value });
          }}
        >
          <SelectTrigger className="w-[150px] text-xs">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoryList.map((category) => (
                <SelectItem
                  className="text-xs"
                  key={category.id}
                  value={category?.id.toString()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Reference image */}
      <ImageUploader
        formData={formData}
        onImageChange={(newImageFile) =>
          onFormChange({ ...formData, imageUrl: "", imageFile: newImageFile })
        }
      />
    </>
  );
}
