interface EditWireframeTabProps {
  handleClick: (tab: string) => void;
  activeTab: string;
  tab: string;
}

const EditWireframeTab = ({
  handleClick,
  activeTab,
  tab,
}: EditWireframeTabProps) => {
  return (
    <div
      role="button"
      className={`cursor-pointer rounded-lg px-3 py-1 ${
        activeTab === tab ? "bg-[#f4f4f4] text-[#525252]" : ""
      }`}
      onClick={() => handleClick(tab)}
    >
      {tab}
    </div>
  );
};

export default EditWireframeTab;
