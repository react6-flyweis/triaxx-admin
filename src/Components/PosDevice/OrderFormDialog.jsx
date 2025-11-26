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
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateOrder, useUpdateOrder } from "../../hooks/usePosOrders";

export default function OrderFormDialog({
  open,
  onOpenChange,
  mode = "create", // 'create' or 'edit'
  initialData = null,
  onSuccess: onParentSuccess,
}) {
  const defaultValues = {
    items: [
      {
        item_id: "",
        item_Quentity: 1,
        item_Addons_id: "",
        item_Variants_id: "",
      },
    ],
    Tax: 0,
    Customer_id: "",
    Dining_Option: "Dine in",
    Table_id: "",
    Kitchen_id: "",
    Status: true,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    // watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const createMutation = useCreateOrder({
    onSuccess: () => {
      reset(defaultValues);
      setTimeout(() => onOpenChange(false), 400);
      if (onParentSuccess) onParentSuccess();
    },
  });

  const updateMutation = useUpdateOrder({
    onSuccess: () => {
      reset(defaultValues);
      setTimeout(() => onOpenChange(false), 400);
      if (onParentSuccess) onParentSuccess();
    },
  });

  useEffect(() => {
    if (!open) {
      // reset when dialog closes
      reset(defaultValues);
      return;
    }

    if (mode === "edit" && initialData) {
      // Normalize incoming items shape if needed
      const items = Array.isArray(initialData.items)
        ? initialData.items.map((it) => ({
            item_id: it.item_id ?? it.itemId ?? "",
            item_Quentity:
              it.item_Quentry ?? it.item_Quentity ?? it.item_Quentry ?? 1,
            item_Addons_id: it.item_Addons_id ?? "",
            item_Variants_id: it.item_Variants_id ?? "",
          }))
        : defaultValues.items;

      reset({
        items,
        Tax: initialData.Tax ?? 0,
        Customer_id: initialData.Customer_id ?? "",
        Dining_Option: initialData.Dining_Option ?? "Dine in",
        Table_id: initialData.Table_id ?? "",
        Kitchen_id: initialData.Kitchen_id ?? "",
        Status: initialData.Status !== undefined ? initialData.Status : true,
      });
    }
  }, [open, mode, initialData, reset]);

  const onSubmit = (data) => {
    // prepare payload: convert numbers where appropriate
    const payload = {
      ...data,
      items: data.items.map((item) => ({
        item_id: Number(item.item_id),
        item_Quentry: Number(item.item_Quentity || item.item_Quentry || 1),
        item_Addons_id: item.item_Addons_id
          ? Number(item.item_Addons_id)
          : null,
        item_Variants_id: item.item_Variants_id
          ? Number(item.item_Variants_id)
          : null,
      })),
      Tax: Number(data.Tax) || 0,
      Customer_id: Number(data.Customer_id) || null,
      Table_id: data.Table_id ? Number(data.Table_id) : null,
      Kitchen_id: data.Kitchen_id ? Number(data.Kitchen_id) : null,
    };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else {
      // include id for update
      const id = initialData?.id ?? payload.id;
      updateMutation.mutate({ id: Number(id), ...payload });
    }
  };

  const isBusy =
    createMutation.isLoading || updateMutation.isLoading || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 rounded-xl border-0 sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 rounded-t-xl z-10 border-b">
          <div className="flex justify-between items-center">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {mode === "create" ? "Create Order" : "Edit Order"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {mode === "create"
                  ? "Create a new POS order"
                  : "Update the selected order"}
              </DialogDescription>
            </DialogHeader>
            <DialogClose className="rounded-full p-2 hover:bg-gray-100">
              ✕
            </DialogClose>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Items field array */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Order Items
            </label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      {...register(`items.${index}.item_id`, {
                        required: "Item ID is required",
                      })}
                      placeholder="Item ID *"
                      className="border p-2 rounded"
                      type="number"
                    />
                    <input
                      {...register(`items.${index}.item_Quentity`, {
                        required: "Quantity is required",
                        min: { value: 1, message: "Minimum 1" },
                      })}
                      placeholder="Quantity *"
                      className="border p-2 rounded"
                      type="number"
                      min={1}
                    />
                    <input
                      {...register(`items.${index}.item_Addons_id`)}
                      placeholder="Addon ID (Optional)"
                      className="border p-2 rounded"
                      type="number"
                    />
                    <input
                      {...register(`items.${index}.item_Variants_id`)}
                      placeholder="Variant ID (Optional)"
                      className="border p-2 rounded"
                      type="number"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-red-600">
                      {errors.items && errors.items[index] && (
                        <span>
                          {errors.items[index].item_id && (
                            <div>{errors.items[index].item_id.message}</div>
                          )}
                        </span>
                      )}
                    </div>
                    <div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove Item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  append({
                    item_id: "",
                    item_Quentity: 1,
                    item_Addons_id: "",
                    item_Variants_id: "",
                  })
                }
                className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-700"
              >
                + Add Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tax</label>
              <input
                {...register("Tax", { valueAsNumber: true })}
                className="w-full border p-2 rounded"
                type="number"
                step="0.01"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer ID
              </label>
              <input
                {...register("Customer_id")}
                className="w-full border p-2 rounded"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Dining Option
              </label>
              <select
                {...register("Dining_Option")}
                className="w-full border p-2 rounded"
              >
                <option value="Dine in">Dine in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Table ID</label>
              <input
                {...register("Table_id")}
                className="w-full border p-2 rounded"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Kitchen ID
              </label>
              <input
                {...register("Kitchen_id")}
                className="w-full border p-2 rounded"
                type="number"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  {...register("Status")}
                  type="checkbox"
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active Status</span>
              </label>
            </div>
          </div>

          {(createMutation.error || updateMutation.error) && (
            <div className="text-sm text-center text-red-700">
              {(createMutation.error || updateMutation.error).message ||
                "Failed to save order"}
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
                disabled={isBusy}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
              >
                {isBusy
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create"
                  : "Update"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
