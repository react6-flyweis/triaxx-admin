import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as supportsService from "../../services/supportsService";
import { useForm } from "react-hook-form";

export default function AddSupportTicketTypeDialog({ open, onOpenChange }) {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { Name: "", nodes: "" } });

  const mutation = useMutation({
    mutationFn: (payload) => supportsService.createTicketType(payload),
    onSuccess: () => {
      qc.invalidateQueries(["supportTicketTypes"]);
      // Reset form and close
      reset({ Name: "", nodes: "", Status: true });
      setTimeout(() => onOpenChange(false), 700);
    },
    onError: () => {
      // No-op here; error is rendered below via mutation.error
    },
  });

  useEffect(() => {
    if (!open) reset({ Name: "", nodes: "", Status: true });
  }, [open, reset]);

  const onSubmit = (data) => {
    // Ensure boolean for Status
    const payload = {
      Name: data.Name?.trim(),
      nodes: data.nodes?.trim(),
      // Default new ticket types to active on creation
      Status: true,
    };
    mutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 rounded-xl border-0 sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-red-600 text-white p-6 rounded-t-xl z-10">
          <div className="flex justify-between items-center">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Add Support Ticket Type
              </DialogTitle>
              <DialogDescription className="text-white/90">
                Create a new support ticket type for your restaurant
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              ✕
            </DialogClose>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              {...register("Name", { required: "Name is required" })}
              className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. Technical Issue"
            />
            {errors.Name && (
              <p className="text-sm text-red-600 mt-1">{errors.Name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("nodes")}
              className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Short description for this ticket type"
              rows={4}
            />
          </div>

          {/* Status is set to active by default on creation; removed UI control */}

          {mutation.error && (
            <div className="text-sm text-center text-red-700">
              {mutation.error.message || "Failed to create ticket type"}
            </div>
          )}

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-2 border rounded-lg bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-linear-to-b from-purple-700 to-red-600 text-white disabled:opacity-60"
              >
                {mutation.isPending || isSubmitting
                  ? "Creating..."
                  : "Create Type"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
