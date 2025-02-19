import { useState } from "react";
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
  onCreateCategory,
}: {
  onCreateCategory: (newCategory: ICategory) => void;
}) {
  const emptyForm = {
    name: "",
    description: "",
    emojiCode: "❔",
    isPrivate: false,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [emojiInput, setEmojiInput] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);

  const handleEmojiChange = (data: any) => {
    setEmojiInput(data.emoji);
    setFormData({ ...formData, emojiCode: data.emoji });
    setOpenEmoji(false);
  };

  const formDataPublish = async () => {
    const newCategoryInfo = {
      name: formData.name,
      description: formData.description,
      emoji_code: formData.emojiCode,
      is_private: formData.isPrivate,
    };

    const { data, error } = await supabase
      .from("category")
      .insert([newCategoryInfo])
      .select();

    if (error) {
      console.log("Error adding new Category: ", error);
    } else {
      onCreateCategory({ id: data[0].id, vogliosCount: 0, ...formData });
    }

    setFormData(emptyForm);
  };
  return (
    <>
      {/* Emoji */}
      {emojiInput && (
        <div className="mt-5 flex justify-center text-6xl ">
          <p className="w-[120px] group relative text-center">
            <span>{emojiInput}</span>
            <Trash2
              size={14}
              onClick={() => {
                setEmojiInput("");
                setFormData({ ...formData, emojiCode: "" });
              }}
              className="hidden cursor-pointer group-hover:block absolute top-0 right-4 text-red-500"
            />
          </p>
        </div>
      )}
      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => setOpenEmoji(!openEmoji)}
          className="mt-2 text-xs rounded-xl  text-gray-500"
        >
          {!openEmoji ? "Emoji picker" : "Close"}
        </Button>
      </div>

      {/* Emoji picker */}
      {openEmoji ? (
        <div className="mt-3 flex justify-center items-center">
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={(event) => {
                setFormData({ ...formData, name: event.target.value });
              }}
              value={formData.name}
              className="mt-2 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
            />
          </div>

          {/* description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={1}
              onChange={(event) => {
                setFormData({ ...formData, description: event.target.value });
              }}
              value={formData.description}
              className="mt-2 text-sm"
            />
          </div>

          {/* Is private */}
          <div className="flex justify-between items-center space-x-4">
            <div>
              <Label htmlFor="is-private" className="font-medium">
                Is private
              </Label>
              <p className="text-xs text-gray-500">
                Only you and your friends can see this category
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

          <div className="xs:flex justify-end">
            <Button
              type="button"
              onClick={formDataPublish}
              className="w-full mt-5 xs:w-auto justify-self-end text-xs"
            >
              Create
            </Button>
          </div>
        </>
      )}
    </>
  );
}
