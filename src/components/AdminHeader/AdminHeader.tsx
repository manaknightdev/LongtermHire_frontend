import { NavLink, useNavigate } from "react-router-dom";
import { WireframeIcon } from "@/assets/svgs/adminHeader";
import { useContexts } from "@/hooks/useContexts";
import { useProfile } from "@/hooks/useProfile";
import { Menu } from "@headlessui/react";
import { LazyLoad } from "@/components/LazyLoad";
import { HeaderLogo } from "@/components/HeaderLogo";
import { BiExpandVertical } from "react-icons/bi";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface INavItem {
  to: string;
  text: string;
  icon: any;
  value: string;
}

const NAV_ITEMS: INavItem[] = [
  {
    to: "/admin/build",
    text: "Build",
    icon: <WireframeIcon />,
    value: "wireframe",
  },
];

const AdminHeader = () => {
  const {
    globalState: { isOpen, path },
    authDispatch,
  } = useContexts();

  const navigate = useNavigate();
  const { profile } = useProfile();
  const { state } = useTheme();
  const mode = state?.theme;

  const sidebarStyles = {
    backgroundColor: isOpen
      ? THEME_COLORS[mode].BACKGROUND_SECONDARY
      : THEME_COLORS[mode].BACKGROUND_DARK,
    borderColor: THEME_COLORS[mode].BORDER,
    color: isOpen
      ? THEME_COLORS[mode].TEXT_SECONDARY
      : THEME_COLORS[mode].TEXT_ON_DARK,
  };

  const activeNavStyles = {
    backgroundColor: THEME_COLORS[mode].PRIMARY,
    color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
  };

  return (
    <div
      className={`min-h-full max-h-full h-full z-50 grid grid-rows-[auto_1fr_auto] border pb-4 transition-all duration-200 ${
        isOpen
          ? "fixed w-[15rem] min-w-[15rem] max-w-[15rem] md:relative"
          : "relative w-[4.2rem] min-w-[4.2rem] max-w-[4.2rem]"
      }`}
      style={sidebarStyles}
    >
      <HeaderLogo />

      <div className="h-full min-full max-full overflow-auto w-auto  py-2">
        <div className="sidebar-list w-auto">
          <ul className="flex flex-wrap px-2 text-sm">
            {NAV_ITEMS.map((item: INavItem) => (
              <li className="block w-full list-none" key={item.value}>
                <NavLink
                  aria-label={item?.to}
                  to={item.to}
                  id={item.to}
                  className="p-[0.75rem] rounded-[0.375rem] transition-all duration-200 hover:opacity-80"
                  style={path === item.value ? activeNavStyles : {}}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {isOpen && <span>{item.text}</span>}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full max-w-full min-w-full justify-end">
        <Menu
          as={"div"}
          className={"relative z-[9999999] w-full space-y-3 px-2 text-text"}
        >
          <Menu.Button
            arial-label="menu-toggle-btn"
            type="button"
            name="menu-toggle-btn"
            id="menu-toggle-btn"
            className="flex w-full items-center justify-center gap-[.3125rem]"
          >
            {profile?.photo ? (
              <img
                className={`${
                  isOpen ? "h-10 w-10" : "h-5 w-5 xl:h-6 xl:w-6"
                } rounded-[50%] object-cover`}
                src={profile?.photo ?? "/default.png"}
                alt=""
              />
            ) : (
              <div
                className="min-h-[2.5rem] min-w-[2.5rem] rounded-lg shadow-md transition-colors duration-200"
                style={{ backgroundColor: THEME_COLORS[mode].BACKGROUND_HOVER }}
              ></div>
            )}
            {isOpen ? (
              <>
                <div
                  className="text-left transition-colors duration-200"
                  style={{ color: THEME_COLORS[mode].TEXT }}
                >
                  <p className="w-32 text-sm font-medium truncate">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="w-[9.375rem] truncate text-xs">
                    {profile?.email}
                  </p>
                </div>
                <BiExpandVertical
                  className="min-h-5 min-w-5 transition-colors duration-200"
                  style={{ color: THEME_COLORS[mode].TEXT }}
                />
              </>
            ) : null}
          </Menu.Button>
          <Menu.Items
            className={`absolute ${
              isOpen
                ? "-bottom-1 -right-full md:-right-[170px]"
                : "-bottom-1 -right-[170px]"
            } mb-8 w-[160px] origin-top-right divide-y rounded-md border font-bold shadow-lg ring-1 ring-opacity-5 focus:outline-none transition-colors duration-200`}
            style={{
              backgroundColor: THEME_COLORS[mode].BACKGROUND,
              borderColor: THEME_COLORS[mode].BORDER,
              color: THEME_COLORS[mode].TEXT,
            }}
          >
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    arial-label="profile-btn"
                    name="profile-btn"
                    id="profile-btn"
                    className="group flex w-full items-center px-3 py-3 text-sm border-b transition-all duration-200 hover:opacity-80"
                    style={{
                      borderBottomColor: active
                        ? `${THEME_COLORS[mode].BORDER}80`
                        : "transparent",
                      color: THEME_COLORS[mode].TEXT,
                    }}
                    onClick={() => {
                      navigate("/admin/profile");
                    }}
                  >
                    <LazyLoad>
                      {/* <AccountIcon className="mr-2 w-5 h-5" /> */}
                      Account
                    </LazyLoad>
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    arial-label="logout-btn"
                    name="logout-btn"
                    id="logout-btn"
                    className="group flex w-full items-center px-3 py-3 text-sm border-b transition-all duration-200 hover:opacity-80"
                    style={{
                      borderBottomColor: active
                        ? `${THEME_COLORS[mode].BORDER}80`
                        : "transparent",
                      color: "#CE0000", // Keep logout button red
                    }}
                    onClick={() => {
                      authDispatch({ type: "LOGOUT" });
                      navigate(`/admin/login`);
                    }}
                  >
                    <LazyLoad>
                      {/* <LogoutIcon className="mr-2 w-5 h-5" /> */}
                      {/* <ArrowUpTrayIcon className="mr-2 h-5 w-5 rotate-90 text-[#CE0000]" /> */}
                      Logout
                    </LazyLoad>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default AdminHeader;
