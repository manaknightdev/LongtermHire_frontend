import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
    value: "wireframe"
  }
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

export const AdminHeader = () => {
  const {
    globalState: { isOpen, path },
    authDispatch
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
          <Menu.Button className="flex w-full items-center justify-center gap-[.3125rem]">
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

// <div className="mr-3 cursor-pointer rounded-lg border border-[#E0E0E0] bg-white p-2 text-2xl text-gray-400">
//   <span onClick={() => toggleOpen(!isOpen)}>
//     <svg
//       className={`transition-transform ${!isOpen ? "rotate-180" : ""}`}
//       xmlns="http:www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//     >
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM10.4142 11L11.7071 9.70711C12.0976 9.31658 12.0976 8.68342 11.7071 8.29289C11.3166 7.90237 10.6834 7.90237 10.2929 8.29289L7.82322 10.7626C7.13981 11.446 7.13981 12.554 7.82322 13.2374L10.2929 15.7071C10.6834 16.0976 11.3166 16.0976 11.7071 15.7071C12.0976 15.3166 12.0976 14.6834 11.7071 14.2929L10.4142 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H10.4142Z"
//         fill="#A8A8A8"
//       />
//     </svg>
//   </span>
// </div>
export default AdminHeader;

// <div className="flex items-center gap-3 pr-2">
//   <div>
//     <button title="Profile" className="peer">
//       {profile?.photo?.length ? (
//         <img
//           className="h-[40px] w-[40px] rounded-lg object-cover"
//           src={profile?.photo}
//           alt={`${profile?.first_name} ${profile?.last_name}`}
//         />
//       ) : (
//         <div className="mt-1 h-[2.5rem] w-[2.5rem] rounded-lg bg-gray-400 shadow-md"></div>
//       )}
//     </button>
//     <ul className="absolute right-5 top-[80%] z-20 hidden rounded-lg border border-[#a8a8a8] bg-white p-2 text-sm text-[#525252] shadow-md hover:block focus:block peer-focus:block peer-focus-visible:block">
//       <li>
//         <Link
//           className="hover:text[#262626] flex cursor-pointer items-center rounded-md px-4 py-3 hover:bg-[#F4F4F4]"
//           to={`/admin/profile`}
//         >
//           <span className="mr-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="20"
//               viewBox="0 0 20 20"
//               fill="none"
//             >
//               <path
//                 d="M13.3333 5.41666C13.3333 7.25761 11.8409 8.74999 9.99997 8.74999C8.15902 8.74999 6.66664 7.25761 6.66664 5.41666C6.66664 3.57571 8.15902 2.08332 9.99997 2.08332C11.8409 2.08332 13.3333 3.57571 13.3333 5.41666Z"
//                 fill="#A8A8A8"
//               />
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M9.99997 2.49999C8.38914 2.49999 7.08331 3.80583 7.08331 5.41666C7.08331 7.02749 8.38914 8.33332 9.99997 8.33332C11.6108 8.33332 12.9166 7.02749 12.9166 5.41666C12.9166 3.80583 11.6108 2.49999 9.99997 2.49999ZM6.24997 5.41666C6.24997 3.34559 7.9289 1.66666 9.99997 1.66666C12.071 1.66666 13.75 3.34559 13.75 5.41666C13.75 7.48772 12.071 9.16666 9.99997 9.16666C7.9289 9.16666 6.24997 7.48772 6.24997 5.41666Z"
//                 fill="#A8A8A8"
//               />
//               <path
//                 d="M9.99997 10.4167C6.27535 10.4167 3.66126 13.3457 3.33331 17.0833H16.6666C16.3387 13.3457 13.7246 10.4167 9.99997 10.4167Z"
//                 fill="#A8A8A8"
//               />
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M3.80032 16.6667H16.1996C15.725 13.323 13.3164 10.8333 9.99997 10.8333C6.68352 10.8333 4.27494 13.323 3.80032 16.6667ZM2.91823 17.0469C3.26095 13.1409 6.01533 9.99999 9.99997 9.99999C13.9846 9.99999 16.739 13.1409 17.0817 17.0469L17.1215 17.5H2.87848L2.91823 17.0469Z"
//                 fill="#A8A8A8"
//               />
//             </svg>
//           </span>
//           <span>Account</span>
//         </Link>
//       </li>
//       <li>
//         <Link
//           className="hover:text[#262626] group flex cursor-pointer items-center rounded-md px-4 py-3 hover:bg-[#F4F4F4] hover:text-red-500"
//           to={`/admin/login`}
//           onClick={() =>
//             dispatch({
//               type: "LOGOUT"
//             })
//           }
//         >
//           <span className="mr-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="20"
//               viewBox="0 0 20 20"
//               fill="none"
//             >
//               <path
//                 className="group-hover:fill-[#ef4444] group-hover:stroke-[#ef4444]"
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M3.75 3.33333C3.51988 3.33333 3.33333 3.51988 3.33333 3.75L3.33333 16.25C3.33333 16.4801 3.51988 16.6667 3.75 16.6667H9.58333C9.81345 16.6667 10 16.8532 10 17.0833C10 17.3135 9.81345 17.5 9.58333 17.5H3.75C3.05964 17.5 2.5 16.9404 2.5 16.25L2.5 3.75C2.5 3.05964 3.05964 2.5 3.75 2.5L9.58333 2.5C9.81345 2.5 10 2.68655 10 2.91667C10 3.14679 9.81345 3.33333 9.58333 3.33333L3.75 3.33333ZM13.0387 5.95537C13.2014 5.79265 13.4652 5.79265 13.628 5.95537L17.378 9.70536C17.5407 9.86808 17.5407 10.1319 17.378 10.2946L13.628 14.0446C13.4652 14.2073 13.2014 14.2073 13.0387 14.0446C12.876 13.8819 12.876 13.6181 13.0387 13.4554L16.0774 10.4167L7.91667 10.4167C7.68655 10.4167 7.5 10.2301 7.5 9.99999C7.5 9.76987 7.68655 9.58332 7.91667 9.58332L16.0774 9.58332L13.0387 6.54463C12.876 6.38191 12.876 6.11809 13.0387 5.95537Z"
//                 fill="#A8A8A8"
//                 stroke="#A8A8A8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </span>
//           <span>Logout</span>
//         </Link>
//       </li>
//     </ul>
//   </div>
// </div>
