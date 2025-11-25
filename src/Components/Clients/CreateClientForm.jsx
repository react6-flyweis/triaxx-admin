import React, { useRef, useState } from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import { useForm } from "react-hook-form";
import { useCreateClient } from "../../hooks/useClients";

const CreateClientForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm();

  const createClient = useCreateClient({
    onSuccess: () => {
      // minimal feedback: replace with toast/modal as desired
      alert("Client created successfully");
    },
    onError: (err) => {
      // map server error to form if possible
      const msg = err?.message || "Failed to create client";
      // set a form-level error (or field errors if you parse them)
      setError("root", { type: "server", message: msg });
    },
  });

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const onSubmit = async (data) => {
    // Build form data for file upload and other fields
    console.log("Form Data Submitted:", data);
    const formData = new FormData();
    formData.append("businessName", data.businessName || "");
    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("preferredLanguage", data.preferredLanguage || "");
    formData.append("preferredCurrency", data.preferredCurrency || "");
    if (data.businessLogo && data.businessLogo.length > 0) {
      formData.append("businessLogo", data.businessLogo[0]);
    }

    // clear any previous server errors
    clearErrors("root");

    try {
      // Either use mutateAsync or mutate, mutateAsync returns a promise
      await createClient.mutateAsync(formData);
    } catch (err) {
      // the useCreateClient hook onError will already set errors; ensure the thrown error doesn't bubble
      console.error("Create client failed:", err);
    }
  };
  return (
    <div className="min-h-screen w-full   bg-white poppins-text">
      <h2 className="text-3xl font-bold text-[#2E2A40] m-6">Create Clients</h2>

      <div className="w-full max-w-7xl p-8 rounded-2xl bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] shadow-md">
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
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                {...register("businessLogo")}
                onChange={(e) => {
                  setFileName(e.target.files?.[0]?.name ?? "");
                  clearErrors("businessLogo");
                }}
              />

              <button
                type="button"
                className="w-full px-5 py-3 flex items-center justify-center gap-2 text-white bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
                <span className="material-icons">upload_file</span>
              </button>
              {fileName && (
                <p className="mt-2 text-sm text-black/60">
                  Selected: {fileName}
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
            <input
              type="text"
              placeholder="Type Language"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
              {...register("preferredLanguage")}
            />
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">
              Preferred Currency
            </label>
            <input
              type="text"
              placeholder="Type Currency"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
              {...register("preferredCurrency")}
            />
          </div>
          {/* Save & server errors now inside the form so the submit button triggers handleSubmit */}
          <div className="flex justify-center mt-12 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting || createClient.isLoading}
              className="w-full md:w-[400px] py-4 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-lg font-medium rounded-lg disabled:opacity-60"
            >
              {isSubmitting || createClient.isLoading ? "Saving..." : "Save"}
            </button>
          </div>

          {createClient.isError && (
            <p className="text-sm text-red-600 mt-3 md:col-span-2">
              {createClient.error?.message}
            </p>
          )}
          {errors.root && (
            <p className="text-sm text-red-600 mt-3 md:col-span-2">
              {errors.root.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

CreateClientForm.displayName = "CreateClientForm";

const WrappedCreateClientForm = withAdminLayout(CreateClientForm);
WrappedCreateClientForm.displayName = "WrappedCreateClientForm";

export default WrappedCreateClientForm;
