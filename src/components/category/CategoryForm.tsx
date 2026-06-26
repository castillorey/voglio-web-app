import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Trash2 } from "lucide-react";

import { ICategory } from "../voglio/VoglioForm";

export default function CategoryForm({
  editCategoryData,
  onCreateCategory,
  onUpdateCategory,
}: {
  editCategoryData: ICategory | null
  onCreateCategory?: (newCategory: ICategory) => void;
  onUpdateCategory?: (editedCategory: ICategory) => void;
}) {
  const emptyForm = {
    id: null,
    name: "",
    description: "",
    emojiCode: "❔",
    isPrivate: false,
  };
  const [formData, setFormData] = useState<ICategory>(emptyForm);
  const [emojiInput, setEmojiInput] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);

  useEffect(() => {
    if (editCategoryData) {
      setEmojiInput(editCategoryData.emojiCode);
      setFormData({ ...formData, ...editCategoryData });
      setOpenEmoji(false);
    }
  }, []);

  const handleEmojiChange = (data: any) => {
    setEmojiInput(data.emoji);
    setFormData({ ...formData, emojiCode: data.emoji });
    setOpenEmoji(false);
  };

  const formDataPublish = async () => {
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
      {/* Emoji */}
      {emojiInput && (
        <div className="flex justify-center text-5xl">
          <p className="w-[100px] group relative text-center">
            <span>{emojiInput}</span>
            <Trash2
              size={14}
              onClick={() => {
                setEmojiInput("");
                setFormData({ ...formData, emojiCode: "" });
              }}
              className="hidden cursor-pointer group-hover:block absolute top-0 right-2 text-red-400"
            />
          </p>
        </div>
      )}
      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => setOpenEmoji(!openEmoji)}
          className="text-xs rounded-full"
        >
          {!openEmoji ? "Choose emoji" : "Close"}
        </Button>
      </div>

      {/* Emoji picker */}
      {openEmoji ? (
        <div className="flex justify-center items-center">
          <EmojiPicker
            emojiStyle={EmojiStyle.NATIVE}
            previewConfig={{ showPreview: false }}
            onEmojiClick={handleEmojiChange}
          />
        </div>
      ) : (
        <>
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={(event) => {
                setFormData({ ...formData, name: event.target.value });
              }}
              value={formData.name}
              className="mt-1.5"
            />
          </div>

          {/* description */}
          <div>
            <Label htmlFor="description" className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider">
              Description
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
                Private category
              </p>
              <p className="text-xs text-[#6B6E85] mt-0.5">
                Only you and your friends can see this
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
              {editCategoryData ? "Update category" : "Create category"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
