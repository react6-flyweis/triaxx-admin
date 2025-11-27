import React, { useState } from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import arrow from "../../assets/Images/Home/arrow.png";
import { Eye, EyeOff } from "lucide-react";
import PasswordResetModal from "./PasswordResetModal";
import SuccessDialog from "@/Components/ui/SuccessDialog";
import { useChangePassword } from "../../hooks/useChangePassword";
import { extractErrorMessage } from "@/utils/error";

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      // clear fields and show success dialog
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFormError("");
      setSuccessOpen(true);
    },
    onError: (err) => {
      const msg = extractErrorMessage(err, "Failed to change password");
      setFormError(msg);
    },
  });

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 w-full max-w-5xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-gray-400 flex items-center gap-2">
          Account Settings
          <img src={arrow} alt="Arrow" className="w-4 h-4" />
        </span>
        Forget Password
      </h1>

      <div className="flex flex-col gap-8">
        <h2 className="text-lg md:text-xl text-black/60 font-medium">
          Change Password
        </h2>

        <div className="flex flex-col gap-8">
          {/* Current Password + Forget Password */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            {/* Current Password */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Enter Current Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Enter current password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Forget Password Button */}
            <div className="flex justify-start md:justify-end">
              <button
                onClick={openModal}
                className="bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-xs md:text-sm py-2 px-4 rounded-lg w-full md:w-auto"
              >
                Forget Password
              </button>
            </div>
          </div>

          {/* New + Confirm Password */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* New Password */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Enter New Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Enter new password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Re-enter New Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Confirm new password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>
          </div>

          {/* Save Password Button */}
          <div className="flex justify-center">
            <button
              onClick={async () => {
                setFormError("");
                if (!currentPassword || !newPassword || !confirmPassword) {
                  setFormError("Please fill out all fields");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setFormError("Passwords do not match");
                  return;
                }

                try {
                  await changePasswordMutation.mutateAsync({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                  });
                } catch (error) {
                  // onError already handled by hook options — still log for debugging
                  console.error("change password error", error);
                }
              }}
              disabled={changePasswordMutation.isLoading}
              className={`bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white font-medium text-base md:text-lg py-3 px-6 md:px-10 rounded-xl w-full md:w-auto ${
                changePasswordMutation.isLoading
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >
              {changePasswordMutation.isLoading ? "Saving..." : "Save Password"}
            </button>
          </div>
          {formError && (
            <p className="text-sm text-red-600 mt-2 text-center">{formError}</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <PasswordResetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClose={closeModal}
      />
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Password Changed"
        subtitle="Your password has been changed successfully."
        ctaText="Continue"
      />
    </div>
  );
};

ChangePasswordForm.displayName = "ChangePasswordForm";
const WrappedChangePasswordForm = withAdminLayout(ChangePasswordForm);
WrappedChangePasswordForm.displayName = "WrappedChangePasswordForm";

export default WrappedChangePasswordForm;
