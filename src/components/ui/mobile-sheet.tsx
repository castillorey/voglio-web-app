import { useEffect, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface MobileSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CLOSE_THRESHOLD = 80;
const ANIM_DURATION = 250;

export function MobileSheet({ open, onClose, children }: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else if (shouldRender) {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open, shouldRender]);

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

  if (!shouldRender) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black/80"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${ANIM_DURATION}ms ease-out`,
        }}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-[20px] border border-[#E0E1E8] bg-[#F8F8FB]"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: `transform ${ANIM_DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        }}
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
