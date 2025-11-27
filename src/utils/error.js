/**
 * Utility for extracting a readable error message from various error shapes.
 * It checks common axios error shapes (error.response.data.message),
 * falls back to error.message, and also accepts raw strings.
 *
 * @param {any} error - The error object to extract message from
 * @param {string} [fallback] - The fallback message if none can be extracted
 * @returns {string}
 */
export function extractErrorMessage(
  error,
  fallback = "An unexpected error occurred"
) {
  if (!error) return fallback;

  // If axios error with response.data.message
  try {
    const resp = error?.response;
    const responseData = resp?.data;

    if (responseData) {
      // If data is a string, return it
      if (typeof responseData === "string" && responseData.trim()) {
        return responseData.trim();
      }
      // If data has a message property
      if (
        typeof responseData?.message === "string" &&
        responseData.message.trim()
      ) {
        return responseData.message.trim();
      }
      // Some backends include errors as { errors: [...] }
      if (Array.isArray(responseData?.errors) && responseData.errors.length) {
        return responseData.errors
          .map((e) => (typeof e === "string" ? e : e?.message))
          .filter(Boolean)
          .join(", ");
      }
    }

    // Try response.message direct
    if (typeof resp?.message === "string" && resp.message.trim()) {
      return resp.message.trim();
    }
  } catch {
    // ignore parsing errors
  }

  // If it's a plain string error
  if (typeof error === "string" && error.trim()) return error.trim();

  // If it's an Error instance
  if (error?.message) return String(error.message);

  // If it's an object with 'error' or 'errors' keys
  if (typeof error?.error === "string") return error.error;

  return fallback;
}

export default extractErrorMessage;
