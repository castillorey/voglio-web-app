import { useState } from "react";
import supabase from "../supabase-client";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { ICategory } from "./VoglioForm";

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
  const [emojiInput, setEmojiInput] = useState("❔");
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
    };

    const { data, error } = await supabase
      .from("category")
      .insert([newCategoryInfo])
      .select();

    if (error) {
      console.log("Error adding new Category: ", error);
    } else {
      onCreateCategory({ id: data[0].id, ...formData });
    }

    setFormData(emptyForm);
  };
  return (
    <div>
      {/* Emoji */}
      <p className="py-5 text-center text-6xl">
        <span>{emojiInput}</span>
      </p>
      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => setOpenEmoji(!openEmoji)}
          className="text-xs rounded-lg px-3 py-1.5 text-gray-500"
        >
          {!openEmoji ? "Emoji picker" : "Close"}
        </Button>
      </div>

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
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Name
            </label>
            <input
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

          {/* Is private */}
          <div className="mt-2 flex items-center space-x-2">
            <Switch
              id="is-private"
              checked={formData.isPrivate}
              onCheckedChange={(event) => {
                setFormData({ ...formData, isPrivate: event });
              }}
            />
            <Label htmlFor="is-private">Is Private?</Label>
          </div>

          {/* description */}
          <div className="mt-2">
            <label
              htmlFor="notes"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              onChange={(event) => {
                setFormData({ ...formData, description: event.target.value });
              }}
              value={formData.description}
              className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:gray-indigo-600 sm:text-sm/6"
            />
          </div>
          <Button
            type="button"
            onClick={formDataPublish}
            className="w-full mt-5 justify-self-end rounded-lgpx-5 py-3 text-sm font-medium text-white"
          >
            Create
          </Button>
        </>
      )}
    </div>
  );
}
