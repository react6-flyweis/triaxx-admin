import React, { useState } from "react";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import ConfirmEmailDialog from "./ConfirmEmailDialog";
import VerifyOtpDialog from "./VerifyOtpDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { extractErrorMessage } from "@/utils/error";
import {
  useRequestPasswordReset,
  useVerifyOtp,
  useResetPassword,
} from "@/hooks/useForgotPassword";
import SuccessDialog from "@/Components/ui/SuccessDialog";
import { Dialog, DialogContent } from "../ui/dialog";

// This is the main component that handles all four modal states.
// It takes one prop, `onClose`, which is a function to close the modal.
const PasswordResetModal = ({ onClose, open = false, onOpenChange }) => {
  // 'step' state determines which view to show: 'forgot', 'emailConfirmation', 'otp', or 'reset'
  const [step, setStep] = useState("forgot");
  // State to store the user's email
  const [email, setEmail] = useState("ADMIN123@gmail.com"); // Pre-filled for demonstration

  // --- Handlers to change the step ---

  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const requestReset = useRequestPasswordReset({
    onSuccess: () => {
      setModalError("");
      setStep("emailConfirmation");
    },
    onError: (err) => {
      setModalError(extractErrorMessage(err, "Failed to request reset"));
    },
  });

  const verifyMutation = useVerifyOtp({
    onSuccess: () => {
      setModalError("");
      setStep("reset");
    },
    onError: (err) => {
      setModalError(extractErrorMessage(err, "Failed to verify OTP"));
    },
  });

  const resetMutation = useResetPassword({
    onSuccess: () => {
      setModalError("");
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        handleClose();
      }, 1200);
    },
    onError: (err) => {
      setModalError(extractErrorMessage(err, "Failed to reset password"));
    },
  });

  const handleClose = () => {
    setStep("forgot");
    setEmail("");
    setOtp("");
    setResetPassword("");
    setConfirmResetPassword("");
    setModalError("");
    onClose();
  };

  // Moves from 'forgot' to the new 'emailConfirmation' step
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    try {
      await requestReset.mutateAsync({ email });
    } catch (error) {
      // handled by mutation onError
      console.error("request reset error", error);
    }
  };

  // Moves from 'otp' to 'reset' step
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    try {
      await verifyMutation.mutateAsync({ email, otp });
    } catch (error) {
      // handled by mutation
      console.error("verify otp error", error);
    }
  };

  // Final step, submit the new password to the API
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    if (!resetPassword || !confirmResetPassword) {
      setModalError("Please fill both password fields");
      return;
    }
    if (resetPassword !== confirmResetPassword) {
      setModalError("Passwords do not match");
      return;
    }
    try {
      await resetMutation.mutateAsync({
        email,
        otp,
        newPassword: resetPassword,
      });
    } catch (error) {
      // handled by mutation
      console.error("reset password error", error);
    }
  };

  // --- Render Functions for Each Step ---

  // Rendered through extracted `ForgotPasswordDialog` component

  // Email confirmation view is handled by `ConfirmEmailDialog` component

  // Verify OTP view is handled by `VerifyOtpDialog` component

  // Reset password view is handled by `ResetPasswordDialog` component

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
        if (typeof onOpenChange === "function") onOpenChange(open);
      }}
    >
      <DialogContent className="p-0 rounded-2xl border-0 sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="mx-auto flex flex-col items-center justify-center">
            {/* Conditionally render the correct step */}
            {step === "forgot" && (
              <ForgotPasswordDialog
                email={email}
                setEmail={setEmail}
                onSubmit={handleForgotPasswordSubmit}
                onClose={handleClose}
                loading={requestReset.isLoading}
                error={modalError}
              />
            )}
            {step === "emailConfirmation" && (
              <ConfirmEmailDialog
                email={email}
                onVerifyOtpClick={() => setStep("otp")}
                onBack={() => setStep("forgot")}
              />
            )}
            {step === "otp" && (
              <VerifyOtpDialog
                otp={otp}
                setOtp={setOtp}
                onSubmit={handleOtpSubmit}
                loading={verifyMutation.isLoading}
                onBack={() => setStep("emailConfirmation")}
                error={modalError}
              />
            )}
            {step === "reset" && (
              <ResetPasswordDialog
                resetPassword={resetPassword}
                confirmResetPassword={confirmResetPassword}
                setResetPassword={setResetPassword}
                setConfirmResetPassword={setConfirmResetPassword}
                onSubmit={handleResetPasswordSubmit}
                loading={resetMutation.isLoading}
                onBack={() => setStep("otp")}
                error={modalError}
              />
            )}
          </div>
        </div>
      </DialogContent>
      <SuccessDialog
        open={successOpen}
        onOpenChange={(v) => setSuccessOpen(v)}
        title="Password Reset"
        subtitle="Your password has been reset successfully."
        ctaText="Close"
      />
    </Dialog>
  );
};

export default PasswordResetModal;
