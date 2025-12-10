import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import arrow from "../../assets/Images/Home/arrow.png";
import CurrencySelect from "../ui/CurrencySelect";
import useStore from "../../store/useStore";
import useUpdateUser from "../../hooks/useUpdateUser";
import SuccessDialog from "../ui/SuccessDialog";
import ErrorDialog from "../ui/ErrorDialog";

const CurrencySettings = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [selectedCurrency, setSelectedCurrency] = useState("");
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
      setErrorMessage(error.message || "Failed to update currency");
      setShowError(true);
    },
  });

  useEffect(() => {
    if (user?.currency_id) {
      setSelectedCurrency(user.currency_id.toString());
    }
  }, [user]);

  const handleSubmit = () => {
    if (!selectedCurrency) {
      setErrorMessage("Please select a currency");
      setShowError(true);
      return;
    }
    updateUser({
      id: user.user_id,
      currency_id: parseInt(selectedCurrency),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="text-[32px] font-bold text-gray-800 mb-10 flex items-center gap-4">
        <span
          className="text-gray-400 flex items-center gap-2 cursor-pointer hover:text-gray-600"
          onClick={() => navigate("/settings")}
        >
          Account Settings <img src={arrow} alt="Arrow" className="w-5 h-5" />
        </span>
        <span className="text-gray-800">Currency</span>
      </h1>

      <div className="flex flex-col justify-center font-poppins p-4">
        <div className="flex flex-col items-center w-full">
          {/* Change Currency Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-lg mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              Change Currency
            </h2>

            {/* CurrencySelect wrapper component */}
            <div className="relative">
              <CurrencySelect
                label="Preferred Currency"
                placeholder="Select Currency"
                value={selectedCurrency}
                onChange={(currency) => setSelectedCurrency(currency)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-3 px-20 text-lg font-medium text-black hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-3 px-16 text-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
        subtitle="Currency updated successfully"
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
    </div>
  );
};

const CurrencySettingsWithLayout = withAdminLayout(CurrencySettings);
export default CurrencySettingsWithLayout;
