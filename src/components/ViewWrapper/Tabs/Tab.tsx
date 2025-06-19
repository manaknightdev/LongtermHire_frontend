import { StringCaser } from "@/utils/utils";

interface TabProps {
  tab: string;
  setView: (view: string) => void;
  view: string;
  viewsMap: any;
  tabClassName?: string;
}
const Tab = ({ tab, setView, view, viewsMap, tabClassName }: TabProps) => {
  const stringCaser = new StringCaser();

  return (
    <div
      onClick={() => setView(tab)}
      className={`flex h-full w-fit min-w-[6.8125rem] cursor-pointer items-center justify-center gap-1 border-b-2 py-2 transition-colors duration-200 hover:text-text-hover ${tabClassName} ${
        view === viewsMap[tab]?.value
          ? "border-primary text-primary"
          : "border-transparent text-secondary"
      }`}
    >
      {stringCaser.Capitalize(tab, { separator: " " })}
      {viewsMap[tab]?.hasCount ? (
        <div
          className={`flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full font-inter text-[.75rem] font-[600] leading-[1rem] transition-colors duration-200 ${
            view === viewsMap[tab]?.value
              ? "bg-primary text-white"
              : "bg-background-active text-secondary"
          }`}
        >
          {viewsMap[tab]?.count}
        </div>
      ) : null}
    </div>
  );
};

export default Tab;
