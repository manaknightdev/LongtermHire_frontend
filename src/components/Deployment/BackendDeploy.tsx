import { useContexts } from "@/hooks/useContexts";
import { ViewMapType } from "../ViewWrapper";

interface BackendDeployProps {
  view: ViewMapType["value"];
}

const BackendDeploy = ({}: BackendDeployProps) => {
  const {
    globalState: { project }
  } = useContexts();
  //  border-[#E0E0E0] border shadow-xl
  return (
    <div className="flex pr-2 w-full rounded-b-md  border-t-0 bg-white py-2 pl-8 text-sm text-gray-700 ">
      <ol className="list-decimal">
        <li>Initialize Project</li>
        <li>Create Domain</li>
        <li>Select branch from Back-end Deploy</li>
        <li>Click to Deploy</li>
      </ol>
    </div>
  );
};

export default BackendDeploy;
