import { NavLink, useNavigate } from "react-router-dom";
import { WireframeIcon } from "@/assets/svgs/adminHeader";
import { useContexts } from "@/hooks/useContexts";
import { useProfile } from "@/hooks/useProfile";
import { Menu } from "@headlessui/react";
import { LazyLoad } from "@/components/LazyLoad";
import { HeaderLogo } from "@/components/HeaderLogo";
import { BiExpandVertical } from "react-icons/bi";

const NAV_ITEMS = [
  // {
  //   to: "/admin/requirements",
  //   text: "Requirements",
  //   icon: <SowIcon />,
  //   value: "sow",
  // },
  {
    to: "/admin/build",
    text: "Build",
    icon: <WireframeIcon />,
    value: "wireframe",
  },
  // {
  //   to: "/admin/baas",
  //   text: (
  //     <>
  //       Baas<sup className="text-xs text-[#A8A8A8]">&#40;deprecated&#41;</sup>
  //     </>
  //   ),
  //   icon: <ProjectIcon />,
  //   value: "baas",
  // },
  // {
  //   to: "/admin/generate-ui/button",
  //   text: "Generate UI",
  //   icon: <RiAiGenerate className="text-xl text-[#A8A8A8]" />,
  //   value: "generate-ui",
  // },
  // {
  //   to: "/admin/generate-query/project_name",
  //   text: "Generate Query",
  //   icon: <TbDatabaseEdit className="text-xl text-[#A8A8A8]" />,
  //   value: "generate-query",
  // },
  // {
  //   to: "/admin/users",
  //   text: "Users",
  //   icon: <PiUsersThreeFill className="text-xl text-[#A8A8A8]" />,
  //   value: "users",
  // },
];

const AdminHeader = () => {
  const {
    globalState: { isOpen, path },
    authDispatch,
  } = useContexts();

  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div
      className={`min-h-full max-h-full h-full z-50 grid grid-rows-[auto_1fr_auto] border border-[#E0E0E0] bg-white pb-4 text-[#A8A8A8] transition-all ${
        isOpen
          ? "fixed w-[15rem] min-w-[15rem] max-w-[15rem] md:relative"
          : "relative w-[4.2rem] min-w-[4.2rem] max-w-[4.2rem] bg-black text-white"
      }`}
    >
      <HeaderLogo />

      <div className="h-full min-full max-full overflow-auto w-auto  py-2">
        <div className="sidebar-list w-auto">
          <ul className="flex flex-wrap px-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li className="block w-full list-none" key={item.value}>
                <NavLink
                  aria-label={item?.to}
                  to={item.to}
                  className={`${
                    path == item.value
                      ? "active-nav"
                      : item.value === "baas" &&
                          (path === "project" || path === "deployment")
                        ? "active-nav"
                        : ""
                  }`}
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
          className={
            "relative z-[9999999] w-full space-y-3 px-2 text-[#262626]"
          }
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
              <div className="min-h-[2.5rem] min-w-[2.5rem] rounded-lg bg-gray-400 shadow-md"></div>
            )}
            {isOpen ? (
              <>
                <div className="text-left text-black">
                  <p className="w-32 text-sm font-medium truncate">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="w-[9.375rem] truncate text-xs">
                    {profile?.email}
                  </p>
                </div>
                <BiExpandVertical className=" min-h-5 min-w-5 text-black" />
              </>
            ) : null}
          </Menu.Button>
          <Menu.Items
            className={`absolute ${
              isOpen
                ? "-bottom-1 -right-full md:-right-[170px]"
                : "-bottom-1 -right-[170px]"
            }  mb-8 w-[160px] origin-top-right divide-y divide-gray-100 rounded-md border border-[#1f1d1a] bg-white font-bold text-[#1f1d1a] shadow-lg ring-1 ring-[#1f1d1a] ring-opacity-5 focus:outline-none`}
          >
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    arial-label="profile-btn"
                    name="profile-btn"
                    id="profile-btn"
                    className={`group flex w-full items-center px-3 py-3 text-sm ${
                      active
                        ? "border-b border-b-black/20"
                        : "border-b border-b-transparent"
                    }`}
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
                    className={`group flex w-full items-center px-3 py-3 text-sm text-[#CE0000] ${
                      active
                        ? "border-b border-b-black/20"
                        : "border-b border-b-transparent"
                    }`}
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
