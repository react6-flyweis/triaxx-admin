import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

import SuccessDialog from "../ui/SuccessDialog";

export default function CreateSubAdminModal({ open, onOpenChange }) {
  const createSubAdminSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Confirm password is required"),
      permission: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords must match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(createSubAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      permission: "",
    },
  });

  const [successOpen, setSuccessOpen] = useState(false);

  const { mutateAsync, isPending } = useCreateUser({
    onSuccess: () => {
      setSuccessOpen(true);
      // close the create modal; the SuccessDialog will be shown
      onOpenChange(false);
    },
    onError: (err) => {
      const msg = err?.message || "Failed to create sub-admin";
      form.setError("root", { type: "server", message: msg });
    },
  });

  const onSubmit = async (values) => {
    const payload = {
      Name: values.name,
      last_name: "N/A",
      Responsibility_id: 1,
      Role_id: 5,
      Language_id: 1,
      Country_id: 1,
      State_id: 1,
      City_id: 1,
      email: values.email,
      phone: "8090404700",
      password: values.password,
      gender: "Male",
      user_image: "https://example.com/image.jpg",
      OnboardingDate: new Date(),
      yearsWithus: 2,
      isLoginPermission: true,
      Status: true,
      IsPermissons: [
        {
          type: values.permission || "Dashboard",
          status:
            values.permission === "View Only" ? false : !!values.permission,
        },
      ],
    };

    try {
      await mutateAsync(payload);
    } catch {
      // handled by onError
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 rounded-lg border-0 w-full max-w-[505px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-poppins">
              Create Sub Admins
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Name</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        className="w-full h-10 border border-black/20 rounded-md px-3"
                        placeholder="Enter Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        {...field}
                        className="w-full h-10 border border-black/20 rounded-md px-3"
                        placeholder="Enter Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        {...field}
                        className="w-full h-10 border border-black/20 rounded-md px-3"
                        placeholder="Enter Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        {...field}
                        className="w-full h-10 border border-black/20 rounded-md px-3"
                        placeholder="Confirm Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-10 border border-black/20 rounded-md px-3"
                      >
                        <option value="">Enter Permissions</option>
                        <option value="View Only">View Only</option>
                        <option value="Edit">Edit</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {form.formState.errors.root && (
          <div className="px-6 mb-4 text-red-600 text-center">
            {form.formState.errors.root.message}
          </div>
        )}

        <DialogFooter>
          <div className="flex justify-center px-6 pb-6 w-full">
            <button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="w-full max-w-[399px] py-3 text-white font-medium text-lg rounded-[12px] bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Sub-admin created"
        subtitle="The sub-admin was created successfully."
        ctaText="Okay"
      />
    </Dialog>
  );
}
