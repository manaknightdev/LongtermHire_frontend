interface TitleDetailProps {
  title: string;
  data: string;
}

export const TitleDetail = ({ title = "", data = "" }: TitleDetailProps) => {
  return (
    <div className={`relative grow`}>
      <span className="mb-2 block w-full cursor-pointer text-[.875rem] font-bold">
        {title}
      </span>
      <div
        className={`flex h-[3rem] w-full items-center rounded-[.625rem] border border-soft-200 bg-gray-200 p-[.625rem] px-3 py-2 font-inter leading-tight text-black shadow focus:outline-none focus:ring-0`}
      >
        {data}
      </div>
    </div>
  );
};

export default TitleDetail;
