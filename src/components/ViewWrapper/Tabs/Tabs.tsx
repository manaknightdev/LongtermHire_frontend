import Tab from "./Tab";

interface TabsProps {
  tabs: any[];
  setView: (view: string) => void;
  view: string;
  viewsMap: any;
  tabClassName?: string;
}

const Tabs = ({
  tabs = [],
  setView,
  view,
  viewsMap,
  tabClassName,
}: TabsProps) => {
  return (
    <div className="scrollbar-hide flex !h-[3rem] w-full max-w-full overflow-x-auto shadow-sm shadow-border md:overflow-x-clip ">
      <div className="flex h-full shrink-0 items-center justify-between gap-[1.5rem]">
        {tabs.map((tab) => (
          <Tab
            key={tab}
            tab={tab}
            view={view}
            viewsMap={viewsMap}
            tabClassName={tabClassName}
            setView={(value: string) => {
              setView(value);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
