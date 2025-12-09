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

// Modal Component using shadcn Dialog
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  return (
    <Dialog
      open={!!isOpen}
      onOpenChange={(open) => {
        if (!open) onClose && onClose();
      }}
    >
      <DialogContent className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <img src={deleteIcon} alt="warning" className="w-16 h-16" />

          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-xl font-bold text-black leading-tight font-sans">
              {title || "Are you Sure ?"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              {description ||
                "This is an irreversible process. You can view employee roles and delete employees."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full flex flex-col space-y-3">
            <button
              onClick={() => {
                onConfirm && onConfirm();
              }}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-red-600 text-white text-base font-medium rounded-xl hover:from-purple-700 hover:to-red-700 transition-all duration-200 font-sans"
            >
              Yes, Delete
            </button>

            <DialogClose asChild>
              <button className="w-full h-12 bg-transparent border-2 text-base font-medium rounded-xl border-gray-300">
                No, Don't
              </button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
