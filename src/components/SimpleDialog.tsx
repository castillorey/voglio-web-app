import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SimpleDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex justify-end">
              <XMarkIcon onClick={onClose} className="size-5" />
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
