import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "./services/authApi";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const menuItems = [
    {
      path: "/",
      name: "Dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      path: "/client-management",
      name: "Client Management",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      path: "/equipment-management",
      name: "Equipment Management",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      path: "/pricing-management",
      name: "Pricing Editor",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      path: "/content-management",
      name: "Content Management",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
    },
    {
      path: "/chat",
      name: "Chat",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#1F1F20] text-[#FDCE06] rounded-md border border-[#333333]"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        bg-[#1F1F20] fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-in-out
        w-64 lg:w-64
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Logo section */}
        <div className="flex items-center justify-center border-b border-[#333333] h-20 px-4">
          <img
            src="/login-logo.png"
            alt="Equipment Rental Logo"
            className="h-[140px] "
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                ${
                  isActive(item.path)
                    ? "bg-[#FDCE06] text-[#1F1F20] font-medium"
                    : "text-[#9CA3AF] hover:text-[#E5E5E5] hover:bg-[#292A2B]"
                }
              `}
            >
              <span
                className={`
                mr-3 transition-colors duration-200
                ${
                  isActive(item.path)
                    ? "text-[#1F1F20]"
                    : "text-[#9CA3AF] group-hover:text-[#E5E5E5]"
                }
              `}
              >
                {item.icon}
              </span>
              <span className="text-sm lg:text-base font-medium">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Profile section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#333333]">
          <div className="flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center flex-1 px-3 py-2 rounded-lg transition-all duration-200
                ${
                  isActive("/profile")
                    ? "bg-[#292A2B] text-[#E5E5E5]"
                    : "text-[#9CA3AF] hover:text-[#E5E5E5] hover:bg-[#292A2B]"
                }
              `}
            >
              <div className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center mr-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Profile</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 ml-2 text-[#9CA3AF] hover:text-[#E5E5E5] hover:bg-[#333333] rounded-md transition-colors"
              title="Logout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
