import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { BookmarkCheck, Bookmark, ExternalLink, Ellipsis, Pencil, Delete, Image } from "lucide-react";

import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import supabase from "../../supabase-client";
import { IVoglio } from "./VoglioForm";
import { getCurrentUserId } from "../../services/profile";

export default function VoglioPreview({
  props,
  onDeleteVoglio,
  OnEditClick,
  isReadOnly,
  isTaken,
  onToggleTaken,
  categoryEmoji,
  categoryName,
}: {
  props: IVoglio;
  onDeleteVoglio: (voglioId: number) => void;
  OnEditClick: (voglioData: IVoglio) => void;
  isReadOnly?: boolean;
  isTaken?: boolean;
  onToggleTaken?: () => void;
  categoryEmoji?: string;
  categoryName?: string;
}) {
  const [open, setOpen] = useState(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");
  const currentUserId = getCurrentUserId();
  const isOwner = !isReadOnly && !!currentUserId && currentUserId === props.userId;

  const handleOnDelete = async () => {
    const { error } = await supabase.from("voglio").delete().eq("id", props.id);
    if (error) {
      console.log("Error deleting: ", error);
    } else {
      onDeleteVoglio(props.id!);
    }
    setOpen(false);
  };

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
      {isOwner && (isSmallDevice ? <MobileDrawerMenu /> : <DesktopDropdownMenu />)}
      <CardContent>
        {(categoryEmoji || categoryName) && (
          <span className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 bg-gray-200/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 shadow-sm">
            {categoryEmoji && <span className="text-sm">{categoryEmoji}</span>}
            {categoryName && <span className="truncate max-w-[100px]">{categoryName}</span>}
          </span>
        )}
        {props.imageUrl ? (
          <img
            src={props.imageUrl}
            alt=""
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-32 flex justify-center items-center">
            <Image color="gray" />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="min-w-0 flex-1">
            <p className="mt-2 font-bold text-sm text-gray-700"> {props.name}</p>
            {props.notes && <p className="mt-1 text-xs text-gray-500"> {props.notes}</p>}
            {props.price != null && (
              <p className="mt-2 text-xs font-semibold text-gray-400">${props.price}</p>
            )}
          </div>
          {!isOwner && (
            <div className="flex gap-2 mt-2">
              {props.referenceLink && (
                <Button
                  size="sm"
                  variant="outline"
                  className="size-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(props.referenceLink, "_blank");
                  }}
                >
                  <ExternalLink className="size-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className={`size-8 rounded-full ${isTaken ? "bg-primary text-primary-foreground" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTaken?.();
                }}
              >
                {isTaken ? <BookmarkCheck /> : <Bookmark />}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
