import { Link } from "react-router-dom";
import { useState } from "react";
import { BrandLogo } from "@/assets/images";

export default function Navbar({}) {
  const [isOpen, setOpen] = useState(false);

  const handleNavToggle = () => {
    setOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 z-10 mx-auto w-full bg-[rgb(255,255,255,0.6)] px-0 py-3 backdrop-blur-sm md:px-8">
      <div className="m-0 w-full">
        <div className="">
          <div className="mx-auto px-5 md:container md:px-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Link
                  to="/"
                  className={`h-14 min-h-14 max-h-14 flex gap-5 items-center `}
                >
                  <img className={"h-[70%] object-contain "} src={BrandLogo} />
                  <h4 className="cursor-pointer font-bold">MTP - Builder</h4>
                </Link>
              </div>

              <div className="mx-auto hidden flex-1 sm:items-center md:flex">
                <a
                  href="#"
                  className="mr-4 text-sm  text-gray-800 hover:text-indigo-600"
                >
                  About
                </a>
                <a
                  href="#"
                  className="mr-4 text-sm  text-gray-800 hover:text-indigo-600"
                >
                  How it works
                </a>
                <a
                  href="#"
                  className="mr-4 text-sm  text-gray-800 hover:text-indigo-600"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="mr-4 text-sm  text-gray-800 hover:text-indigo-600"
                >
                  FAQs
                </a>
                <a
                  href="#"
                  className="text-sm  text-gray-800 hover:text-indigo-600"
                >
                  Pricing
                </a>
              </div>

              <div className="ml-auto flex justify-end gap-2 md:hidden">
                <button className="rounded-[6px] bg-indigo-600 px-[14px] py-[7px] text-xs text-white shadow-sm">
                  Start FREE Trial 🚀
                </button>
                <button
                  onClick={handleNavToggle}
                  className="rounded-[6px] bg-gray-100 px-[10px] py-[10px] shadow-sm"
                >
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.33325 1H14.6666M1.33325 6H14.6666M1.33325 11H14.6666"
                      stroke="#A8A8A8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="hidden flex-1 justify-center gap-3 md:flex">
                <button className="rounded-[6px] bg-indigo-600 px-[14px] py-[7px] text-xs text-white shadow-sm">
                  Start FREE Trial 🚀
                </button>
                <Link
                  to={"/admin/login"}
                  className="flex items-center gap-2 rounded-[6px] border border-gray-300 bg-transparent px-[14px] py-[7px] text-xs text-gray-700 shadow-sm"
                >
                  <span>Sign in</span>
                </Link>
              </div>
            </div>{" "}
            {isOpen && (
              <div className="mt mx-auto mt-4 flex flex-1 flex-col gap-4 sm:items-center md:hidden">
                <a
                  href="#"
                  className="mr-4 text-base  text-gray-800 hover:text-indigo-600"
                >
                  About
                </a>
                <a
                  href="#"
                  className="mr-4 text-base  text-gray-800 hover:text-indigo-600"
                >
                  How it works
                </a>
                <a
                  href="#"
                  className="mr-4 text-base  text-gray-800 hover:text-indigo-600"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="mr-4 text-base  text-gray-800 hover:text-indigo-600"
                >
                  FAQs
                </a>
                <a
                  href="#"
                  className="text-base  text-gray-800 hover:text-indigo-600"
                >
                  Pricing
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
