export default function LandingFaq() {
  return (
    <div className=" my-[6rem] md:mx-[6rem]">
      <div className="mx-auto my-8 w-[868px] max-w-full text-center ">
        <p className="text-indigo-500">Quick answers</p>
        <h1 className="bg-gradient-to-r from-[#262626] to-[#525252] bg-clip-text text-3xl leading-tight text-transparent md:text-5xl">
          Frequently asked questions
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div key={index} className="flex gap-4 rounded-[8px] bg-gray-100 p-4">
            <div>
              <svg
                width="22"
                height="22"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14 0.666748C6.63622 0.666748 0.666687 6.63629 0.666687 14.0001C0.666687 21.3639 6.63622 27.3334 14 27.3334C21.3638 27.3334 27.3334 21.3639 27.3334 14.0001C27.3334 6.63629 21.3638 0.666748 14 0.666748ZM12.3334 9.33342C12.1493 9.33342 12 9.48265 12 9.66675V10.3334C12 10.8857 11.5523 11.3334 11 11.3334C10.4477 11.3334 10 10.8857 10 10.3334V9.66675C10 8.37808 11.0447 7.33342 12.3334 7.33342H15.6667C16.9554 7.33342 18 8.37808 18 9.66675V11.2865C18 12.0667 17.6101 12.7952 16.961 13.228L15.1485 14.4363C15.0557 14.4981 15 14.6022 15 14.7137V15.6667C15 16.219 14.5523 16.6667 14 16.6667C13.4477 16.6667 13 16.219 13 15.6667V14.7137C13 13.9335 13.3899 13.205 14.0391 12.7722L15.8516 11.5639C15.9443 11.502 16 11.398 16 11.2865V9.66675C16 9.48265 15.8508 9.33342 15.6667 9.33342H12.3334ZM14 18.0001C13.2636 18.0001 12.6667 18.597 12.6667 19.3334C12.6667 20.0698 13.2636 20.6667 14 20.6667C14.7364 20.6667 15.3334 20.0698 15.3334 19.3334C15.3334 18.597 14.7364 18.0001 14 18.0001Z"
                  fill="url(#paint0_linear_577_579)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_577_579"
                    x1="27.3334"
                    y1="0.666728"
                    x2="0.272937"
                    y2="1.07246"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#525252" />
                    <stop offset="1" stop-color="#262626" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h6 className="mb-3">Question example one?</h6>
              <p className="text-sm text-gray-500">
                Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
                cursus, ex ex ultrices lectus, a ornare neque leo et eros. Donec
                tempus ligula id enim aliquam dignissim. Mauris iaculis diam non
                dapibus pharetra.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto my-10 flex w-[400px] max-w-full flex-col justify-center  text-center">
        <p className="py-3 text-gray-500">
          Still got questions? We're here to help 🤙
        </p>
        <button className="mx-auto flex w-fit items-center justify-center gap-2 rounded-[8px] bg-indigo-600 px-4 py-2 text-white">
          <span>Get in touch </span>
          <div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.225172 1.65211C-0.0682953 0.771708 0.84918 -0.0240148 1.67923 0.391011L15.0342 7.06847C15.8019 7.45235 15.8019 8.54798 15.0342 8.93186L1.67923 15.6093C0.849177 16.0243 -0.0682947 15.2286 0.225172 14.3482L2.13291 8.625H5.70834C6.05352 8.625 6.33334 8.34518 6.33334 8C6.33334 7.65482 6.05352 7.375 5.70834 7.375H2.1328L0.225172 1.65211Z"
                fill="white"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
