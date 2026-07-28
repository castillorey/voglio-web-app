import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import supabase from "../../supabase-client";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ICategory } from "../voglio/VoglioForm";
import { useTranslation } from "react-i18next";

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

export default function CategoryForm({
  editCategoryData,
  onCreateCategory,
  onUpdateCategory,
}: {
  editCategoryData: ICategory | null
  onCreateCategory?: (newCategory: ICategory) => void;
  onUpdateCategory?: (editedCategory: ICategory) => void;
}) {
  const { t } = useTranslation();
  const emptyForm = {
    id: null,
    name: "",
    description: "",
    emojiCode: "❔",
    isPrivate: false,
  };
  const [formData, setFormData] = useState<ICategory>(emptyForm);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [nameError, setNameError] = useState("");

  const isEditing = !!editCategoryData;

  useEffect(() => {
    if (editCategoryData) {
      setFormData({ ...formData, ...editCategoryData });
      setOpenEmoji(false);
    }
  }, []);

  const handlePreset = (preset: { name: string; emoji: string }) => {
    setFormData({ ...formData, name: preset.name, emojiCode: preset.emoji });
    setOpenEmoji(false);
  };

  const handleEmojiChange = (data: any) => {
    setFormData({ ...formData, emojiCode: data.emoji });
    setOpenEmoji(false);
  };

  const formDataPublish = async () => {
    if (!formData.name.trim()) {
      setNameError(t("categoryForm.nameRequired"));
      return;
    }

    const categoryInfo = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      emoji_code: formData.emojiCode,
      is_private: formData.isPrivate
    };

    // Update
    if (categoryInfo.id) {
      const { error } = await supabase
        .from("category")
        .update(categoryInfo)
        .eq("id", categoryInfo.id)
        .select();

      if (error) {
        console.log("Error updating new Category: ", error);
      } else {
        if (onUpdateCategory) {
          onUpdateCategory({ ...formData });
        }
      }
    } else { // Create
      delete (categoryInfo as any).id;

      const { data, error } = await supabase
        .from("category")
        .insert([categoryInfo])
        .select();

      if (error) {
        console.log("Error adding new Category: ", error);
      } else {
        onCreateCategory && onCreateCategory({ vogliosCount: 0, ...formData, id: data[0].id });
      }

      setFormData(emptyForm);
    }
    
  };
  return (
    <div className="space-y-4 mt-2">
      {/* Preset categories (only when creating) */}
      {!isEditing && (
        <div className="flex flex-wrap gap-1.5">
          {presetCategories.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePreset(preset)}
              className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                formData.name === preset.name && formData.emojiCode === preset.emoji
                  ? "border-[#7B61FF] text-[#7B61FF] bg-[#F5F3FF]"
                  : "border-[#E0E1E8] text-[#6B6E85] hover:border-[#7B61FF] hover:text-[#7B61FF] hover:bg-[#F5F3FF]"
              }`}
            >
              <span>{preset.emoji}</span>
              {preset.name}
            </button>
          ))}
        </div>
      )}

      {/* Emoji + Name row */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setOpenEmoji(!openEmoji)}
            className="size-10 rounded-lg border border-[#E0E1E8] text-xl flex items-center justify-center hover:border-[#7B61FF] transition-colors"
          >
            {formData.emojiCode}
          </button>
        </div>
        <div className="flex-1">
          <Input
            id="name"
            name="name"
            type="text"
            onChange={(event) => {
              setFormData({ ...formData, name: event.target.value });
              setNameError("");
            }}
            value={formData.name}
            placeholder={t("categoryForm.name")}
            className={`${nameError ? "border-red-500" : ""}`}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-500">{nameError}</p>
          )}
        </div>
      </div>

      {/* Emoji picker dialog */}
      <Dialog open={openEmoji} onOpenChange={setOpenEmoji}>
        <DialogContent
          className="sm:max-w-fit p-2"
          onPointerDownOutside={(e) => {
            e.preventDefault();
            e.detail.originalEvent.stopPropagation();
            setOpenEmoji(false);
          }}
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">{t("categoryForm.emojiPicker")}</DialogTitle>
          <div className="relative">
            <EmojiPicker
              emojiStyle={EmojiStyle.NATIVE}
              previewConfig={{ showPreview: false }}
              onEmojiClick={handleEmojiChange}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* description */}
      <div>
        <Label htmlFor="description" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
          {t("categoryForm.description")}
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          onChange={(event) => {
            setFormData({ ...formData, description: event.target.value });
          }}
          value={formData.description}
          className="mt-1.5"
        />
      </div>

      {/* Is private */}
      <div className="flex justify-between items-center pt-2">
        <div className="pr-4">
          <p className="text-sm font-medium text-[#1B1B2D]">
            {t("categoryForm.privateCategory")}
          </p>
          <p className="text-xs text-[#6B6E85] mt-0.5">
            {t("categoryForm.onlyFriends")}
          </p>
        </div>
        <Switch
          id="is-private"
          checked={formData.isPrivate}
          onCheckedChange={(event) => {
            setFormData({ ...formData, isPrivate: event });
          }}
        />
      </div>

      <div className="xs:flex justify-end pt-2">
        <Button
          type="button"
          onClick={formDataPublish}
          className="w-full xs:w-auto text-xs font-bold"
        >
          {editCategoryData ? t("categoryForm.updateCategory") : t("categoryForm.createCategory")}
        </Button>
      </div>
    </div>
  );
}
