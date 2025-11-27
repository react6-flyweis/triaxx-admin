import { useMutation } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";

export function useFileUpload(options = {}) {
  return useMutation({
    mutationFn: async ({ file, onUploadProgress } = {}) => {
      if (!file) throw new Error("No file provided");
      const res = await fileService.uploadFile(file, onUploadProgress);
      return res; // now returns data directly
    },
    ...options,
  });
}

export default useFileUpload;
