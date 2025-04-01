import { StringCaser } from "@/utils/utils";

interface TabProps {
  tab: string;
  setView: (view: string) => void;
  view: string;
  viewsMap: any;
  tabClassName?: string;
}
const Tab = ({ tab, setView, view, viewsMap, tabClassName }: TabProps) => {
  const { Capitalize } = new StringCaser();

  return (
    <div
      onClick={() => setView(tab)}
      className={`flex h-full w-fit min-w-[6.8125rem] cursor-pointer items-center justify-center gap-1 border-b-2 py-2 ${tabClassName} ${
        view === viewsMap[tab]?.value ? "border-black text-black" : ""
      }`}
    >
      {Capitalize(tab, { separator: " " })}
      {viewsMap[tab]?.hasCount ? (
        <div
          className={`flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full font-inter text-[.75rem] font-[600] leading-[1rem] ${
            view === viewsMap[tab]?.value
              ? "bg-black text-white"
              : "bg-weak-100 text-sub-500"
          }`}
        >
          {viewsMap[tab]?.count}
        </div>
      ) : null}
    </div>
  );
};

export default Tab;
