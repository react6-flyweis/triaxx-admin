import React from "react";

const ConfirmEmailDialog = ({ email, onVerifyOtpClick, onBack }) => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <h3 className="text-3xl font-bold font-poppins text-gray-900">
        Forget Password
      </h3>
      <p className="text-base text-gray-500 mt-2 font-poppins">
        An Authentication code has been sent to your email
      </p>
      <p className="text-lg font-bold text-gray-900 mt-2 font-poppins">
        {email}
      </p>

      <div className="w-full mt-12">
        <button
          type="button"
          onClick={onVerifyOtpClick}
          className="w-full bg-linear-to-b from-purple-700 to-red-600 text-white font-medium py-3 rounded-lg hover:from-purple-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-poppins text-lg"
        >
          Verify OTP
        </button>
      </div>
      <div className="w-full mt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-poppins text-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ConfirmEmailDialog;
