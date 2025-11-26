import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

const AddPaymentModal = ({
  isOpen,
  onClose,
  onSave,
  paymentMode,
  setPaymentMode,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose && onClose()}>
      <DialogContent className="p-0 rounded-lg max-w-md w-full">
        <div className="bg-white rounded-lg w-full shadow-lg">
          <div className="flex justify-between items-center border-b p-4">
            <DialogHeader>
              <DialogTitle>Add Payment</DialogTitle>
            </DialogHeader>
          </div>

          <form
            className="p-6 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              onSave && onSave();
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Payment mode
              </label>
              <input
                type="text"
                className="w-full border rounded px-4 py-2"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                placeholder="e.g., PhonePe"
              />
            </div>

            <DialogFooter>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => onClose && onClose()}
                  className="flex-1 px-4 py-2 border rounded-lg bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-linear-to-r from-purple-700 to-red-600 text-white"
                >
                  Save Changes
                </button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;
