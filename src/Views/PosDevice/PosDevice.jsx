import withAdminLayout from "../AdminPanel/withAdminLayout";
import printer from "../../assets/Images/admin/Pos/printer.png";
import system from "../../assets/Images/admin/Pos/system.png";
import global from "../../assets/Images/admin/client/global-user.png";

import HardwareChart from "../../Components/PosDevice/HardwareChart";
import HardwareSold from "../../Components/PosDevice/HardwareSold";
import { usePosDevices } from "../../hooks/usePosDevices";

const PosDevice = () => {
  const { data, isLoading } = usePosDevices();

  const apiData = data?.data ?? {};

  const metrics = [
    {
      title: "Total Clients",
      value: apiData.TotalClientsCount ?? 0,
      imageSrc: global,
      bgColor: "bg-green-100",
    },
    {
      title: "Printers",
      value: apiData.TotalPrintersCount ?? 0,
      imageSrc: printer,
      bgColor: "bg-pink-100",
      valueColor: "text-green-500",
      trend: apiData.TotalPrintersCount > 0 ? "up" : undefined,
    },
    {
      title: "POS Systems",
      value: apiData.TotalpostSystemsCount ?? 0,
      imageSrc: system,
      bgColor: "bg-blue-100",
      trend: apiData.TotalpostSystemsCount > 0 ? "up" : undefined,
    },
  ];

  // const handleEditClick = (order) => {
  //   setSelectedOrder(order);
  //   setShowEditModal(true);
  // };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          POS Orders Management
        </h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 poppins-text">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="relative w-full bg-white rounded-[25px] shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_4px_4px_rgba(0,0,0,0.25)] flex items-center px-6 py-5 gap-6"
          >
            <div
              className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full ${metric.bgColor} flex items-center justify-center`}
            >
              <img
                src={metric.imageSrc}
                alt="icon"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <p className="text-[16px] sm:text-[18px] text-[#00000099] font-medium">
                {isLoading ? (
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                ) : (
                  metric.title
                )}
              </p>
              <div className="flex items-center gap-2">
                {metric.trend === "up" && (
                  <span className="text-[#34C759] font-bold text-lg sm:text-xl">
                    ↑
                  </span>
                )}
                {metric.trend === "down" && (
                  <span className="text-[#FF3B30] font-bold text-lg sm:text-xl">
                    ↓
                  </span>
                )}
                {isLoading ? (
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span
                    className={`text-[20px] sm:text-[24px] font-bold leading-[30px] sm:leading-9 ${
                      metric.valueColor ||
                      (metric.trend === "up"
                        ? "text-[#34C759]"
                        : metric.trend === "down"
                        ? "text-[#FF3B30]"
                        : "text-[#232323]")
                    }`}
                  >
                    {metric.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row w-full gap-6 mt-10">
        <div className="w-full lg:w-[40%]">
          <HardwareChart
            monthlyData={apiData.HardwareDeviesSolde_Chart?.monthlyData}
            totalPrice={apiData.HardwareDeviesSolde_Chart?.TotalPrice}
            sold={apiData.HardwareDeviesSolde_Chart?.Sold}
            loading={isLoading}
          />
        </div>
        <div className="w-full lg:w-[60%]">
          <HardwareSold soldDetails={apiData.SoldDetials} loading={isLoading} />
        </div>
      </div>
    </div>
  );
};

const PosDeviceWithLayout = withAdminLayout(PosDevice);

export default PosDeviceWithLayout;
