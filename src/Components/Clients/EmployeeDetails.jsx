import { useState } from "react";
import { useParams } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import Loading from "../ui/Loading";
import EmployeePerformance from "./EmployeePerformance";
import avatarImg from "../../assets/Images/admin/client/global-user.png";
import { useEmployeeDetails } from "../../hooks/useEmployeeDetails";

const EmployeeDetails = () => {
  const { id, role } = useParams();
  const {
    data: employeeRes,
    isLoading,
    isError,
    error,
  } = useEmployeeDetails(id);

  const employee = employeeRes?.data || null;

  // formatDate helper - produces a readable date string or '-' if unavailable
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    try {
      const d = new Date(dateValue);
      // If invalid date, return raw value as fallback
      if (isNaN(d.getTime())) return String(dateValue);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return String(dateValue);
    }
  };

  // For fallback sample with populated fields

  const [activeTab, setActiveTab] = useState("details");

  const normalizedRole = role?.replace(/-/g, " ") || "Managers";

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="w-full p-6 text-center">
        <h2 className="text-lg font-bold">Error loading employee</h2>
        <p className="text-sm text-gray-600">{error?.message || "Unknown"}</p>
      </div>
    );

  return (
    <div className="w-full p-6 text-black">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Employee Performance &nbsp;› &nbsp;{normalizedRole}
          </h1>
        </div>
        {/* <div className="flex items-center gap-4">
          <Link
            to={`/client-details/${id}/employees/${role}`}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl bg-white"
          >
            Back to List
          </Link>
        </div> */}
      </div>

      <div className="w-full bg-white rounded-lg p-4">
        <div className="flex items-center justify-start gap-6 border-b border-gray-200 pb-3">
          <button
            className={`text-sm font-semibold pb-2 ${
              activeTab === "details"
                ? "text-[#D32F2F] border-b-2 border-[#D32F2F]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`text-sm font-semibold pb-2 ${
              activeTab === "performance"
                ? "text-[#D32F2F] border-b-2 border-[#D32F2F]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
        </div>

        {activeTab === "details" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-40">
                <img
                  src={employee.user_image || employee.avatar || avatarImg}
                  alt={employee.Name || employee.name}
                  className="w-full h-40 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.Name ||
                      `${employee.first_name || ""} ${
                        employee.last_name || ""
                      }` ||
                      employee.name}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.phone}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Employee id</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.Employee_id || employee.id}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.Role_name ||
                      employee.Role_id ||
                      employee.position ||
                      "-"}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Responsibility
                  </label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.Responsibility?.Responsibility_name ||
                      employee.responsibility}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Details */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Employee Details</h2>
              <h3 className="text-lg font-semibold mb-4">Work Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Onboarding Date
                  </label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {formatDate(
                      employee.OnboardingDate ||
                        employee.WorkDetails?.OnBoardingDate ||
                        employee.onboardingDate
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Experience</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.WorkDetails?.Experience?.display ||
                      employee.experience}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Shift Timings</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.WorkDetails?.ShiftTimings?.average_in_time
                      ? `${employee.WorkDetails.ShiftTimings.average_in_time} - ${employee.WorkDetails.ShiftTimings.average_out_time}`
                      : employee.shift}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Total Leave</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.WorkDetails?.TotalLeave ?? employee.totalLeave}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Leave Left</label>
                  <div className="mt-1 bg-[#FFF0F6] rounded-lg px-3 py-2">
                    {employee.WorkDetails?.LeaveLeft ?? employee.leavesLeft}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <EmployeePerformance employee={employee} />
        )}
      </div>
    </div>
  );
};

export const EmployeeDetailsWithLayout = withAdminLayout(EmployeeDetails);

export default EmployeeDetailsWithLayout;
