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
import { Plus, Minus, ChevronDown, LayoutGrid } from "lucide-react";
import { LinkIcon } from "@heroicons/react/24/solid";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

import supabase from "../../supabase-client";
import { ICategory, IVoglio } from "./VoglioForm";

export default function VoglioFormStep2({
  formData,
  errors,
  categoryList,
  onFormChange,
  onQuickCreateCategory,
}: {
  formData: IVoglio;
  errors: { name?: string; imageUrl?: string; categoryId?: string };
  categoryList: ICategory[];
  onFormChange: (formData: IVoglio) => void;
  onQuickCreateCategory?: (category: ICategory) => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("❔");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [creating, setCreating] = useState(false);

const presetCategories = [
  { name: "Birthday", emoji: "🎂" },
  { name: "Christmas", emoji: "🎄" },
  { name: "Baby Shower", emoji: "🍼" },
  { name: "Wedding", emoji: "💍" },
  { name: "Housewarming", emoji: "🏠" },
  { name: "Graduation", emoji: "🎓" },
  { name: "Valentine", emoji: "💝" },
  { name: "Just Because", emoji: "✨" },
];

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("category")
      .insert([{
        name: newCategoryName,
        description: "",
        emoji_code: newCategoryEmoji,
        is_private: false,
      }])
      .select();

    if (error) {
      console.log("Error creating category:", error);
      setCreating(false);
      return;
    }

    const newCategory: ICategory = {
      id: data[0].id,
      name: newCategoryName,
      description: "",
      emojiCode: newCategoryEmoji,
      isPrivate: false,
    };

    onQuickCreateCategory?.(newCategory);
    setNewCategoryName("");
    setNewCategoryEmoji("❔");
    setShowCreateForm(false);
    setShowEmojiPicker(false);
    setCreating(false);
  };

  const categorySection = () => {
    if (categoryList.length === 0 && !showCreateForm) {
      return (
        <div>
          <Label className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
            Category
          </Label>
          <div className="mt-1.5 rounded-xl border border-dashed border-[#E0E1E8] p-5 text-center">
            <p className="text-sm text-[#6B6E85]">
              You don&apos;t have any categories yet
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateForm(true)}
              className="mt-3 text-xs font-bold"
            >
              <LayoutGrid className="size-3.5 mr-1.5" />
              Create a category
            </Button>
          </div>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
          )}
        </div>
      );
    }

    if (showCreateForm) {
      return (
        <div>
          <Label className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
            Category
          </Label>
          <div className="mt-1.5 space-y-3 rounded-xl border border-[#E0E1E8] p-4">
            <div className="flex flex-wrap gap-1.5">
              {presetCategories.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setNewCategoryName(preset.name);
                    setNewCategoryEmoji(preset.emoji);
                  }}
                  className="flex items-center gap-1 rounded-full border border-[#E0E1E8] px-2.5 py-1 text-xs text-[#6B6E85] hover:border-[#7B61FF] hover:text-[#7B61FF] hover:bg-[#F5F3FF] transition-colors"
                >
                  <span>{preset.emoji}</span>
                  {preset.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="size-10 shrink-0 rounded-lg border border-[#E0E1E8] text-xl flex items-center justify-center hover:border-[#7B61FF] transition-colors"
              >
                {newCategoryEmoji}
              </button>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1"
              />
            </div>

            {showEmojiPicker && (
              <div className="flex justify-center">
                <EmojiPicker
                  emojiStyle={EmojiStyle.NATIVE}
                  previewConfig={{ showPreview: false }}
                  onEmojiClick={(data) => {
                    setNewCategoryEmoji(data.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowCreateForm(false);
                  setShowEmojiPicker(false);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || creating}
                className="text-xs"
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
          )}
        </div>
      );
    }

    return (
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
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="mt-1.5 flex items-center gap-1 text-xs text-[#7B61FF] font-semibold hover:underline"
        >
          <LayoutGrid className="size-3" />
          Create new category
        </button>
      </div>
    );
  };

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
      {categorySection()}

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
