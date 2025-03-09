import { useContexts } from "@/hooks/useContexts";
import { ViewMapType } from "../ViewWrapper";

interface FrontendDeployProps {
  view: ViewMapType["value"];
}

const FrontendDeploy = ({}: FrontendDeployProps) => {
  const {
    globalState: { project }
  } = useContexts();
  // border-[#E0E0E0] shadow-xl  border
  return (
    <div className="flex w-full rounded-b-md border-t-0  bg-white py-2 pl-8 text-sm text-gray-700 ">
      <ol className="list-decimal">
        <li>Initialize Project</li>
        <li>Create Domain</li>
        <li>Select branch from React Deploy</li>
        <li>Click to Deploy</li>
      </ol>
    </div>
  );
};

export default FrontendDeploy;
