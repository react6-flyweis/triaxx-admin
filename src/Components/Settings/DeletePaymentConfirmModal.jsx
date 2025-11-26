import deleteIcon from "../../assets/Images/Home/delete.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

// Modal Component using shared Dialog
const DeletePaymentConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  description,
}) => {
  return (
    <Dialog
      open={!!isOpen}
      onOpenChange={(open) => !open && onClose && onClose()}
    >
      <DialogContent className="p-6 rounded-xl max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <img src={deleteIcon} alt="delete" className="w-14 h-14" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black text-center">
              {title || "Are you sure?"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 text-center">
              {description ||
                "This action will permanently delete the payment method."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border rounded-lg bg-white"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-linear-to-b from-purple-700 to-red-600 text-white disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </DialogFooter>
        </div>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default DeletePaymentConfirmModal;
