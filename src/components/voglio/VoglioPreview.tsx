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
}: {
  props: IVoglio;
  onDeleteVoglio: (voglioId: number) => void;
  OnEditClick: (voglioData: IVoglio) => void;
  isReadOnly?: boolean;
  isTaken?: boolean;
  onToggleTaken?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 500px)");
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
            variant="ghost"
            className="rounded-full absolute top-2 right-2 z-10 size-8 text-[#6B6E85] hover:text-[#1B1B2D] hover:bg-white/80"
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px] rounded-xl border-[#F0F1F6] shadow-lg">
          <DropdownMenuLabel className="text-xs text-[#6B6E85] font-semibold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-xs text-[#1B1B2D]"
              onClick={() => OnEditClick(props)}
            >
              <Pencil className="size-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-red-500"
              onClick={handleOnDelete}
            >
              <Delete className="size-3.5 mr-2 text-red-400" />
              Delete
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
            variant="ghost"
            className="rounded-full absolute top-2 right-2 z-10 size-8 text-[#6B6E85] hover:text-[#1B1B2D] hover:bg-white/80"
          >
            <Ellipsis className="size-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="mt-4 border-t rounded-t-2xl">
          <DrawerTitle aria-describedby="Mobile actions menu" />
          <DrawerDescription aria-describedby="Mobile actions menu" />
          <Command className="md:min-w-[450px] rounded-t-2xl">
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
    <Card className="relative rounded-[20px] border border-[#F0F1F6] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
      {isOwner && (isSmallDevice ? <MobileDrawerMenu /> : <DesktopDropdownMenu />)}
      <CardContent className="p-0">
        {props.imageUrl ? (
          <div className="w-full h-36 overflow-hidden bg-[#F8F7FC]">
            <img
              src={props.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-36 flex justify-center items-center bg-[#F8F7FC]">
            <Image className="size-8 text-[#C4C7D3]" />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#1B1B2D] truncate">{props.name}</h4>
              {props.notes && <p className="mt-1 text-xs text-[#6B6E85] line-clamp-2">{props.notes}</p>}
              {props.price != null && (
                <p className="mt-2 text-xs font-semibold text-[#7B61FF]">${props.price}</p>
              )}
            </div>
            {!isOwner && (
              <div className="flex gap-1.5 shrink-0">
                {props.referenceLink && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-8 rounded-full text-[#6B6E85] hover:text-[#7B61FF] hover:bg-[#F1EEFF]"
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
                  variant="ghost"
                  className={`size-8 rounded-full ${isTaken ? "text-[#7B61FF] bg-[#F1EEFF]" : "text-[#6B6E85] hover:text-[#7B61FF] hover:bg-[#F1EEFF]"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTaken?.();
                  }}
                >
                  {isTaken ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
