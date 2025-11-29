import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import { useClient } from "../../hooks/useClients";
import Loading from "../ui/Loading";
import Restaurant from "../../assets/Images/admin/client/Restaurant.png";
import Lock from "../../assets/Images/admin/client/Lock.png";
import uil_message from "../../assets/Images/admin/client/uil_message.png";
import Icon from "../../assets/Images/admin/client/Icon.png";
import arrow from "../../assets/Images/Home/arrow.png";
import Performance from "./Performance";
import RenewalPopupModal from "./RenewalPopupModal";
import EmployeeCard from "./EmployeeCard";

const ClientDetails = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const { data: clientRes, error, isError, isLoading } = useClient(id);
  const client = clientRes?.data || null;
  const navigate = useNavigate();

  const yearsSince = (iso) => {
    if (!iso) return "1 Year";
    const diff = Date.now() - new Date(iso).getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    return `${years > 0 ? years : 1} Year${years === 1 ? "" : "s"}`;
  };

  // Handle basic loading and error states early
  if (isLoading) return <Loading />;

  if (isError) {
    const status = error?.status || error?.response?.status || null;

    if (status === 404) {
      return (
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8 text-black text-center">
          <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            We couldn't find a client with ID:{" "}
            <span className="font-semibold">{id}</span>.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/clients"
              className="px-6 py-3 bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl font-semibold"
            >
              Back to Clients
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 text-black text-center">
        <h1 className="text-2xl font-bold mb-2">Error loading client</h1>
        <p className="text-sm text-gray-600 mb-6">
          {error?.message || "Unexpected error"}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white"
          >
            Go Back
          </button>
          <Link
            to="/clients"
            className="px-6 py-3 bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl font-semibold"
          >
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-black">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-gray-800 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span className="text-gray-400 flex items-center gap-2 sm:gap-5 text-xl sm:text-2xl lg:text-[32px]">
          Subscriptions Purchased
          <span className="font-poppins font-bold leading-[120%] tracking-[0%]">
            <img
              src={arrow}
              alt="Arrow"
              className="w-3 h-3 sm:w-4 sm:h-4 inline-block"
            />
          </span>
        </span>
        Client Details {id ? `- ${id}` : ""}
      </h1>

      {/* Tabs */}
      <div className="relative w-full max-w-[300px] sm:w-[254px]">
        <div className="flex gap-8 sm:gap-8 pb-2 justify-start sm:justify-between">
          {["about", "performance"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer text-lg sm:text-[20px] capitalize ${
                activeTab === tab
                  ? "font-bold text-black"
                  : "text-gray-600 font-medium"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="h-1 w-full sm:w-[254px] bg-gray-400 relative rounded-full overflow-hidden">
          <div
            className="h-full absolute top-0 left-0 bg-linear-to-r from-[#6A1B9A] to-[#D32F2F] transition-all duration-300"
            style={{
              width: window.innerWidth < 640 ? "50%" : "30%",
              transform:
                activeTab === "about"
                  ? "translateX(0%)"
                  : window.innerWidth < 640
                  ? "translateX(100%)"
                  : "translateX(232%)",
            }}
          ></div>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "about" && (
        <>
          {/* Top Section */}
          <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Restaurant Image */}
            <div className="w-full lg:w-[377px] h-[200px] sm:h-[212px] rounded-xl shadow-md overflow-hidden">
              <img
                src={client?.Business_logo || Restaurant}
                alt={client?.Business_Name || "Restaurant"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Box */}
            <div className="flex flex-col justify-center w-full lg:w-[645px] bg-linear-to-b from-[#6A1B9A1A] to-[#D32F2F1A] p-4 sm:p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold">
                {client?.Business_Name || "Restaurant Beef Cairo"}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-base sm:text-[18px] font-medium">
                <span className="text-[#34C759]">
                  {client?.Status ? "Active user" : "Inactive user"}
                </span>
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{
                    backgroundColor: client?.Status ? "#34C759" : "#D9534F",
                  }}
                ></span>
                <span className="text-black">
                  {yearsSince(client?.CreateAt)}
                </span>
              </div>
              <p className="text-sm mt-1 font-medium">
                {client?.CreateAt
                  ? `Since ${new Date(client.CreateAt).getFullYear()}`
                  : "Since 1992"}
              </p>
              <p className="mt-2 text-base sm:text-[18px] font-medium leading-[22px]">
                {/* description */}
                {client?.type || client?.Email
                  ? `${client?.type ? client.type + " · " : ""}${
                      client?.Email ? client.Email : ""
                    }`
                  : ""}
              </p>

              {(client?.language?.length > 0 ||
                client?.currency?.length > 0) && (
                <div className="mt-3 text-sm font-medium">
                  {client?.language?.length > 0 && (
                    <div className="mb-1">
                      Languages:{" "}
                      {client.language.map((l) => l.Language_name).join(", ")}
                    </div>
                  )}
                  {client?.currency?.length > 0 && (
                    <div>
                      Currency: {client.currency.map((c) => c.name).join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subscription Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
              Account & Subscription Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mb-6 sm:mb-8">
              {[
                ["Current Plan", "6 Months Plan"],
                ["Purchased Date", "Jan 20,2025"],
                ["Renewal Date", "Jan 20,2025"],
                ["First Purchase on", "Jan 20,2024"],
                ["No of Renewals", "09"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-base sm:text-[18px] font-semibold">
                    {label}
                  </p>
                  <div className="bg-linear-to-b from-[#6A1B9A1A] to-[#D32F2F1A] rounded-lg px-4 py-3 mt-2 text-base sm:text-[18px] font-medium">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
              <button
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl text-base sm:text-[18px] w-full sm:w-auto"
                onClick={() => setShowModal(true)}
              >
                <span className="hidden sm:inline">Send Renewal Message</span>
                <span className="sm:hidden">Send Renewal</span>
                <img
                  src={uil_message}
                  alt="Message"
                  className="w-4 h-4 sm:w-auto sm:h-auto"
                />
              </button>
              <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl text-base sm:text-[18px] w-full sm:w-auto">
                <span className="hidden sm:inline">Reset Account Password</span>
                <span className="sm:hidden">Reset Password</span>
                <img
                  src={Lock}
                  alt="Lock"
                  className="w-4 h-4 sm:w-auto sm:h-auto"
                />
              </button>
            </div>
          </div>

          {/* Employee Details */}
          <div className="mt-12 sm:mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
                Employee Details
              </h2>
              {(() => {
                // determine if there are any employees available
                const employeeCountByRole = client?.EmployeeCountByRole || [];
                const clientEmployees = client?.Employee || [];

                // sum counts from EmployeeCountByRole if provided, otherwise fallback to actual employee array length
                const totalFromRoles = employeeCountByRole.reduce(
                  (acc, r) => acc + (r.count || 0),
                  0
                );
                const totalEmployees = Math.max(
                  totalFromRoles,
                  clientEmployees.length || 0
                );
                const hasEmployees = totalEmployees > 0;

                if (!hasEmployees) {
                  return (
                    <div className="flex items-center gap-2 text-base sm:text-[18px] font-medium poppins-text text-gray-400 cursor-not-allowed opacity-60">
                      <span>View more</span>
                      <img
                        src={Icon}
                        alt="Icon"
                        className="w-4 h-4 sm:w-auto sm:h-auto"
                      />
                    </div>
                  );
                }

                return (
                  <Link
                    to={`/client-details/${id}/employees`}
                    className="flex items-center gap-2 text-base sm:text-[18px] font-medium cursor-pointer poppins-text"
                  >
                    <span>View more</span>
                    <img
                      src={Icon}
                      alt="Icon"
                      className="w-4 h-4 sm:w-auto sm:h-auto"
                    />
                  </Link>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-6 sm:mt-8">
              {client?.EmployeeCountByRole &&
              client.EmployeeCountByRole.length > 0 ? (
                (() => {
                  // compute max count to render relative widths
                  const counts = client.EmployeeCountByRole.map(
                    (r) => r.count || 0
                  );
                  const maxCount = Math.max(...counts, 1);

                  return client.EmployeeCountByRole.map((r, i) => {
                    const roleName =
                      r.role_name || r.Role_name || r.roleName || "Role";
                    const count = r.count || 0;
                    const widthPercent = Math.round((count / maxCount) * 100);
                    return (
                      <Link
                        key={i}
                        to={`/client-details/${id}/employees/${roleName
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="no-underline"
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-center text-lg sm:text-[20px] font-semibold">
                            <p>{roleName}</p>
                            <p className="text-base sm:text-[18px] font-medium">
                              {count}
                            </p>
                          </div>
                          <div className="w-full h-1.5 bg-gray-300 mt-2 rounded-full relative">
                            <div
                              className="h-1.5 bg-linear-to-b from-[#6A1B9A] to-[#D32F2F] rounded-full"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  });
                })()
              ) : (
                <div className="text-sm text-gray-600">
                  No employee data available.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "performance" && <Performance clientId={id} />}

      {showModal && <RenewalPopupModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

const ClientDetailsWithLayout = withAdminLayout(ClientDetails);

export default ClientDetailsWithLayout;
