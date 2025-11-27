import React from "react";

/**
 * Dumb presentational component extracted from PasswordResetModal.
 * Props:
 *  - email: string
 *  - setEmail: fn
 *  - onSubmit: fn (form submit handler)
 *  - onClose: fn
 */
const ForgotPasswordDialog = ({
  email = "",
  setEmail,
  onSubmit,
  onClose,
  loading = false,
  error = "",
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
      <h3 className="text-3xl font-bold font-poppins text-gray-900">
        Forgot Password
      </h3>
      <p className="text-base text-gray-500 mt-2 font-poppins text-center">
        We will send you instructions to reset in your registered email
      </p>

      <div className="mt-10 w-full">
        <label
          htmlFor="email"
          className="text-left font-medium font-poppins text-lg text-gray-800"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail && setEmail(e.target.value)}
          placeholder="Enter your Email here......"
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
      {error ? (
        <p className="text-sm text-red-600 mt-2 w-full text-center">{error}</p>
      ) : null}

      <div className="w-full mt-4">
        <button
          onClick={onClose}
          type="button"
          className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-poppins text-lg"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordDialog;
