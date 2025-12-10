import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { XCircle } from "lucide-react";

/**
 * Generic Error Dialog
 * Props:
 * - open: boolean
 * - onOpenChange: (val) => void
 * - title: string
 * - subtitle: string
 * - ctaText: string
 * - onCTA: () => void
 */
export default function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  subtitle = "Something went wrong. Please try again.",
  ctaText = "Ok",
  onCTA = () => onOpenChange(false),
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 rounded-2xl border-0 sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 flex flex-col items-center gap-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
            {subtitle ? (
              <DialogDescription className="text-sm text-black/60">
                {subtitle}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="size-40 rounded-full bg-red-500 flex items-center justify-center">
            <XCircle size={76} className="text-white" />
          </div>

          <DialogFooter className="w-full">
            <div className="flex gap-3 w-full justify-center">
              <button
                type="button"
                onClick={() => {
                  onCTA();
                  onOpenChange(false);
                }}
                className="px-6 py-3 w-40 rounded-lg bg-red-500 text-white font-semibold"
              >
                {ctaText}
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
