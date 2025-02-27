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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { BookmarkCheck, Ellipsis, Pencil, Delete, Image, Divide } from "lucide-react";

import { useNavigate } from "react-router";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import supabase from "../../supabase-client";
import { IVoglio } from "./VoglioForm";

export default function VoglioPreview({
  props,
  onDeleteVoglio,
  OnEditClick,
}: {
  props: IVoglio;
  onDeleteVoglio: (voglioId: number) => void;
  OnEditClick: (voglioData: IVoglio) => void;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");

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
          <Command className="md:min-w-[450px]">
            <CommandList>
              <CommandGroup heading="Actions">
                <CommandItem onClick={() => OnEditClick(props)}>
                  <Pencil />
                  <span>Edit</span>
                </CommandItem>
                <CommandSeparator />
                <CommandItem onClick={handleOnDelete}>
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
        onClick={() => navigate(`voglio/${props.id}`, { state: props })}
      >
        {props.imageUrl ? (<img
          src={props.imageUrl}
          alt=""
          className="w-full h-32 object-cover cursor-pointer"
        />) : (<div className="w-full h-32 flex justify-center items-center">
          <Image color="gray"/>
        </div>)}
        
        <div className="px-4">
          <p className="mt-2 font-bold text-sm text-gray-700"> {props.name}</p>
          <p className="mt-1 text-xs text-gray-500"> {props.notes}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 pb-4 flex gap-3">
        <Button
          size="sm"
          className="flex-1 rounded-xl text-[10px]"
          onClick={() => window.open(props.referenceLink, "_blank")}
        >
          Visit Link
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-12 rounded-full text-[10px]"
        >
          <BookmarkCheck />
        </Button>
      </CardFooter>
    </Card>
  );
}
