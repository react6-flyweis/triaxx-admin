import { useState } from "react";
import SuccessDialog from "@/Components/ui/SuccessDialog";
import useSendRenewalEmail from "@/hooks/useSendRenewalEmail";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

const RenewalPopupModal = ({ onClose, restaurantId, email }) => {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  return (
    <Dialog open={true} onOpenChange={(v) => !v && onClose && onClose()}>
      <DialogContent className="p-6 rounded-2xl w-full max-w-[512px] shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[28px] font-bold text-black mb-2">
            Renewal Message
          </DialogTitle>
        </DialogHeader>

        <div className="w-full rounded-xl bg-gradient-to-r from-[rgba(106,27,154,0.08)] to-[rgba(211,47,47,0.08)] px-5 py-4 mb-6">
          <p className="text-[15px] text-black leading-[24px]">
            Hey ABC Restaurant, we have an amazing renewal plan for you. The
            validity of the offer is going to end in 3 days. Grab it soon before
            the subscription prices increase.
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>
        ) : null}

        <DialogFooter>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <div className="p-[2px] rounded-xl bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F]">
                <Button
                  onClick={() => navigate("/renew-management")}
                  variant="default"
                  className="w-full bg-white text-[#6A1B9A] hover:opacity-90 py-[14px]"
                >
                  View Details
                </Button>
              </div>
            </div>

            <div className="w-1/2">
              <SendButton
                className="w-full py-[14px] text-white bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F]"
                onSuccess={() => setShowModal(true)}
                onError={(err) =>
                  setErrorMessage(err?.message || "Failed to send")
                }
                restaurantId={restaurantId}
                email={email}
              />
            </div>
          </div>
        </DialogFooter>
      </DialogContent>

      <SuccessDialog
        open={showModal}
        onOpenChange={(v) => setShowModal(v)}
        title="Message Sent"
        subtitle="Renewal message sent successfully."
        ctaText="Close"
      />
    </Dialog>
  );
};

function SendButton({ className, onSuccess, onError, restaurantId, email }) {
  const mutation = useSendRenewalEmail({
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
    onError: (err) => {
      if (onError) onError(err);
    },
  });

  // Prefer provided props, fall back to window env or example values.
  const restaurant_id =
    restaurantId || window?.REACT_APP_CURRENT_RESTAURANT_ID || 1;
  const emailValue =
    email ||
    window?.REACT_APP_CURRENT_RESTAURANT_EMAIL ||
    "restaurant@example.com";

  return (
    <Button
      onClick={() => mutation.mutate({ restaurant_id, email: emailValue })}
      className={className}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Sending..." : "Send Renewal Message"}
    </Button>
  );
}

export default RenewalPopupModal;
