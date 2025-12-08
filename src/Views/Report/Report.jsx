import withAdminLayout from "../AdminPanel/withAdminLayout";
import { useReports } from "@/hooks/useReports";
import StatCard from "@/Components/ui/StatCard";
import SkeletonCard from "@/Components/ui/SkeletonCard";
import { Users, UserX, TrendingUp } from "lucide-react";
import ActiveClientsChart from "./ActiveClientsChart";
import TicketsChart from "./TicketsChart";
import SupportTicketsTable from "./SupportTicketsTable";
import ClientsTable from "./ClientsTable";
import InactiveClientsChart from "./InactiveClientsChart";
import SubscriptionsTable from "./SubscriptionsTable";
import RevenueCard from "./RevenueCard";
import LatestTransactions from "./LatestTransactions";
import CityWiseUsageChart from "./CityWiseUsageChart";

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

      {/* Report Content: Active and Inactive Clients */}
      {!isLoading && (reportData || isError) && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Active Clients</h3>
                <button className="text-sm text-blue-600">See all</button>
              </div>

              <ClientsTable filter="active" />
            </div>

            <div className="">
              <div className="flex">
                <h3 className="text-lg font-bold mb-4 mr-1">Active Clients</h3>
                <span>(Reports)</span>
              </div>

              <ActiveClientsChart reportData={reportData} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <div className="flex">
                <h3 className="text-lg font-bold mb-4 mr-1">
                  Inactive Clients
                </h3>
                <span>(Reports)</span>
              </div>

              <InactiveClientsChart reportData={reportData} />
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Inactive Clients</h3>
                <button className="text-sm text-red-600">See all</button>
              </div>

              <ClientsTable filter="inactive" />
            </div>
          </div>
          {/* Revenue & Subscriptions Section (from design) */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <div className="flex">
                  <h3 className="text-lg font-bold mb-4 mr-1">
                    Subscription Sales
                  </h3>
                  <span>(Reports)</span>
                </div>
                <RevenueCard
                  total={reportData?.reports?.TotalRevenueFormatted || "0 XOF"}
                  changePercent={
                    reportData?.reports?.RevenueChangePercent || 12
                  }
                  bars={reportData?.reports?.RevenueBars || undefined}
                  months={undefined}
                />
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Subscriptions Sales</h3>
                  <button className="text-sm text-red-600">See all</button>
                </div>

                <div className="overflow-x-auto">
                  <SubscriptionsTable />
                </div>
              </div>
            </div>
          </div>

          {/* Latest Transactions Section (from design) */}
          <LatestTransactions />

          {/* Tickets & Support Tickets Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Tickets</h3>
                  <button className="text-sm text-gray-600">See all</button>
                </div>

                <TicketsChart reportData={reportData} />
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Support Tickets</h3>
                  <button className="text-sm text-blue-600">See all</button>
                </div>

                <SupportTicketsTable />
              </div>
            </div>
          </div>

          <CityWiseUsageChart reportData={reportData} />
        </div>
      )}
    </div>
  );
};

const ReportWithLayout = withAdminLayout(Report);

export default ReportWithLayout;
