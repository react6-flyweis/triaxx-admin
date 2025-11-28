import { useParams, Link } from "react-router-dom";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import { useEmployees } from "../../hooks/useEmployees";
import Loading from "../ui/Loading";
import EmployeeCard from "./EmployeeCard";

const Employee = () => {
  const { id } = useParams();
  const {
    data: employeesRes,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useEmployees(id);

  // If employees fetch is loading, show loading state
  if (isEmployeesLoading) return <Loading />;
  // prefer showing employee-specific error if it happens
  if (isEmployeesError)
    return (
      <div className="w-full p-6 text-center">
        <h2 className="text-lg font-bold">Error loading employees</h2>
        <p className="text-sm text-gray-600">
          {employeesError?.message || "Unknown"}
        </p>
      </div>
    );

  // If the employees API returns grouped roles, prefer that. Fallback to sample roles
  // for local development.
  const dataToRender = Array.isArray(employeesRes?.data)
    ? employeesRes.data
    : [];

  const businessName =
    employeesRes?.meta?.Business_Name ||
    employeesRes?.meta?.businessName ||
    employeesRes?.Business_Name ||
    employeesRes?.businessName ||
    "Restaurant";

  return (
    <div className="w-full p-6 text-black">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employee</h1>
          <p className="text-sm text-gray-600">{businessName}</p>
        </div>
        <Link
          to={`/client-details/${id}`}
          className="text-sm text-[#6A1B9A] font-medium underline"
        >
          Back to Client
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataToRender.length === 0 ? (
          <div className="p-6 col-span-full text-center text-gray-500">
            No groups/roles available for this client.
          </div>
        ) : (
          dataToRender.map((r, i) => (
            <Link
              key={i}
              to={`/client-details/${id}/employees/${r.role
                ?.toLowerCase()
                ?.replace(/\s+/g, "-")}`}
              className="no-underline"
            >
              <EmployeeCard
                key={i}
                role={r.role || r.name || r.group || r.groupName}
                description={r.description}
                rating={r.rating}
                reviews={r.reviews}
                completion={r.completion}
                employees={r.employees || []}
                count={r.count || (r.employees || []).length}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const EmployeeWithLayout = withAdminLayout(Employee);
export default EmployeeWithLayout;
