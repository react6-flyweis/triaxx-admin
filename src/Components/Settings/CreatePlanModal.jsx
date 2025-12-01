import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/Components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/Components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateAdminPlan } from "@/hooks/useCreateAdminPlan";
import SuccessDialog from "@/Components/ui/SuccessDialog";
import { Plus, Trash2 } from "lucide-react";

const CreatePlanModal = ({ open, onClose, onCreate }) => {
  const [successOpen, setSuccessOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      PlanName: "",
      Price: "",
      Description: "",
      expiry_day: "",
      fesility: [{ fesilityLine: "" }],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fesility",
  });

  const createPlanMutation = useCreateAdminPlan({
    onSuccess: (data) => {
      setSuccessOpen(true);
      reset();
      onClose && onClose();
      if (onCreate) onCreate(data);
    },
  });

  function onSubmit(values) {
    // Transform price and expiry_day to numbers and send.
    const payload = {
      PlanName: values.PlanName,
      Description: values.Description || "",
      Price: Number(values.Price),
      expiry_day: String(values.expiry_day),
      fesility:
        values.fesility?.map((f) => ({
          fesilityLine: f.fesilityLine || "",
          statue: true,
        })) || [],
    };

    createPlanMutation.mutate(payload);
  }

  return (
    <Dialog
      open={!!open}
      onOpenChange={(openState) => !openState && onClose && onClose()}
    >
      <DialogContent className="p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col gap-3">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-1">
              Create New Plan
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Define the plan name, pricing and a short description
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <input
                    {...register("PlanName", {
                      required: "Plan name is required",
                    })}
                    placeholder="Plan Name"
                    className="px-3 py-2 border rounded w-full"
                  />
                </FormControl>
                {errors.PlanName && (
                  <FormMessage>{errors.PlanName.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <input
                    {...register("Price", {
                      required: "Price is required",
                      valueAsNumber: true,
                    })}
                    placeholder="Price"
                    className="px-3 py-2 border rounded w-full"
                    type="number"
                  />
                </FormControl>
                {errors.Price && (
                  <FormMessage>{errors.Price.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...register("Description")}
                    placeholder="Description"
                    className="px-3 py-2 border rounded h-20 w-full"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Expiry days</FormLabel>
                <FormControl>
                  <input
                    {...register("expiry_day", {
                      required: "Expiry day is required",
                    })}
                    placeholder="Number of days"
                    className="px-3 py-2 border rounded w-full"
                    type="number"
                  />
                </FormControl>
                {errors.expiry_day && (
                  <FormMessage>{errors.expiry_day.message}</FormMessage>
                )}
              </FormItem>

              <div className="space-y-2">
                <FormLabel>Facilities</FormLabel>
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      {...register(`fesility.${idx}.fesilityLine`)}
                      placeholder="Facility label"
                      className="flex-1 px-3 py-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                      aria-label="Remove facility"
                      title="Remove facility"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    onClick={() => append({ fesilityLine: "" })}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Add facility"
                    title="Add facility"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition"
                  disabled={createPlanMutation.isLoading}
                >
                  {createPlanMutation.isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </Form>
        </div>
        <DialogClose />
      </DialogContent>
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Plan created"
        subtitle="Plan created successfully"
        ctaText="Close"
      />
    </Dialog>
  );
};

export default CreatePlanModal;
