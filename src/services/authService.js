import api from "./apiClient";

const PATH = "/user";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const authService = {
  changePassword: async (payload) => {
    try {
      const res = await api.post(`${PATH}/change-password`, payload);
      return res.data;
    } catch (err) {
      console.error("Error changing password:", err);
      handleAxiosError(err);
    }
  },
  // Request OTP / Password Reset - send link or OTP to email
  // send OTP to user's email
  requestPasswordReset: async (payload) => {
    try {
      const res = await api.post(`${PATH}/forget-password/send-otp`, payload);
      return res.data;
    } catch (err) {
      console.error("Error requesting password reset:", err);
      handleAxiosError(err);
    }
  },
  // Verify OTP
  verifyOtp: async (payload) => {
    try {
      const res = await api.post(`${PATH}/forget-password/verify-otp`, payload);
      return res.data;
    } catch (err) {
      console.error("Error verifying OTP:", err);
      handleAxiosError(err);
    }
  },
  // Reset password using otp/token
  // reset password using otp and new password
  resetPassword: async (payload) => {
    try {
      const res = await api.post(`${PATH}/forget-password/send-otp`, payload);
      return res.data;
    } catch (err) {
      console.error("Error resetting password:", err);
      handleAxiosError(err);
    }
  },
};
