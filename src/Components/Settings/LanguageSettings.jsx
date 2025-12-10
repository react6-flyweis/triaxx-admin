import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import arrow from "../../assets/Images/Home/arrow.png";
import LanguageSelect from "../ui/LanguageSelect";
import useStore from "../../store/useStore";
import useUpdateUser from "../../hooks/useUpdateUser";
import SuccessDialog from "../ui/SuccessDialog";
import ErrorDialog from "../ui/ErrorDialog";

const LanguageSettings = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: updateUser, isPending } = useUpdateUser({
    onSuccess: (data) => {
      if (data?.data) {
        setUser(data.data);
      }
      setShowSuccess(true);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to update language");
      setShowError(true);
    },
  });

  useEffect(() => {
    if (user?.Language_id?.Language_id) {
      setSelectedLanguage(user.Language_id.Language_id.toString());
    }
  }, [user]);

  const handleSubmit = () => {
    if (!selectedLanguage) {
      setErrorMessage("Please select a language");
      setShowError(true);
      return;
    }
    updateUser({
      id: user.user_id,
      Language_id: parseInt(selectedLanguage),
    });
  };

  return (
    <>
      <h1 className="text-[20px] sm:text-[32px] font-bold text-gray-800 mb-6 sm:mb-10 flex items-center gap-2 sm:gap-4">
        <span
          className="text-gray-400 flex items-center gap-1 sm:gap-2 text-base sm:text-lg cursor-pointer hover:text-gray-600"
          onClick={() => navigate("/settings")}
        >
          Account Settings{" "}
          <img src={arrow} alt="Arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        <span className="text-gray-800 text-base sm:text-2xl">Languages</span>
      </h1>

      <div className="min-h-screen flex flex-col justify-center font-poppins p-2 sm:p-4">
        <div className="flex flex-col items-center w-full">
          {/* Change Language Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 w-full max-w-lg mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
              Change Language
            </h2>

            {/* LanguageSelect (replaces custom dropdown) */}
            <div className="relative">
              <>
                <LanguageSelect
                  label="Preferred Language"
                  placeholder="Select Language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
              </>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-2 sm:py-3 px-10 sm:px-20 text-base sm:text-lg font-medium text-black hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-2 sm:py-3 px-10 sm:px-16 text-base sm:text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Submit Changes"}
            </button>
          </div>
        </div>
      </div>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Success!"
        subtitle="Language updated successfully"
        ctaText="Ok"
        onCTA={() => navigate(-1)}
      />

      <ErrorDialog
        open={showError}
        onOpenChange={setShowError}
        title="Error"
        subtitle={errorMessage}
        ctaText="Try Again"
      />
    </>
  );
};

export default withAdminLayout(LanguageSettings);
