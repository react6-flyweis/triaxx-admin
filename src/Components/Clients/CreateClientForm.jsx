import { useState, useEffect } from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import { useForm } from "react-hook-form";
import { useCreateClient } from "../../hooks/useClients";
import CurrencySelect from "@/Components/ui/CurrencySelect";
import useFileUpload from "@/hooks/useFileUpload";
import LanguageSelect from "@/Components/ui/LanguageSelect";
import { FileIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "@/Components/ui/SuccessDialog";
import { extractErrorMessage } from "@/utils/error";

const CreateClientForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);

  const createClient = useCreateClient({
    onSuccess: () => {
      // Show success modal and reset form
      reset();
      setFileName("");
      setFileUrl("");
      if (localPreview) {
        try {
          URL.revokeObjectURL(localPreview);
        } catch {
          // ignore revoke errors
        }
      }
      setLocalPreview(null);
      setUploadPercent(0);
      setSuccessOpen(true);
    },
    onError: (err) => {
      // map server error to form if possible
      const msg = extractErrorMessage(err, "Failed to create client");
      // set a form-level error (or field errors if you parse them)
      setError("root", { type: "server", message: msg });
    },
  });

  // const fileInputRef = useRef(null); // not needed — using visible input + label
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [localPreview, setLocalPreview] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const fileUpload = useFileUpload();

  const onSubmit = async (data) => {
    // Build a JSON payload (not FormData) to send to the server
    // Map form fields to API expected keys
    const parseIdArray = (val) => {
      // If already an array, return it
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        // Accept comma-separated numeric list like "1,2" or single numeric value
        const trimmed = val.trim();
        if (!trimmed) return [];
        // Try splitting on comma
        const parts = trimmed.includes(",") ? trimmed.split(",") : [trimmed];
        // parse ints where possible
        return parts
          .map((p) => p.toString().trim())
          .filter(Boolean)
          .map((p) => {
            const n = Number(p);
            return Number.isNaN(n) ? p : n;
          });
      }
      // fallback
      return [];
    };

    const businessLogoValue =
      typeof data.businessLogo === "string" ? data.businessLogo : fileUrl || "";

    const payload = {
      Business_Name: data.businessName || "",
      Business_logo: businessLogoValue || "",
      Email: data.email || "",
      password: data.password || "",
      language: parseIdArray(data.preferredLanguage),
      currency: parseIdArray(data.preferredCurrency),
      // default/optional fields - keep simple defaults here
      type: data.type || "Restaurant",
      Status: typeof data.Status === "boolean" ? data.Status : true,
    };

    // clear any previous server errors
    clearErrors("root");

    try {
      // Send JSON payload, not Multipart form data
      await createClient.mutateAsync(payload);
    } catch (err) {
      const errorMessage = extractErrorMessage(err, "Failed to create client");
      setError("root", {
        type: "server",
        message: errorMessage || "Failed to create client",
      });
    }
  };

  // Upload file via React Query mutation (fileUpload)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // clear previous form errors
    clearErrors("businessLogo");

    // create a local preview for immediate UI update
    try {
      // revoke previous preview if any
      if (localPreview) URL.revokeObjectURL(localPreview);
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      // create progress handler
      const onUploadProgress = (ev) => {
        const percent = ev?.lengthComputable
          ? Math.round((ev.loaded * 100) / ev.total)
          : 0;
        setUploadPercent(percent);
      };
      const payload = await fileUpload.mutateAsync({ file, onUploadProgress });
      if (payload && payload.serverfile) {
        setValue("businessLogo", payload.serverfile);
        setFileUrl(payload.url || "");
        setFileName(file.name);
        setUploadPercent(100);
        // clear local preview if server returned a public url
        if (payload.url) {
          // keep localPreview, but prefer server url for thumbs
        }
      } else {
        throw new Error("Unexpected upload response");
      }
    } catch (err) {
      console.error("File upload failed:", err);
      // clear any businessLogo form value
      setValue("businessLogo", "");
      setFileName("");
      setFileUrl("");
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview(null);
      }
      setUploadPercent(0);
    }
  };

  // Remove selected file and reset upload state
  const removeSelectedFile = () => {
    setValue("businessLogo", "");
    setFileName("");
    setFileUrl("");
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    setUploadPercent(0);
  };

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  return (
    <div className="min-h-screen w-full   bg-white poppins-text">
      <h2 className="text-3xl font-bold text-[#2E2A40] m-6">Create Clients</h2>

      <div className="w-full max-w-7xl p-8 rounded-2xl bg-linear-to-b from-[#6A1B9A1A] to-[#D32F2F1A] shadow-md">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#2E2A40]">
            Onboarding Client
          </h2>
          <p className="text-sm text-black/60 mt-2">
            Create new client by filling all the mandatory details
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Business Name */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Type Business name"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
              {...register("businessName", {
                required: "Business name is required",
              })}
            />
            {errors.businessName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Business Logo */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Business Logo
            </label>
            <div>
              <div className="flex items-center gap-3">
                <input
                  id="businessLogoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("businessLogo")}
                  onChange={(e) => {
                    clearErrors("businessLogo");
                    handleFileChange(e);
                  }}
                  disabled={fileUpload.isLoading}
                />
                <label
                  htmlFor="businessLogoInput"
                  className={`flex-1 px-5 py-3 flex items-center justify-center gap-2 text-white bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] rounded ${
                    fileUpload.isLoading
                      ? "opacity-60 cursor-not-allowed pointer-events-none"
                      : "hover:brightness-95"
                  }`}
                  aria-disabled={fileUpload.isLoading}
                >
                  {fileUpload.isLoading
                    ? "Uploading..."
                    : fileName
                    ? "Change File"
                    : "Choose File"}
                  <FileIcon className="size-4" />
                </label>
                {fileName && (
                  <button
                    type="button"
                    className="px-4 py-2 border rounded bg-white"
                    onClick={removeSelectedFile}
                    aria-label="Remove selected file"
                  >
                    Remove
                  </button>
                )}
              </div>
              {fileName && (
                <div className="mt-2 text-sm text-black/60 flex items-center gap-3">
                  {localPreview || fileUrl ? (
                    <div className="relative w-14 h-14">
                      <img
                        src={fileUrl || localPreview}
                        alt={fileName}
                        className="w-14 h-14 object-cover rounded"
                      />
                      {fileUpload.isLoading && (
                        <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center text-white text-[11px] font-semibold">
                          <div className="flex flex-col items-center gap-1">
                            <div>{uploadPercent}%</div>
                            <div className="w-12 h-1 bg-gray-200 rounded overflow-hidden">
                              <div
                                className="h-1 bg-blue-400"
                                style={{ width: `${uploadPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <p className="truncate">{fileName}</p>
                </div>
              )}
              {fileUrl && (
                <p className="mt-1 text-sm text-blue-600">
                  <a href={fileUrl} target="_blank" rel="noreferrer">
                    View uploaded file
                  </a>
                </p>
              )}
              {fileUpload.isError && (
                <p className="text-xs text-red-600 mt-1">
                  {fileUpload.error?.message || "Upload failed"}
                </p>
              )}
              {errors.businessLogo && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.businessLogo.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email for Login"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Create Password
            </label>
            <input
              type="password"
              placeholder="Create Password"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum length is 6" },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Preferred Language
            </label>
            <LanguageSelect {...register("preferredLanguage")} />
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Preferred Currency
            </label>
            <CurrencySelect {...register("preferredCurrency")} />
            {/* We'll render the safe select component above to centralize loading/error UI */}
          </div>

          {errors.root && (
            <p className="text-sm text-red-600 mt-3 md:col-span-2">
              {errors.root.message}
            </p>
          )}
          {/* Save & server errors now inside the form so the submit button triggers handleSubmit */}
          <div className="flex justify-center mt-8 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting || createClient.isLoading}
              className="w-full md:w-[400px] py-4 bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-lg font-medium rounded-lg disabled:opacity-60"
            >
              {isSubmitting || createClient.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="New Client Created!"
        subtitle="Successfully Created New Client"
        ctaText="View Clients"
        onCTA={() => navigate("/clients")}
      />
    </div>
  );
};

CreateClientForm.displayName = "CreateClientForm";

const WrappedCreateClientForm = withAdminLayout(CreateClientForm);
WrappedCreateClientForm.displayName = "WrappedCreateClientForm";

export default WrappedCreateClientForm;
