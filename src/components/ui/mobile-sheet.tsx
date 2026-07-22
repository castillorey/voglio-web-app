import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CLOSE_THRESHOLD = 80;

export function MobileSheet({ open, onClose, children }: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const content = sheetRef.current?.querySelector("[data-sheet-content]");
    if (content && content.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta < 0) return;
    currentY.current = delta;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "transform 0.2s ease-out";
    }
    if (currentY.current > CLOSE_THRESHOLD) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "";
    }
    currentY.current = 0;
  };

  if (!open) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black/80"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-[20px] border border-[#E0E1E8] bg-[#F8F8FB]"
      >
        <div
          className="mx-auto mt-3 mb-2 h-2 w-[100px] shrink-0 rounded-full bg-[#E0E1E8] touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div data-sheet-content className="overflow-y-auto overscroll-contain min-h-0 flex-1 px-5 pb-8">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}
