import LandingTabSelector from "./LandingTabSelector";

export default function MainHero() {
  return (
    <>
      <div className="my-[6rem]">
        <div className="mx-auto w-[668px] max-w-full text-center ">
          <div className="mx-auto w-fit rounded-[50px] bg-gradient-to-r from-[#262626] to-[#525252] px-3 py-1 text-xs text-gray-100">
            <p>One stop shop for your dev house</p>
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-[#262626] to-[#525252] bg-clip-text leading-tight text-transparent sm:text-lg md:text-5xl">
              AI-driven, one stop shop for your dev house
            </h2>
            <p className="mt-3 text-gray-600">
              Speed up your process by creating{" "}
              <strong className="text-gray-900">wireframes</strong> and
              <strong className="text-gray-900">
                {" "}
                working prototypes, code exports
              </strong>{" "}
              and <strong className="text-gray-900">APIs</strong> built by AI -
              all in one platform
            </p>
          </div>
          <div className="mt-5 flex justify-center  gap-3">
            <button className="rounded-[6px] bg-indigo-600 px-[14px] py-[7px] text-xs text-white shadow-sm">
              Start FREE Trial 🚀
            </button>
            <button className="flex items-center gap-2 rounded-[6px] border border-gray-300 bg-transparent px-[14px] py-[7px] text-xs text-gray-700 shadow-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.38082 1.89899C5.40893 1.30996 4.16663 2.0097 4.16663 3.14615V16.8539C4.16663 17.9903 5.40893 18.69 6.38082 18.101L17.6897 11.2472C18.6263 10.6795 18.6263 9.3205 17.6897 8.75284L6.38082 1.89899Z"
                  fill="#8D8D8D"
                />
              </svg>{" "}
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
        <div className="my-10">
          <div className="mb-5">
            <LandingTabSelector />
          </div>
          <div className="m mx-auto w-[868px] max-w-full">
            <img
              src="/images/dashboard-wireframe.png"
              alt="dashboard-wireframe"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
