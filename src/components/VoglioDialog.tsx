import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { MobileSheet } from "@/components/ui/mobile-sheet";
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
  const isSmallDevice = useMediaQuery("only screen and (max-width : 500px)");

  const MobileDrawerForm = () => {
    return (
      <MobileSheet open={props.open} onClose={props.onClose}>
        <h2 className="font-display text-xl text-[#1B1B2D] mb-4">
          {props.children && props.children.props.editVoglioData
            ? "Edit voglio"
            : "New voglio"}
        </h2>
        {props.children}
      </MobileSheet>
    );
  };

  const DesktopDialogForm = () => {
    return (
      <Dialog open={props.open} onOpenChange={props.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#1B1B2D]">
              {props.children && props.children.props.editVoglioData
                ? "Edit voglio"
                : "New voglio"}
            </DialogTitle>
            <DialogDescription aria-describedby="New voglio form" className="sr-only" />
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    );
  };

  return isSmallDevice ? <MobileDrawerForm /> : <DesktopDialogForm />;
}
