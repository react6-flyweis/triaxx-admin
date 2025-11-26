import React from "react";
import withAdminLayout from "../../Views/AdminPanel/withAdminLayout";
import profileImg from "../../assets/Images/admin/SidebarIcon/profileAvatar.png";
import { useQuery } from "@tanstack/react-query";
import { getAllNotifications } from "../../services/notificationsService";

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

const Notifications = () => {
  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotifications,
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    // Skeleton placeholders to match notification card layout
    const placeholders = Array.from({ length: 4 });
    return (
      <div className="w-full mx-auto p-4 space-y-6" aria-busy="true">
        {placeholders.map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 bg-white shadow-md p-4 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-600">Error: {error?.message}</div>;
  }

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      {notifications.length === 0 && (
        <div className="text-sm text-[#666C7E]">No notifications</div>
      )}

      {notifications.map((n) => (
        <div
          key={n._id || n.Notifications_id}
          className="flex items-start gap-4 bg-white shadow-md p-4 rounded-lg"
        >
          <img
            src={profileImg}
            alt={n?.CreateBy?.Name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-[16px] text-[#333]">
              <span className="font-semibold">{n?.CreateBy?.Name || ""}</span>{" "}
              {n?.Notifications}
            </p>
            <p className="text-sm text-[#666C7E]">{formatTime(n?.CreateAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const WrappedNotifications = withAdminLayout(Notifications);
export default WrappedNotifications;
