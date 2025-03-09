import LandingTabSelector from "./LandingTabSelector";
const info_data = [
  {
    title: "Feature preview example one",
    description: ` Mauris mattis lorem a sagittis sagittis. Nulla at vulputate
    augue. Sed sit amet mi tortor. Praesent lacus lectus, commodo
    vel suscipit sit amet, imperdiet sed leo.`,
    color: "red",
  },
  {
    title: "Feature preview example two",
    description: ` Mauris mattis lorem a sagittis sagittis. Nulla at vulputate
    augue. Sed sit amet mi tortor. Praesent lacus lectus, commodo
    vel suscipit sit amet, imperdiet sed leo.`,
    color: "indigo",
  },
  {
    title: "Feature preview example three",
    description: ` Mauris mattis lorem a sagittis sagittis. Nulla at vulputate
    augue. Sed sit amet mi tortor. Praesent lacus lectus, commodo
    vel suscipit sit amet, imperdiet sed leo.`,
    color: "red",
  },
];
export default function LandingInfo() {
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
      <div className="flex flex-col gap-10">
        {info_data.map((item, idx) => (
          <div className="flex flex-col gap-3 md:flex-row" key={idx}>
            <div className="flex-1">
              <div className={`border-l-2 border-${item.color}-600 pl-3`}>
                <h4>{item.title}</h4>
                <p className="py-4 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="mx-auto flex h-[270px] w-[470px] max-w-full items-center justify-center rounded-[8px] bg-gray-100 p-5 md:h-[350px]">
                <img
                  src="images/feature-preview.png"
                  className="mx-auto h-auto w-[100%]"
                  alt="feature preview"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
