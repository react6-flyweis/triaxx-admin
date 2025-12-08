import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const SubscriptionsPurchased = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useSubscriptions();

  // subscriptionsService responses may vary; normalize to an array fallback
  const subscriptionsRaw = data?.data ?? data ?? [];
  // show recent 5 subscriptions
  const subscriptions = Array.isArray(subscriptionsRaw)
    ? subscriptionsRaw.slice(0, 5)
    : [];

  const formatDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    if (isNaN(d)) return String(val);
    return d.toLocaleDateString();
  };

  const getBusinessName = (item) =>
    item?.client_id?.Business_Name ||
    item?.client_id?.businessName ||
    item?.business ||
    item?.businessName ||
    item?.restaurant?.name ||
    item?.client?.name ||
    item?.restaurant_name ||
    "-";

  const getPlanName = (item) => {
    const plan = item?.plan_id ?? item?.plan ?? item?.subscription_plan;
    if (!plan) return "-";
    const name = plan?.name ?? plan;
    const dur = plan?.plan_duration ? ` (${plan.plan_duration})` : "";
    return `${name}${dur}`;
  };

  const getAmount = (item) => {
    if (item == null) return "-";
    if (item.Payment)
      return item.currency ? `${item.Payment} ${item.currency}` : item.Payment;
    if (item.amount)
      return item.currency ? `${item.amount} ${item.currency}` : item.amount;
    if (item.price)
      return item.currency ? `${item.price} ${item.currency}` : item.price;
    if (item.total)
      return item.currency ? `${item.total} ${item.currency}` : item.total;
    if (item.PaymentStatus) return item.PaymentStatus;
    return "-";
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-black">
          Subscriptions Purchased
        </h2>
        <div
          className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate("/subscription-list")}
        >
          See all
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] w-full">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl text-sm md:text-base font-semibold text-black/60 px-4 py-3">
            <div>#</div>
            <div>Business Name</div>
            <div>Plan Purchased</div>
            <div>Purchased Date</div>
            <div>Amount</div>
          </div>

          {/* Loading / Error */}
          {isLoading && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Loading subscriptions...
            </div>
          )}

          {isError && (
            <div className="px-4 py-6 text-sm text-red-500">
              Error loading subscriptions: {String(error?.message ?? error)}
            </div>
          )}

          {/* Table Rows */}
          {!isLoading && !isError && (
            <>
              {subscriptions.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No subscriptions found.
                </div>
              )}

              {subscriptions.map((item, index) => (
                <div
                  key={item?.plan_id}
                  className={`grid grid-cols-5 items-center bg-white border-x border-b border-black/20 px-4 py-3 text-sm md:text-base ${
                    index === subscriptions.length - 1 ? "rounded-b-2xl" : ""
                  }`}
                >
                  <div>{index + 1}</div>
                  <div>{getBusinessName(item)}</div>
                  <div>{getPlanName(item)}</div>
                  <div>
                    {formatDate(
                      item?.CreateAt ??
                        item?.UpdatedAt ??
                        item?.createdAt ??
                        item?.purchasedAt ??
                        item?.date
                    )}
                  </div>
                  <div className="text-green-500 font-semibold">
                    {getAmount(item)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPurchased;
