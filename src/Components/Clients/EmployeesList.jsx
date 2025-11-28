import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import Loading from "../ui/Loading";
import avatarImg from "../../assets/Images/admin/client/global-user.png";
import { useClient } from "../../hooks/useClients";

const EmployeesList = () => {
  const { id, role } = useParams();
  const normalizedRole = role?.replace(/-/g, " ") || "";
  const navigate = useNavigate();
  const { data: clientRes, isLoading, isError, error } = useClient(id);
  const client = clientRes?.data || null;

  // Fallback/mock data for employee list per role
  const fallbackEmployees = Array.from({ length: 5 }).map((_, i) => ({
    id: `00${i + 1}`,
    name: "Jackline Fernandes",
    position: role ? role.replace(/-/g, " ") : "Manager",
    shift: "9:00 - 20:00",
    performance: `${95}%`,
    avatar: avatarImg,
  }));

  // If API provides employee list per role at client.employees or client.roles
  const employeesFromAPI =
    client?.employees ||
    client?.roles?.find(
      (r) => r.name?.toLowerCase() === normalizedRole?.toLowerCase()
    )?.employees ||
    null;

  const employees =
    employeesFromAPI ||
    fallbackEmployees.map((e) => ({
      ...e,
      position: normalizedRole || e.position,
    }));

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="w-full p-6 text-center">
        <h2 className="text-lg font-bold">Error loading employees</h2>
        <p className="text-sm text-gray-600">{error?.message || "Unknown"}</p>
      </div>
    );

  return (
    <div className="w-full p-6 text-black">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Employee &nbsp;› &nbsp;
            {normalizedRole ? normalizedRole : "Managers"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {client?.Business_Name || "Restaurant"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl bg-white"
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="w-full bg-linear-to-b from-[#fff0f6] to-[#fff7fb] border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-600">
            <div>Emp Name</div>
            <div>Emp id</div>
            <div>Position</div>
            <div>Shift timings</div>
            <div>Over all Performance %</div>
            <div>View employee</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {employees.map((emp, i) => (
            <div key={i} className="px-6 py-4">
              <div className="grid grid-cols-6 gap-4 items-center text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar || avatarImg}
                    alt={emp.name}
                    className="w-10 h-10 rounded-full border border-gray-100"
                  />
                  <div className="text-sm text-gray-800 font-medium">
                    {emp.name}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{emp.id}</div>
                <div className="text-sm text-gray-600">{emp.position}</div>
                <div className="text-sm text-gray-600">{emp.shift}</div>
                <div className="text-sm font-semibold text-pink-600">
                  {emp.performance}
                </div>
                <div className="text-right">
                  <Link
                    to={`/client-details/${id}/employees/${role}/employee/${emp.id}`}
                    className="text-sm text-gray-700"
                  >
                    View more &gt;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAdminLayout(EmployeesList);
