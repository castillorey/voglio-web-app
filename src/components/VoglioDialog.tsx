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
import { ReactElement } from "react";
import { IVoglio } from "./voglio/VoglioForm";

type voglioFormProps = {
  open: boolean;
  onClose: () => void;
  children: ReactElement<{
    categoryId?: number;
    editVoglioData?: IVoglio | null;
    onCreateVoglio?: (newVoglio: IVoglio) => void;
    onUpdateVoglio?: (editedVoglio: IVoglio) => void;
  }>;
};
export default function VoglioDialog(props: voglioFormProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 400px)");

  const MobileDrawerForm = () => {
    return (
      <Drawer open={props.open} onOpenChange={props.onClose}>
        <DrawerContent className="mb-5 px-4">
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {props.children && props.children.props.editVoglioData
                ? "Edit voglio"
                : "Create voglio"}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription aria-describedby="New voglio form"></DrawerDescription>
          {props.children}
        </DrawerContent>
      </Drawer>
    );
  };

  const DesktopDialogForm = () => {
    return (
      <Dialog open={props.open} onOpenChange={props.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {props.children && props.children.props.editVoglioData
                ? "Edit voglio"
                : "Create voglio"}
            </DialogTitle>
            <DialogDescription aria-describedby="New voglio form" />
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    );
  };

  return isSmallDevice ? <MobileDrawerForm /> : <DesktopDialogForm />;
}
