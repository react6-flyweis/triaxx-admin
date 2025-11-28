import { useState } from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import arrow from "../../assets/Images/Home/arrow.png";
import CurrencySelect from "../ui/CurrencySelect";

const CurrencySettings = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("");

  return (
    <>
      <h1 className="text-[32px] font-bold text-gray-800 mb-10 flex items-center gap-4">
        <span className="text-gray-400 flex items-center gap-2">
          Account Settings <img src={arrow} alt="Arrow" className="w-5 h-5" />
        </span>
        <span className="text-gray-800">Currency</span>
      </h1>

      <div className="min-h-screen flex flex-col justify-center font-poppins p-4">
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
              onClick={() => {
                setSelectedCurrency("");
              }}
              className="w-full sm:w-auto border border-gray-400 rounded-lg py-3 px-20 text-lg font-medium text-black hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white rounded-lg py-3 px-16 text-lg font-medium hover:opacity-90 transition-opacity">
              Submit Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const CurrencySettingsWithLayout = withAdminLayout(CurrencySettings);
export default CurrencySettingsWithLayout;
