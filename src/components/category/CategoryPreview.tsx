import { Card, CardContent } from "@/components/ui/card";
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
import { Ellipsis, Pencil, Delete } from "lucide-react";

import { useNavigate } from "react-router";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import supabase from "../../supabase-client";
import { ICategory } from "../voglio/VoglioForm";

export default function CategoryPreview({
  props,
  onDeleteClick,
  OnEditClick,
}: {
  props: ICategory;
  onDeleteClick: (categoryName: string) => void;
  OnEditClick: (categoryData: ICategory) => void;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");

  const handleOnDelete = async () => {
    const { error } = await supabase.from("category").delete().eq("id", props.id);
    if (error) {
      console.log("Error deleting: ", error);
    } else {
      onDeleteClick(props.name);
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
            className="rounded-lg absolute top-2 right-3"
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
            className="rounded-lg absolute top-2 right-3"
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
  return (
    <Card className="relative rounded-md">
      {isSmallDevice ? <MobileDrawerMenu /> : <DesktopDropdownMenu />}
      <CardContent
        className="p-0 cursor-pointer"
        onClick={() => navigate(`category/${props.id}`)}
      >
        <div className="text-center">
        <p className="py-4 bg-gray-100 text-6xl">
          <span>{props.emojiCode}</span>
        </p>
        <h3 className="mt-2 font-bold text-md">{props.name}</h3>
        <p className="mt-2 mb-2 text-xs text-gray-400">{props.vogliosCount} voglios</p>
      </div>
      </CardContent>
    </Card>
  );
}
