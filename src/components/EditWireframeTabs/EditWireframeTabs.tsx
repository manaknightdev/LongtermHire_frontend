import { EditWireframeTab } from "./EditWireframeTab";
import { EditWireframeTabTypes } from "@/utils/constants";

interface EditWireframeTabsProps {
  handleClick: (tab: string) => void;
  activeTab: string;
  filterArr: string[];
}

const EditWireframeTabs = ({
  handleClick,
  activeTab,
}: EditWireframeTabsProps) => {
  return (
    <div className="flex items-center gap-x-5 border-b border-t text-sm border-gray-300 bg-white p-2 px-7 font-medium text-[#8D8D8D]">
      {Object.keys(EditWireframeTabTypes).map((tab, tabIndex) => (
        <EditWireframeTab
          activeTab={activeTab}
          tab={tab}
          key={`${tab}_${tabIndex}`}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
};

export default EditWireframeTabs;
