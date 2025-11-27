import api from "./apiClient";

const PATH = "/fileupload";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Upload failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const fileService = {
  // file should be a File object; the server expects the key `file`
  uploadFile: async (file, onUploadProgress) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post(PATH, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (typeof onUploadProgress === "function") onUploadProgress(ev);
        },
      });
      // return the inner `data` object for convenience
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error("fileService.uploadFile error:", err);
      handleAxiosError(err);
    }
  },
};

export default fileService;
