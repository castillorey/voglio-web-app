import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AlertDialog({
  open,
  onClose,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[#1B1B2D]">{title}</DialogTitle>
          <DialogDescription className="text-sm text-[#6B6E85] mt-2">{message}</DialogDescription>
        </DialogHeader>
        <Button
          onClick={onClose}
          className="w-full mt-2 rounded-full bg-[#7B61FF] hover:bg-[#6B4EFF] text-xs font-bold"
        >
          Set my profile
        </Button>
      </DialogContent>
    </Dialog>
  );
}
