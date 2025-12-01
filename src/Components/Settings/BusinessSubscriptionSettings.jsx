import { useState } from "react";
import { useAdminPlans } from "@/hooks/useAdminPlans";
import Loading from "@/Components/ui/Loading";
import CreatePlanModal from "./CreatePlanModal";

function SubscriptionManagementUI() {
  //   const [toggleStates, setToggleStates] = useState({
  //     twoWeeks: true,
  //     oneWeek: true,
  //     oneDay: true,
  //   });
  const { data, isLoading, isError, error, refetch } = useAdminPlans();
  const [modalOpen, setModalOpen] = useState(false);

  //   const handleToggle = (key) => {
  //     setToggleStates((prev) => ({
  //       ...prev,
  //       [key]: !prev[key],
  //     }));
  //   };

  //   const handleSaveChanges = () => {
  //     // Here you would typically handle the logic for saving the state,
  //     // for example, by making an API call.
  //     // console.log("Saving changes:", toggleStates);
  //     alert("Changes Saved!");
  //   };

  const Toggle = ({ isOn, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
        isOn ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
          isOn ? "translate-x-8" : "translate-x-1"
        }`}
      />
      <span
        className={`absolute left-2 text-xs font-semibold text-white ${
          isOn ? "opacity-100" : "opacity-0"
        }`}
      >
        ON
      </span>
      <span
        className={`absolute right-2 text-xs font-semibold text-white ${
          !isOn ? "opacity-100" : "opacity-0"
        }`}
      >
        OFF
      </span>
    </button>
  );

  // Static plans placeholder removed — data will be loaded from API via useAdminPlans

  //   const renewalOptions = [
  //     { key: "twoWeeks", label: "2 weeks ago" },
  //     { key: "oneWeek", label: "1 week ago" },
  //     { key: "oneDay", label: "1 Day ago" },
  //   ];

  return (
    <>
      <div className="">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header - Subscription Plans */}
          <div className="w-full mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Subscription Plans
              </h1>
              <p className="text-sm text-gray-500">
                Manage business subscription plans
              </p>
            </div>
            <div>
              <button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md shadow-md hover:from-purple-700 hover:to-pink-600 transition"
                onClick={() => setModalOpen(true)}
              >
                Create Plan
              </button>
            </div>
          </div>

          {/* Subscription Plans Section */}
          <div className="space-y-4 w-full">
            {isLoading ? (
              <div className="w-full">
                <Loading />
              </div>
            ) : isError ? (
              <div className="text-red-600">Error: {error?.message}</div>
            ) : (
              <div className="w-full">
                {Array.isArray(data?.data) && data.data.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.data.map((plan) => (
                      <div
                        key={plan._id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                      >
                        {/* gradient accent */}
                        <div className="h-1 rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-3" />
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm text-gray-500">
                              {plan.PlanName}
                            </div>
                            <div className="text-lg font-bold">
                              {plan.Price ? `${plan.Price} XOF` : "—"}
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs ${
                              plan.Status
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {plan.Status ? "Active" : "Inactive"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {plan.Description || "No description"}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          Created by: {plan.CreateBy?.Name || "—"}
                        </div>
                        {Array.isArray(plan.fesility) &&
                          plan.fesility.length > 0 && (
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {plan.fesility.map((f) => (
                                <li key={f._id}>{f.fesilityLine || "—"}</li>
                              ))}
                            </ul>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No plans found.</div>
                )}
              </div>
            )}
          </div>

          {/* Subscription Renewal Messages Section */}
          {/* <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-gray-700">
              Subscription Renewal Messages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renewalOptions.map((option) => (
                <div
                  key={option.key}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 h-14 flex items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold">
                      {option.label}
                    </span>
                    <Toggle
                      isOn={toggleStates[option.key]}
                      onToggle={() => handleToggle(option.key)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Renewal Message Section */}
          {/* <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-gray-700">
              Renewal Message
            </h2>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">
                Hey ABC Restaurant, We have an Amazing Renewal Plan for you. The
                validity of the Offer is going to end in 3 days. Grab it soon
                before the prices of Subscriptions increases.
              </p>
            </div>
          </div> */}

          {/* Save Changes Button */}
          {/* <div className="flex justify-end mt-4 w-full">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-md font-bold"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div> */}
        </div>
      </div>
      {modalOpen && (
        <CreatePlanModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={(payload) => {
            // In a complete implementation we'd call a POST API then refetch
            console.log("Create plan payload", payload);
            // refresh list after creation
            refetch();
          }}
        />
      )}
    </>
  );
}

export default SubscriptionManagementUI;
