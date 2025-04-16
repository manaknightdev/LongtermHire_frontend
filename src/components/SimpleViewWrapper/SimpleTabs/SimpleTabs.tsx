import { SimpleTab } from "@/components/SimpleViewWrapper";

interface SimpleTabsProps {
  tabs: any[];
  setView: (view: string) => void;
  view: string;
  viewsMap: any;
}
const SimpleTabs = ({
  tabs = [],
  setView,
  view,
  viewsMap
}: SimpleTabsProps) => {
  return (
    <div className="scrollbar-hide flex !h-fit w-full max-w-full gap-[.25rem] overflow-x-auto rounded-[.625rem]  bg-weak-100 p-[.25rem] md:min-w-[23.6875rem] md:max-w-fit md:overflow-x-clip ">
      <div className="flex shrink-0 items-center justify-between gap-[1.5rem] overflow-x-auto">
        {tabs.map((tab) => (
          <SimpleTab
            key={tab}
            tab={tab}
            view={view}
            viewsMap={viewsMap}
            setView={(value: string) => {
              setView(value);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleTabs;
