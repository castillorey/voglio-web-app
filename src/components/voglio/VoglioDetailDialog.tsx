import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Bookmark, ExternalLink, Image } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { IVoglio } from "./VoglioForm";
import { getCurrentUserId } from "../../services/profile";
import { useTranslation } from "react-i18next";

interface VoglioDetailDialogProps {
  open: boolean;
  onClose: () => void;
  voglio: IVoglio;
  isTaken?: boolean;
  takenBy?: string | null;
  onToggleTaken?: () => void;
}

function VoglioDetailContent({
  voglio,
  isTaken,
  takenBy,
  onToggleTaken,
}: {
  voglio: IVoglio;
  isTaken?: boolean;
  takenBy?: string | null;
  onToggleTaken?: () => void;
}) {
  const currentUserId = getCurrentUserId();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {voglio.imageUrl ? (
        <div className="w-full rounded-xl overflow-hidden bg-[#F8F7FC]">
          <img
            src={voglio.imageUrl}
            alt={voglio.name}
            className="w-full max-h-64 object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-48 flex justify-center items-center bg-[#F8F7FC] rounded-xl">
          <Image className="size-10 text-[#C4C7D3]" />
        </div>
      )}

      <div>
        <h3 className="font-bold text-base text-[#1B1B2D]">{voglio.name}</h3>
        {voglio.price != null && (
          <p className="mt-1 text-sm font-semibold text-[#7B61FF]">${voglio.price}</p>
        )}
      </div>

      {voglio.notes && (
        <div>
          <p className="text-xs font-semibold text-[#6B6E85] uppercase tracking-wider mb-1">
            {t("voglioForm.description")}
          </p>
          <p className="text-sm text-[#1B1B2D] leading-relaxed whitespace-pre-wrap">
            {voglio.notes}
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {voglio.referenceLink && (
          <Button
            variant="secondary"
            size="sm"
            className="text-xs font-semibold gap-1.5"
            onClick={() => window.open(voglio.referenceLink, "_blank")}
          >
            <ExternalLink className="size-3.5" />
            {t("voglioForm.referenceLink")}
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          disabled={isTaken && takenBy !== currentUserId}
          className={`text-xs font-semibold gap-1.5 ${
            isTaken
              ? takenBy === currentUserId
                ? "text-[#7B61FF] bg-[#F1EEFF] border-[#7B61FF]"
                : "text-[#7B61FF] bg-[#F1EEFF] opacity-60 cursor-not-allowed"
              : ""
          }`}
          onClick={onToggleTaken}
        >
          {isTaken ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
          {isTaken ? t("userCategory.taken") : t("userCategory.notTaken")}
        </Button>
      </div>
    </div>
  );
}

export default function VoglioDetailDialog({
  open,
  onClose,
  voglio,
  isTaken,
  takenBy,
  onToggleTaken,
}: VoglioDetailDialogProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 500px)");
  const { t } = useTranslation();

  if (isSmallDevice) {
    return (
      <MobileSheet open={open} onClose={onClose}>
        <h2 className="font-display text-xl text-[#1B1B2D] mb-4">
          {t("common.details")}
        </h2>
        <VoglioDetailContent
          voglio={voglio}
          isTaken={isTaken}
          takenBy={takenBy}
          onToggleTaken={onToggleTaken}
        />
      </MobileSheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-[#1B1B2D]">
            {t("common.details")}
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <VoglioDetailContent
          voglio={voglio}
          isTaken={isTaken}
          takenBy={takenBy}
          onToggleTaken={onToggleTaken}
        />
      </DialogContent>
    </Dialog>
  );
}
