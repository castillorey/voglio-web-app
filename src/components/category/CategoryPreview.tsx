import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Ellipsis, Pencil, Delete, Image as ImageIcon } from "lucide-react";

import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import supabase from "../../supabase-client";
import { ICategory } from "../voglio/VoglioForm";

export default function CategoryPreview({
  props,
  onDeleteClick,
  OnEditClick,
  isReadOnly,
}: {
  props: ICategory;
  onDeleteClick: (categoryId: number) => void;
  OnEditClick: (categoryData: ICategory) => void;
  isReadOnly?: boolean;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");

  useEffect(() => {
    if (props.id === null) return;
    fetchThumbnails();
  }, [props.id]);

  const fetchThumbnails = async () => {
    const { data } = await supabase
      .from("voglio")
      .select("image_url")
      .eq("category_id", props.id)
      .eq("is_private", false)
      .not("image_url", "is", null)
      .limit(4);

    if (data) {
      setThumbnails(data.map((v) => v.image_url).filter(Boolean));
    }
  };

  const handleOnDelete = async () => {
    if (props.id === null) return;
    const { data, error } = await supabase
      .from("category")
      .delete()
      .eq("id", props.id)
      .select();
    if (error) {
      console.log("Error deleting: ", error);
    } else if (!data || data.length === 0) {
      console.log("Delete failed: category not found or permission denied");
    } else {
      onDeleteClick(props.id);
    }
    setOpen(false);
  };
  // TODO: Make Desktop and Mobile Dropdowns generic components
    const DesktopDropdownMenu = () => {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg absolute top-2 right-3 z-10"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] text-sm">
          <DropdownMenuLabel className="text-xs text-gray-800">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-xs"
              onClick={() => OnEditClick(props)}
            >
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-red-600"
              onClick={handleOnDelete}
            >
              <Delete className="text-red-400" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileDrawerMenu = () => {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg absolute top-2 right-3 z-10"
          >
            <Ellipsis />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mt-4 border-t">
          <DrawerTitle aria-describedby="Mobile actions menu" />
          <DrawerDescription aria-describedby="Mobile actions menu" />
          <Command className="md:min-w-[450px]">
            <CommandList>
              <CommandGroup heading="Actions">
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    OnEditClick(props);
                  }}
                >
                  <Pencil />
                  <span>Edit</span>
                </CommandItem>
                <CommandSeparator />
                <CommandItem onSelect={handleOnDelete}>
                  <Delete className="text-red-400" />
                  <span className="text-red-500">Delete</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    );
  };

  const navigateTo = () => {
    if (isReadOnly) return;
    navigate(`/category/${props.id}`);
  };

  return (
    <Card className="relative rounded-md overflow-hidden">
      {!isReadOnly && (isSmallDevice ? <MobileDrawerMenu /> : <DesktopDropdownMenu />)}

      <div className="cursor-pointer" onClick={navigateTo}>
        {/* Thumbnail grid */}
        <div className="aspect-[4/3] bg-gray-50 relative">
          {thumbnails.length > 0 ? (
            <div className="grid grid-cols-2 w-full h-full">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden">
                  {thumbnails[i] ? (
                    <img
                      src={thumbnails[i]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="size-10 text-gray-300" />
            </div>
          )}

          {/* Emoji badge overlapping bottom-center */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div className="size-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl">
              <span>{props.emojiCode}</span>
            </div>
          </div>
        </div>

        {/* Name and count */}
        <div className="pt-8 pb-3 px-3 text-center">
          <h3 className="font-bold text-sm truncate">{props.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{props.vogliosCount} voglios</p>
        </div>
      </div>
    </Card>
  );
}
