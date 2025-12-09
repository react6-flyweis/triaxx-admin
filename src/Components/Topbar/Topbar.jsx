import { useState } from "react";
import { Search, Menu, Bell, ChevronDown } from "lucide-react";
import useStore from "../../store/useStore";
import porfileImg from "../../assets/Images/admin/SidebarIcon/profileAvatar.png";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";

const Topbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Section - Menu and Search */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="flex items-center bg-linear-to-r from-purple-50 to-red-50 rounded-full px-4 py-2 min-w-[300px]">
              <Menu className="w-5 h-5 text-gray-700 mr-3" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-gray-700 placeholder-gray-500"
              />
              <button className="ml-3 p-1 hover:bg-white rounded-full transition-colors">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Language, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-linear-to-r from-purple-50 to-red-50 rounded-xl px-4 py-2 hover:shadow-sm transition-all"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              <span className="text-sm font-medium text-gray-700">French</span>
              <div className="w-6 h-4 bg-linear-to-r from-blue-600 via-white to-red-600 rounded-sm flex">
                <div className="w-2 bg-blue-600 rounded-l-sm"></div>
                <div className="w-2 bg-white"></div>
                <div className="w-2 bg-red-600 rounded-r-sm"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span> */}
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 bg-linear-to-r from-purple-50 to-red-50 rounded-full px-4 py-2 hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={user?.avatar || porfileImg}
                  alt={user?.name || "Profile"}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.Name || "Jack"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {/* profile dropdown menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-30 py-1">
                {/* <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  <User className="inline mr-2 w-4 h-4 align-middle" /> My
                  Profile
                </button> */}

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout.mutate(undefined, {
                      onSettled: () => {
                        navigate("/");
                      },
                    });
                  }}
                  disabled={logout.isPending}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 font-medium disabled:opacity-60"
                >
                  {logout.isPending ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
