import { StringCaser } from "@/utils/utils";

interface SimpleTabProps {
  tab: string;
  setView: (view: string) => void;
  view: string;
  viewsMap: any;
}
const SimpleTab = ({ tab, setView, view, viewsMap }: SimpleTabProps) => {
  return (
    <div
      onClick={() => setView(tab)}
      className={`flex !h-[2.5rem] w-fit min-w-[6.6094rem] cursor-pointer items-center justify-center gap-1 rounded-[.625rem] px-2 py-2 font-inter text-[.875rem] font-[600] leading-[1.25rem] transition-all ${
        view === viewsMap[tab] ? "bg-white text-black" : "text-sub-500"
      }`}
    >
      {StringCaser(tab, { casetype: "capitalize", separator: " " })}
    </div>
  );
};

export default SimpleTab;
