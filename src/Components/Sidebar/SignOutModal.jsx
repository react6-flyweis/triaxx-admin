import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

const SignOutModal = ({ isOpen, onClose, onConfirm, loading }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Would you like to Sign out?</DialogTitle>
        </DialogHeader>

        <label className="flex items-center justify-center gap-2 text-sm my-6 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-purple-600"
          />
          Do you want to save Password
        </label>

        <DialogFooter>
          <button
            onClick={onClose}
            className="bg-linear-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-6 py-2 rounded-lg font-medium"
          >
            No, Stay
          </button>
          <button
            onClick={onConfirm}
            className="bg-linear-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-6 py-2 rounded-lg font-medium ml-3"
          >
            {loading ? "Signing Out..." : "Yes, Sign out"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutModal;
