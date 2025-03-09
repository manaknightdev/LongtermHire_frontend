export default function LandingDetailView() {
  return (
    <div className=" my-[6rem] md:mx-[6rem]">
      <div className="mx-auto my-8 w-[868px] max-w-full text-center ">
        <p className="text-orange-500">Features</p>
        <h1 className="bg-gradient-to-r from-[#262626] to-[#525252] bg-clip-text text-3xl leading-tight text-transparent md:text-5xl">
          Detailed view on key features
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <div
            className="bg- h-[300px] w-[600px] max-w-full rounded-[8px] bg-gray-100"
            style={{
              backgroundImage: "url(/images/Wireframes-API-1.png)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <svg
                width="22"
                height="25"
                viewBox="0 0 25 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.82305 9.06971C1.31554 9.06971 0.884947 9.23795 0.530989 9.57443C0.177032 9.91091 0 10.3147 0 10.7859V18.0215C0 18.5045 0.176979 18.9135 0.530989 19.25C0.884947 19.5865 1.31554 19.7548 1.82305 19.7548C2.33017 19.7548 2.75816 19.5865 3.10663 19.25C3.45441 18.9135 3.62878 18.5045 3.62878 18.0215V10.7859C3.62878 10.3146 3.4518 9.91091 3.09779 9.57443C2.74378 9.23795 2.31878 9.06971 1.82305 9.06971Z"
                  fill="#262626"
                />
                <path
                  d="M16.4805 2.57431L17.7373 0.370338C17.8198 0.224426 17.7905 0.112536 17.649 0.0338593C17.4955 -0.0339831 17.3775 0.000393786 17.2951 0.13456L16.0207 2.35615C14.8993 1.88484 13.7133 1.64876 12.4626 1.64876C11.2117 1.64876 10.0256 1.88489 8.90464 2.35615L7.63021 0.13456C7.54739 0.000393786 7.42942 -0.0336793 7.27625 0.0338593C7.13448 0.112891 7.10513 0.224426 7.18795 0.370338L8.4448 2.57431C7.17037 3.19213 6.15537 4.05256 5.40016 5.15748C4.64495 6.26301 4.26719 7.47111 4.26719 8.78391H20.6403C20.6403 7.47142 20.2625 6.26326 19.5073 5.15748C18.7521 4.05256 17.7429 3.19213 16.4805 2.57431ZM9.21428 5.78001C9.07837 5.90952 8.91603 5.97397 8.72734 5.97397C8.53827 5.97397 8.37924 5.90952 8.2495 5.78001C8.11976 5.65111 8.05489 5.4974 8.05489 5.31742C8.05489 5.13804 8.11976 4.98403 8.2495 4.85482C8.37924 4.72592 8.53864 4.66147 8.72734 4.66147C8.91603 4.66147 9.07837 4.72592 9.21428 4.85482C9.34988 4.98433 9.418 5.13804 9.418 5.31742C9.41762 5.4971 9.34956 5.65111 9.21428 5.78001ZM16.6751 5.78001C16.5451 5.90952 16.3857 5.97397 16.1973 5.97397C16.0082 5.97397 15.8459 5.90952 15.7102 5.78001C15.5744 5.65111 15.5066 5.4974 15.5066 5.31742C15.5066 5.13804 15.5744 4.98403 15.7102 4.85482C15.8459 4.72592 16.0082 4.66147 16.1973 4.66147C16.386 4.66147 16.545 4.72592 16.6751 4.85482C16.8049 4.98433 16.8697 5.13804 16.8697 5.31742C16.8697 5.4971 16.8049 5.65111 16.6751 5.78001Z"
                  fill="#262626"
                />
                <path
                  d="M4.33622 20.5954C4.33622 21.1119 4.52492 21.5492 4.90236 21.908C5.28013 22.2668 5.74007 22.4461 6.28304 22.4461H7.59299L7.61094 26.2663C7.61094 26.7487 7.78792 27.1583 8.14188 27.4949C8.49583 27.8314 8.92089 27.9996 9.4163 27.9996C9.92349 27.9996 10.3543 27.8314 10.7084 27.4949C11.0624 27.1583 11.2393 26.7487 11.2393 26.2663V22.4465H13.682V26.2663C13.682 26.7487 13.8589 27.1583 14.2129 27.4949C14.567 27.8314 14.9974 27.9996 15.505 27.9996C16.0122 27.9996 16.443 27.8314 16.7971 27.4949C17.1511 27.1583 17.328 26.7487 17.328 26.2663V22.4465H18.6556C19.1866 22.4465 19.6406 22.2671 20.0187 21.9083C20.3961 21.5495 20.5849 21.1122 20.5849 20.5958V9.38853H4.33622V20.5954Z"
                  fill="#262626"
                />
                <path
                  d="M23.0998 9.06971C22.6041 9.06971 22.1794 9.23547 21.8254 9.56607C21.4714 9.89729 21.2944 10.3041 21.2944 10.7859V18.0215C21.2944 18.5045 21.4714 18.9135 21.8254 19.25C22.1794 19.5865 22.6044 19.7548 23.0998 19.7548C23.607 19.7548 24.0379 19.5865 24.3919 19.25C24.7459 18.9135 24.9228 18.5045 24.9228 18.0215V10.7859C24.9228 10.3041 24.7459 9.89729 24.3919 9.56607C24.0379 9.23547 23.607 9.06971 23.0998 9.06971Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <h5>Feature name</h5>
            <p className="text-sm text-gray-500">
              Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
              cursus, ex ex ultrices lectus, a ornare neque leo et eros. Donec
              tempus ligula id enim aliquam dignissim. Mauris iaculis diam non
              dapibus pharetra.
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div
            className="h-[300px] w-full rounded-[8px] bg-gray-100"
            style={{
              backgroundImage: "url(/images/Wireframes-API-1.png)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <svg
                width="22"
                height="25"
                viewBox="0 0 25 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.9637 0C16.4051 0.102569 14.5835 1.05177 13.5219 2.28781C12.5536 3.40911 11.7569 5.07456 12.0675 6.69306C13.7704 6.74348 15.5299 5.77168 16.5495 4.51477C17.5032 3.34479 18.2249 1.68978 17.9637 0Z"
                  fill="#262626"
                />
                <path
                  d="M24.1247 9.51663C22.6283 7.73123 20.5252 6.6951 18.5392 6.6951C15.9172 6.6951 14.8082 7.88943 12.9865 7.88943C11.1082 7.88943 9.68125 6.69858 7.41379 6.69858C5.18652 6.69858 2.81491 7.99373 1.31119 10.2085C-0.802793 13.3273 -0.441023 19.1912 2.98484 24.1858C4.21084 25.9729 5.84794 27.9826 7.98933 27.9999C9.89502 28.0173 10.4322 26.8369 13.0139 26.8247C15.5957 26.8108 16.0853 28.0156 17.9874 27.9965C20.1306 27.9808 21.8572 25.7538 23.0832 23.9667C23.9621 22.6855 24.2891 22.0405 24.9706 20.5941C20.0136 18.7983 19.2188 12.0913 24.1247 9.51663Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <h5>Feature name</h5>
            <p className="text-sm text-gray-500">
              Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
              cursus, ex ex ultrices lectus, a ornare neque leo et eros.
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div
            className="bg- h-[300px] w-full max-w-full rounded-[8px] bg-gray-100"
            style={{
              backgroundImage: "url(/images/Wireframes-API-1.png)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <svg
                width="22"
                height="24"
                viewBox="0 0 28 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.99996 0C1.71129 0 0.666626 1.04467 0.666626 2.33333V12.6667H27.3333V2.33333C27.3333 1.04467 26.2886 0 25 0H2.99996Z"
                  fill="#262626"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.666626 17.6667V14.6667H27.3333V17.6667C27.3333 18.9553 26.2886 20 25 20H18V24.3333C18 24.8856 17.5522 25.3333 17 25.3333H11C10.4477 25.3333 9.99996 24.8856 9.99996 24.3333V20H2.99996C1.7113 20 0.666626 18.9553 0.666626 17.6667ZM12 20V23.3333H16V20H12Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <h5>Feature name</h5>
            <p className="text-sm text-gray-500">
              Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
              cursus, ex ex ultrices lectus, a ornare neque leo et eros. Donec
              tempus ligula id enim aliquam dignissim. Mauris iaculis diam non
              dapibus pharetra.
            </p>
          </div>
        </div>
        <div className="md:col-span-3">
          <div
            className="bg- h-[300px] w-[600px] max-w-full rounded-[8px] bg-gray-100"
            style={{
              backgroundImage: "url(/images/Wireframes-API-2.png)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <svg
                width="22"
                height="24"
                viewBox="0 0 28 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.99996 0C1.71129 0 0.666626 1.04467 0.666626 2.33333V12.6667H27.3333V2.33333C27.3333 1.04467 26.2886 0 25 0H2.99996Z"
                  fill="#262626"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.666626 17.6667V14.6667H27.3333V17.6667C27.3333 18.9553 26.2886 20 25 20H18V24.3333C18 24.8856 17.5522 25.3333 17 25.3333H11C10.4477 25.3333 9.99996 24.8856 9.99996 24.3333V20H2.99996C1.7113 20 0.666626 18.9553 0.666626 17.6667ZM12 20V23.3333H16V20H12Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <h5>Feature name</h5>
            <p className="text-sm text-gray-500">
              Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
              cursus, ex ex ultrices lectus, a ornare neque leo et eros. Donec
              tempus ligula id enim aliquam dignissim. Mauris iaculis diam non
              dapibus pharetra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
