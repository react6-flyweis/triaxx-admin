import withAdminLayout from "../AdminPanel/withAdminLayout";
import { useReports } from "@/hooks/useReports";
import StatCard from "@/Components/ui/StatCard";
import SkeletonCard from "@/Components/ui/SkeletonCard";
import { Users, UserX, TrendingUp } from "lucide-react";
import ActiveClientsSection from "./ActiveClientsSection";

const Report = () => {
  const { data: reportData, isLoading, isError, error } = useReports();

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>
      </div>

      {/* Key Metrics Stat Cards */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                title="Total Active Clients"
                value={
                  reportData?.reports?.TotalActiverestaurant?.toLocaleString() ||
                  "0"
                }
                icon={Users}
                bgColor="bg-yellow-100"
                valueColor="text-gray-900"
              />
              <StatCard
                title="Total Inactive Clients"
                value={
                  reportData?.reports?.TotalInacitverestaurant?.toLocaleString() ||
                  "0"
                }
                icon={UserX}
                bgColor="bg-pink-100"
                valueColor="text-red-600"
              />
              <StatCard
                title="Total Renewal Rate"
                value={`${reportData?.reports?.TotalRenewalRate || 0}%`}
                icon={TrendingUp}
                bgColor="bg-green-100"
                valueColor="text-green-600"
              />
              {/* Optionally add a fourth stat card here for revenue */}
            </>
          )}
        </div>
      </div>

      {/* Error State */}
      {isError && !isLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <p className="text-yellow-800 mb-2">
            ⚠️ {error?.message || "Failed to load reports."}
          </p>
          <p className="text-sm text-yellow-700">
            You can try refreshing or check network settings.
          </p>
        </div>
      )}

      {/* Report Content: only Active Clients */}
      {!isLoading && (reportData || isError) && (
        <div className="space-y-8">
          <ActiveClientsSection reportData={reportData} />
        </div>
      )}
    </div>
  );
};

const ReportWithLayout = withAdminLayout(Report);

export default ReportWithLayout;
