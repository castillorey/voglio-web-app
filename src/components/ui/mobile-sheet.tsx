import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileSheet({ open, onClose, children }: MobileSheetProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black/80"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-[20px] border border-[#E0E1E8] bg-[#F8F8FB]">
        <div className="mx-auto mt-3 mb-2 h-2 w-[100px] shrink-0 rounded-full bg-[#E0E1E8]" />
        <div className="overflow-y-auto overscroll-contain min-h-0 flex-1 px-5 pb-8">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
