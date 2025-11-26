import React, { useState } from "react";
import { Plus, Edit, RefreshCw } from "lucide-react";
import withAdminLayout from "../AdminPanel/withAdminLayout";
import { usePosOrders } from "../../hooks/usePosOrders";
import OrderFormDialog from "../../Components/PosDevice/OrderFormDialog";

import printer from "../../assets/Images/admin/Pos/printer.png";
import system from "../../assets/Images/admin/Pos/system.png";
import global from "../../assets/Images/admin/client/global-user.png";

import HardwareChart from "../../Components/PosDevice/HardwareChart";
import HardwareSold from "../../Components/PosDevice/HardwareSold";

const PosDevice = () => {
  const [orders, setOrders] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");

  const metrics = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      imageSrc: global,
      bgColor: "bg-green-100",
    },
    {
      title: "Active Orders",
      value: orders.filter((order) => order.Status).length.toString(),
      imageSrc: printer,
      bgColor: "bg-pink-100",
      valueColor: "text-green-500",
      trend: "up",
    },
    {
      title: "Completed Orders",
      value: orders.filter((order) => !order.Status).length.toString(),
      imageSrc: system,
      bgColor: "bg-blue-100",
      trend: "up",
    },
  ];

  const normalizeOrders = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.success && response.data)
      return Array.isArray(response.data) ? response.data : [];
    if (response.orders)
      return Array.isArray(response.orders) ? response.orders : [];
    if (response.data && Array.isArray(response.data.orders))
      return response.data.orders;
    return [];
  };

  const {
    data: rawOrders,
    isLoading,
    isError: fetchError,
    error: fetchErrorObj,
    refetch,
  } = usePosOrders({
    onError: (err) => {
      setError(err.message || "Failed to fetch orders");
    },
  });

  // derived normalized orders
  React.useEffect(() => {
    setOrders(normalizeOrders(rawOrders));
  }, [rawOrders]);

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          POS Orders Management
        </h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Order
          </button>
          {/* <SignOutButton /> */}
        </div>
      </div>

      {/* Error Display */}
      {(error || fetchError) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error || (fetchErrorObj && fetchErrorObj.message)}</p>
          {error.includes("Authentication") && (
            <p className="mt-2 text-sm">Redirecting to login...</p>
          )}
        </div>
      )}

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
                className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]"
              />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <p className="text-[16px] sm:text-[18px] text-[#00000099] font-medium">
                {metric.title}
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
                <span
                  className={`text-[20px] sm:text-[24px] font-bold leading-[30px] sm:leading-[36px] ${
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No orders found</p>
              <p className="text-sm">Create your first order to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Dining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.Customer_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.Dining_Option}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.Table_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        ${order.Tax}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.Status
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.Status ? "Active" : "Completed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEditClick(order)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Edit Order"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row w-full gap-6 mt-10">
        <div className="w-full lg:w-[40%]">
          <HardwareChart />
        </div>
        <div className="w-full lg:w-[60%]">
          <HardwareSold />
        </div>
      </div>

      {/* Modals (shadcn dialog + react-hook-form) */}
      <OrderFormDialog
        open={showCreateModal}
        onOpenChange={(val) => setShowCreateModal(val)}
        mode="create"
        onSuccess={() => alert("Order created successfully!")}
      />
      <OrderFormDialog
        open={showEditModal}
        onOpenChange={(val) => setShowEditModal(val)}
        mode="edit"
        initialData={selectedOrder}
        onSuccess={() => alert("Order updated successfully!")}
      />
    </div>
  );
};

const PosDeviceWithLayout = withAdminLayout(PosDevice);

export default PosDeviceWithLayout;
