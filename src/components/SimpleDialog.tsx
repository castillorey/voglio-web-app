import {
  Dialog,
  DialogBackdrop,
  DialogPanel
} from "@headlessui/react";
import React from "react";
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function SimpleDialog({open, content, onClose}: {open: boolean, content: React.ReactNode, onClose: () => void}) {

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      {<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95 px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
          >
            <div className="flex justify-end">
              <XMarkIcon className="size-5 flex align-self-"/>
            </div>
            {content}
          </DialogPanel>
        </div>
      </div>}
    </Dialog>
  );
}
