import React from "react";

const ResetPasswordDialog = ({
  resetPassword,
  confirmResetPassword,
  setResetPassword,
  setConfirmResetPassword,
  onSubmit,
  loading = false,
  onBack,
  error,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col ">
      <h3 className="text-3xl font-bold font-poppins text-gray-900">
        Create New Password
      </h3>
      <p className="text-base text-gray-500 mt-2 font-poppins text-center">
        Your new password must be different from previous ones.
      </p>

      <div className="mt-10 w-full">
        <input
          id="new-password"
          type="password"
          value={resetPassword}
          onChange={(e) => setResetPassword && setResetPassword(e.target.value)}
          placeholder="Enter new password"
          className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
          required
        />
      </div>

      <div className="mt-6 w-full">
        <input
          id="confirm-password"
          type="password"
          value={confirmResetPassword}
          onChange={(e) =>
            setConfirmResetPassword && setConfirmResetPassword(e.target.value)
          }
          placeholder="Confirm new password"
          className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
          required
        />
      </div>

      <div className="w-full mt-8">
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-linear-to-b from-purple-700 to-red-600 text-white font-medium py-3 rounded-lg hover:from-purple-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-poppins text-lg"
        >
          Reset Password
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
      {error ? (
        <p className="text-sm text-red-600 mt-3 w-full text-center">{error}</p>
      ) : null}
    </form>
  );
};

export default ResetPasswordDialog;
