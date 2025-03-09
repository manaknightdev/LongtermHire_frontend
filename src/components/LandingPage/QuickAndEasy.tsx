import LandingTabSelector from "./LandingTabSelector";

export default function QuickAndEasy() {
  return (
    <div className="my-[6rem] md:mx-[3rem]">
      <div className="mx-auto my-8 w-[868px] max-w-full text-center ">
        <p className="text-green-500">Tagline</p>
        <h1 className="bg-gradient-to-r from-[#262626] to-[#525252] bg-clip-text text-3xl leading-tight text-transparent md:text-5xl">
          One platform for all your dev needs
        </h1>
        <p className="mx-auto max-w-full py-4 text-gray-500 md:w-[70%] ">
          Nunc scelerisque accumsan ante vestibulum consequat. Quisque justo
          urna, rhoncus in erat ac, lobortis eleifend nulla.
        </p>
        <div className="my-5">
          <LandingTabSelector />
        </div>
      </div>

      <div className="rounded-[8px] bg-gray-100 p-5">
        <h5 className="mb-5">Wireframes - quick and easy</h5>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex gap-5">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.09838 1.48959e-06C2.75509 -2.14376e-05 2.43974 -4.24882e-05 2.17618 0.0214915C1.892 0.0447096 1.5811 0.09786 1.27403 0.254323C0.834982 0.478027 0.478027 0.834982 0.254323 1.27403C0.0978599 1.5811 0.0447096 1.892 0.0214915 2.17618C-4.24907e-05 2.43974 -2.14376e-05 2.75502 1.48958e-06 3.09831V20.9016C-2.14376e-05 21.2449 -4.24882e-05 21.5603 0.0214915 21.8238C0.0447096 22.108 0.0978604 22.4189 0.254323 22.726C0.478027 23.165 0.834982 23.522 1.27403 23.7457C1.5811 23.9022 1.892 23.9553 2.17618 23.9785C2.43975 24.0001 2.75505 24 3.09836 24L8.00001 24V10H6.65532e-06V8H8.00001V1.48959e-06H3.09838Z"
                  fill="#2563EB"
                />
                <path
                  d="M10 1.48959e-06V8H24L24 3.09836C24 2.75505 24.0001 2.43975 23.9785 2.17618C23.9553 1.892 23.9022 1.5811 23.7457 1.27403C23.522 0.834982 23.165 0.478027 22.726 0.254323C22.4189 0.0978599 22.108 0.0447096 21.8238 0.0214915C21.5603 -4.24907e-05 21.245 -2.14376e-05 20.9017 1.48959e-06H10Z"
                  fill="#2563EB"
                />
                <path
                  d="M24 10H10V24L20.9016 24C21.245 24 21.5603 24.0001 21.8238 23.9785C22.108 23.9553 22.4189 23.9022 22.726 23.7457C23.165 23.522 23.522 23.165 23.7457 22.726C23.9022 22.4189 23.9553 22.108 23.9785 21.8238C24.0001 21.5603 24 21.245 24 20.9016L24 10Z"
                  fill="#2563EB"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
              cursus, ex ex ultrices lectus, a ornare neque leo et eros. Donec
              tempus ligula id enim aliquam dignissim. Mauris iaculis diam non
              dapibus pharetra.
            </p>
          </div>
          <div className="flex gap-5">
            <div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.66663 5C7.66663 4.44772 8.11434 4 8.66663 4H23.3333C23.8856 4 24.3333 4.44772 24.3333 5V6.66667H28.3333C28.8856 6.66667 29.3333 7.11438 29.3333 7.66667V24.3333C29.3333 24.8856 28.8856 25.3333 28.3333 25.3333H24.3333V27C24.3333 27.5523 23.8856 28 23.3333 28H8.66663C8.11434 28 7.66663 27.5523 7.66663 27V25.3333H3.66663C3.11434 25.3333 2.66663 24.8856 2.66663 24.3333V7.66667C2.66663 7.11438 3.11434 6.66667 3.66663 6.66667H7.66663V5ZM7.66663 8.66667H4.66663V23.3333H7.66663V8.66667ZM24.3333 23.3333H27.3333V8.66667H24.3333V23.3333Z"
                  fill="#0EA5E9"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Aliquam sed erat lacus. Nam iaculis nulla non elit porttitor, at
              finibus ipsum hendrerit. Aliquam iaculis orci quis arcu
              condimentum egestas.
            </p>
          </div>
          <div className="flex gap-5">
            <div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6.33333C4 5.04467 5.04467 4 6.33333 4H25.6667C26.9553 4 28 5.04467 28 6.33333V25.6667C28 26.9553 26.9553 28 25.6667 28H6.33333C5.04467 28 4 26.9553 4 25.6667V6.33333ZM14.3738 11.2929C14.7643 11.6834 14.7643 12.3166 14.3738 12.7071L11.3166 15.7643C11.1864 15.8945 11.1864 16.1055 11.3166 16.2357L14.3738 19.2929C14.7643 19.6834 14.7643 20.3166 14.3738 20.7071C13.9832 21.0976 13.3501 21.0976 12.9596 20.7071L9.90237 17.6499C8.99115 16.7387 8.99115 15.2613 9.90237 14.3501L12.9596 11.2929C13.3501 10.9024 13.9832 10.9024 14.3738 11.2929ZM19.0404 11.2929C18.6499 10.9024 18.0168 10.9024 17.6262 11.2929C17.2357 11.6834 17.2357 12.3166 17.6262 12.7071L20.6834 15.7643C20.8136 15.8945 20.8136 16.1055 20.6834 16.2357L17.6262 19.2929C17.2357 19.6834 17.2357 20.3166 17.6262 20.7071C18.0168 21.0976 18.6499 21.0976 19.0404 20.7071L22.0976 17.6499C23.0089 16.7387 23.0089 15.2613 22.0976 14.3501L19.0404 11.2929Z"
                  fill="#FBBF24"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Donec sit amet metus elit. Donec sagittis, ligula ac condimentum
              cursus, ex ex ultrices lectus, a ornare neque leo et eros. Donec
              tempus ligula id enim aliquam dignissim. Mauris iaculis diam non
              dapibus pharetra.
            </p>
          </div>
          <div className="flex gap-5">
            <div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.33329 4C5.78101 4 5.33329 4.44772 5.33329 5C5.33329 5.55228 5.78101 6 6.33329 6H25.6666C26.2189 6 26.6666 5.55228 26.6666 5C26.6666 4.44772 26.2189 4 25.6666 4H6.33329Z"
                  fill="#EF4444"
                />
                <path
                  d="M4.99996 8C3.7113 8 2.66663 9.04467 2.66663 10.3333V24.3333C2.66663 25.622 3.7113 26.6667 4.99996 26.6667H27C28.2886 26.6667 29.3333 25.622 29.3333 24.3333V10.3333C29.3333 9.04467 28.2886 8 27 8H4.99996Z"
                  fill="#EF4444"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              In quis ultricies nibh, in suscipit lectus. Donec nec auctor
              sapien. Vivamus porta mauris sed augue pretium, a tristique metus
              ultricies.
            </p>
          </div>
          <div className="flex gap-5">
            <div>
              <svg
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.08019 27.1334C5.26686 27.3201 5.52019 27.4134 5.77352 27.4134C6.04019 27.4134 6.29352 27.3068 6.49352 27.1068L8.72019 24.8268C9.10686 24.4268 9.10686 23.8001 8.70686 23.4134C8.30686 23.0401 7.68019 23.0401 7.29352 23.4401L5.06686 25.7201C4.68019 26.1201 4.68019 26.7468 5.08019 27.1334Z"
                  fill="#14B8A6"
                />
                <path
                  d="M14.6609 27.4134C14.6647 27.4134 14.6669 27.4134 14.6669 27.4134H14.6535L14.6609 27.4134Z"
                  fill="#14B8A6"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.4802 27.4001C14.5268 27.4118 14.6345 27.4132 14.6609 27.4134C14.9115 27.4116 15.1487 27.3184 15.3335 27.1468L19.5735 23.2134C20.0535 22.7734 20.3202 22.1468 20.3202 21.5068V18.6934C26.4535 15.4001 28.9202 10.1201 28.3202 1.68011C28.2935 1.18678 27.8935 0.800115 27.4002 0.760115C18.9602 0.146781 13.6802 2.62678 10.3869 8.74678H7.57352C6.93352 8.74678 6.30686 9.01345 5.86686 9.49345L1.93352 13.7334C1.70686 13.9601 1.61352 14.2801 1.68019 14.6001C1.74686 14.9201 1.94686 15.1868 2.24019 15.3201C2.24019 15.3201 2.24807 15.3239 2.25865 15.329C2.59032 15.4877 7.20032 17.6936 9.29352 19.7868C11.3768 21.883 13.5983 26.5035 13.752 26.8231C13.7566 26.8328 13.7602 26.8401 13.7602 26.8401C13.9069 27.1334 14.1735 27.3334 14.4802 27.4001ZM19.6666 12.0001C21.1394 12.0001 22.3333 10.8062 22.3333 9.33342C22.3333 7.86066 21.1394 6.66675 19.6666 6.66675C18.1939 6.66675 17 7.86066 17 9.33342C17 10.8062 18.1939 12.0001 19.6666 12.0001Z"
                  fill="#14B8A6"
                />
                <path
                  d="M0.640189 25.6134C0.826856 25.8001 1.08019 25.8934 1.33352 25.8934C1.60019 25.8934 1.85352 25.7868 2.05352 25.5868L5.76019 21.7734C6.14686 21.3734 6.14686 20.7468 5.74686 20.3601C5.34686 19.9868 4.72019 19.9868 4.33352 20.3868L0.626855 24.2001C0.240189 24.6001 0.240189 25.2268 0.640189 25.6134Z"
                  fill="#14B8A6"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">
              Quisque vulputate pharetra purus, at semper augue posuere at. Duis
              placerat ac diam quis malesuada. Donec ac dictum eros, in mollis
              libero. Cras odio nisi, consequat bibendum orci ac, ullamcorper
              varius mi.
            </p>
          </div>
          <div className="flex gap-5">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 2.33333C0 1.04467 1.04467 0 2.33333 0H21.6667C22.9553 0 24 1.04467 24 2.33333V21.6667C24 22.9553 22.9553 24 21.6667 24H2.33333C1.04467 24 0 22.9553 0 21.6667V2.33333ZM10.3738 7.29289C10.7643 7.68342 10.7643 8.31658 10.3738 8.70711L7.31658 11.7643C7.18641 11.8945 7.18641 12.1055 7.31658 12.2357L10.3738 15.2929C10.7643 15.6834 10.7643 16.3166 10.3738 16.7071C9.98325 17.0976 9.35008 17.0976 8.95956 16.7071L5.90237 13.6499C4.99115 12.7387 4.99115 11.2613 5.90237 10.3501L8.95956 7.29289C9.35008 6.90237 9.98325 6.90237 10.3738 7.29289ZM15.0404 7.29289C14.6499 6.90237 14.0168 6.90237 13.6262 7.29289C13.2357 7.68342 13.2357 8.31658 13.6262 8.70711L16.6834 11.7643C16.8136 11.8945 16.8136 12.1055 16.6834 12.2357L13.6262 15.2929C13.2357 15.6834 13.2357 16.3166 13.6262 16.7071C14.0168 17.0976 14.6499 17.0976 15.0404 16.7071L18.0976 13.6499C19.0089 12.7387 19.0089 11.2613 18.0976 10.3501L15.0404 7.29289Z"
                  fill="#A855F7"
                />
              </svg>
            </div>
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
