export default function LandingFeature() {
  return (
    <>
      <div className=" my-[6rem] md:mx-[6rem]">
        <div className="mx-auto my-8 w-[868px] max-w-full text-center ">
          <p className="text-orange-500">Tagline</p>
          <h1 className="bg-gradient-to-r from-[#262626] to-[#525252] bg-clip-text text-3xl leading-tight text-transparent md:text-5xl">
            One platform for all your dev needs
          </h1>
          <p className="mx-auto max-w-full py-4 text-sm text-gray-500 md:w-[70%]">
            Nunc scelerisque accumsan ante vestibulum consequat. Quisque justo
            urna, rhoncus in erat ac, lobortis eleifend nulla.
          </p>
        </div>
        <div>
          <div className="gap-15 flex flex-col items-center justify-items-center md:flex-row">
            <div className="flex-1 xs:mb-5 sm:mb-5">
              <div>
                <div className="cursor-pointer border-l-[3px] border-indigo-500 py-2 pl-5 pr-5">
                  <h5>Feature preview example one</h5>

                  <p className="py-2 text-xs  text-gray-500">
                    Mauris mattis lorem a sagittis sagittis. Nulla at vulputate
                    augue. Sed sit amet mi tortor. Praesent lacus lectus,
                    commodo vel suscipit sit amet, imperdiet sed leo.
                  </p>
                </div>
                <div className="cursor-pointer border-l border-gray-300 py-2 pl-5 pr-5">
                  <h5>Feature preview example one</h5>

                  <p className="py-2 text-xs  text-gray-500">
                    Mauris mattis lorem a sagittis sagittis. Nulla at vulputate
                    augue. Sed sit amet mi tortor. Praesent lacus lectus,
                    commodo vel suscipit sit amet, imperdiet sed leo.
                  </p>
                </div>
                <div className="cursor-pointer border-l border-gray-300 py-2 pl-5 pr-5">
                  <h5>Feature preview example one</h5>
                  <p className="py-2 text-xs  text-gray-500">
                    Mauris mattis lorem a sagittis sagittis. Nulla at vulputate
                    augue. Sed sit amet mi tortor. Praesent lacus lectus,
                    commodo vel suscipit sit amet, imperdiet sed leo.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="mx-auto flex h-[360px] max-w-full items-center justify-center bg-gray-100 md:w-[400px]">
                <img
                  src="/images/baas-features-drawer.png"
                  alt="Baas Feature wireframe"
                  className="mx-auto w-[70%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
