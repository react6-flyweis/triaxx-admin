import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useSubscriptionRenewalAlerts from "@/hooks/useSubscriptionRenewalAlerts";
import useSendRenewalEmail from "@/hooks/useSendRenewalEmail";

function formatDate(val) {
  try {
    if (!val) return "";
    const d = new Date(val);
    return d.toLocaleDateString();
  } catch {
    return String(val);
  }
}

const SubscriptionRenewalAlert = () => {
  const navigate = useNavigate();
  const {
    data: alerts = [],
    isLoading,
    isError,
    error,
  } = useSubscriptionRenewalAlerts();

  const sendRenewal = useSendRenewalEmail();
  const [sendingId, setSendingId] = useState(null);

  const handleSend = (item) => {
    const id = item?.id || item?.restaurant_id || item?.restaurantId;
    setSendingId(id);
    const payload = {
      restaurant_id: item?.restaurant_id || item?.id || item?.restaurantId,
      email: item?.email || item?.contact_email || item?.Restaurant?.Email,
    };
    sendRenewal.mutate(payload, {
      onSettled: () => setSendingId(null),
    });
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">
          Subscription Renewal Alert
        </h2>
        <button
          className="text-sm font-semibold text-black font-['Poppins']"
          onClick={() => navigate("/subscription-list")}
        >
          See all
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Table Header */}
          <div className="bg-gradient-to-b from-purple-700/10 to-red-600/10 border-b border-black/20 px-6 sm:px-10 py-4 sm:py-6">
            <div className="grid grid-cols-4 gap-4 sm:gap-8 items-center">
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins']">
                #
              </span>
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins']">
                Business Name
              </span>
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins'] text-center">
                Renewal Date
              </span>
              <span className="text-sm sm:text-base font-semibold text-black/60 font-['Poppins'] text-center">
                Notify Client
              </span>
            </div>
          </div>

          {/* Table Rows */}
          {isLoading ? (
            // simple skeleton rows
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className={`border-b border-black/20 px-6 sm:px-10 py-4 sm:py-6 ${
                  idx === 2 ? "rounded-b-2xl" : ""
                }`}
              >
                <div className="grid grid-cols-4 gap-4 sm:gap-8 items-center">
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mx-auto" />
                  <div className="h-8 bg-gray-200 rounded w-28 mx-auto animate-pulse" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="p-4 text-red-600">Error: {error?.message}</div>
          ) : alerts.length === 0 ? (
            <div className="p-4 text-sm text-[#666C7E]">No renewal alerts</div>
          ) : (
            alerts.map((subscription, index) => {
              const id =
                subscription?.id || subscription?.restaurant_id || index;
              const businessName =
                subscription?.businessName ||
                subscription?.restaurant_name ||
                subscription?.Restaurant?.Name ||
                "";
              const renewalDate =
                subscription?.renewalDate ||
                subscription?.RenewalDate ||
                subscription?.EndDate ||
                subscription?.expiry_date;

              return (
                <div
                  key={id}
                  className={`border-b border-black/20 px-6 sm:px-10 py-4 sm:py-6 ${
                    index === alerts.length - 1 ? "rounded-b-2xl" : ""
                  }`}
                >
                  <div className="grid grid-cols-4 gap-4 sm:gap-8 items-center">
                    <span className="text-sm sm:text-base font-semibold text-black font-['Poppins']">
                      {id}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-black font-['Poppins']">
                      {businessName}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-red-500 font-['Poppins'] text-center">
                      {formatDate(renewalDate)}
                    </span>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleSend(subscription)}
                        disabled={sendingId === id || sendRenewal.isLoading}
                        className="bg-gradient-to-b from-purple-700 to-red-600 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg text-sm sm:text-base font-semibold font-['Poppins'] hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        {sendingId === id || sendRenewal.isLoading
                          ? "Sending..."
                          : "Send Alert"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRenewalAlert;
