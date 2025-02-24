import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";

export default function VoglioDialog({
  open,
  onClose,
  contentChildren,
}: {
  open: boolean;
  contentChildren: React.ReactNode;
  onClose: () => void;
}) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");

  const MobileDrawerForm = () => {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="mb-5">
          <DrawerHeader className="text-left">
            <DrawerTitle>New Voglio</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription aria-describedby="New voglio form"></DrawerDescription>
          {contentChildren}
        </DrawerContent>
      </Drawer>
    );
  };

  const DesktopDialogForm = () => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Voglio</DialogTitle>
            <DialogDescription aria-describedby="New voglio form" />
          </DialogHeader>
          {contentChildren}
        </DialogContent>
      </Dialog>
    );
  };

  return isSmallDevice ? <MobileDrawerForm /> : <DesktopDialogForm />;
}
