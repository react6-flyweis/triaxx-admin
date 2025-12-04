import React, { useState } from "react";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const formatDate = (d) => {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d || "-";
  }
};

const normalizeSubscriptions = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.success && response.data)
    return Array.isArray(response.data) ? response.data : [];
  if (response.subscriptions && Array.isArray(response.subscriptions))
    return response.subscriptions;
  if (response.data && Array.isArray(response.data.subscriptions))
    return response.data.subscriptions;
  if (response.data && Array.isArray(response.data)) return response.data;
  return [];
};

/**
 * SubscriptionsTable
 * - If `subscriptions` prop is provided and non-empty, it will be used.
 * - Otherwise this component will call `useSubscriptions` with the selected period (default: "This Week").
 * - Merges loading/error states from props and hook.
 */
const SubscriptionsTable = ({
  subscriptions = null,
  isLoading: propsLoading = false,
  isError: propsError = false,
  error: propsErrorObj = null,
  defaultPeriod = "This Week",
}) => {
  const [selectedPeriod] = useState(defaultPeriod);
  const filterParam = selectedPeriod.toLowerCase();

  const {
    data: subsRes,
    isLoading: hookLoading,
    isError: hookIsError,
    error: hookError,
  } = useSubscriptions(filterParam);

  // Prefer explicit `subscriptions` prop when provided, otherwise use hook response
  const source = subscriptions ?? subsRes;
  const subs = normalizeSubscriptions(source);

  const isLoading = propsLoading || hookLoading;
  const isError = propsError || hookIsError;
  const error = propsErrorObj || hookError;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px] w-full">
        <div className="grid grid-cols-4 md:grid-cols-6 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-black/60 font-semibold text-sm md:text-base px-4 py-3">
          <div>#</div>
          <div className="col-span-2">Business Name</div>
          <div className="text-center">Plan Purchased</div>
          <div className="hidden md:block text-center">Purchased Date</div>
          <div className="hidden md:block text-right">Amount</div>
        </div>

        {isLoading ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-400">
            Loading...
          </div>
        ) : isError ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-red-500">
            {error?.message || "Failed to load subscriptions"}
          </div>
        ) : subs.length === 0 ? (
          <div className="bg-white border-x border-b border-black/20 px-4 py-6 rounded-b-2xl text-center text-gray-500">
            No data found
          </div>
        ) : (
          subs.map((s, idx) => (
            <div
              key={s.id ?? idx}
              className={`grid grid-cols-4 md:grid-cols-6 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                idx === subs.length - 1 ? "rounded-b-2xl" : ""
              }`}
            >
              <div className="text-gray-600">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="col-span-2 font-medium">
                {s.businessName || s.business || s.name || "—"}
              </div>
              <div className="text-center text-gray-700">
                <div>{s.plan || s.planName || "—"}</div>
              </div>
              <div className="hidden md:block text-center text-gray-600">
                {formatDate(s.purchasedDate || s.date || s.created_at)}
              </div>
              <div className="hidden md:block text-right text-green-600 font-semibold">
                {s.amount ? `${Number(s.amount).toLocaleString()} XOF` : "—"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriptionsTable;
