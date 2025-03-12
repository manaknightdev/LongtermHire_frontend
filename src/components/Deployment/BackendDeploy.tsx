import { ViewMapType } from "@/components/ViewWrapper";
import { useBackendDeploymentHook } from "@/hooks/useBackendDeploymentHook";

interface BackendDeployProps {
  view?: ViewMapType["value"];
  project: any;
}

const BackendDeploy = ({ project }: BackendDeployProps) => {
  const { BRANCHES, DEPLOY_ITEMS, branchesLoading } = useBackendDeploymentHook({
    project
  });

  return (
    <>
      <div className="relative px-10 pb-6 pt-3 flex w-full rounded-b-md border-t-0  bg-white py-2 text-sm text-gray-700 ">
        <ol className="list-decimal">
          <li>Set Up Backend</li>
          <li>Create Backend Jenkins job</li>
          {/* <li>Select branch from Back-end Deploy</li> */}
          {/* <li>Click to Deploy</li> */}
        </ol>
      </div>

      <div className="flex justify-between border-t border-[#E0E0E0] bg-[#f9f9f9] px-8">
        <div className="mb-4 mt-6 w-full rounded-md border border-[#E0E0E0] bg-white px-5 py-3">
          <div className="divide-y">
            {/* {loading.setup ? (
              <>
                {["", "", "", "", "", "", "", "", ""].map((_item, index) => (
                  <div
                    key={index}
                    className=" rounded-md border-b-0 border-l-0 border-[#C6C6C6] px-3 py-1.5 shadow-sm "
                  >
                    <div className="my-2 flex animate-pulse items-center justify-center rounded-md bg-gray-300 py-6"></div>
                  </div>
                ))}
              </>
            ) : null} */}

            {DEPLOY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-6 text-sm text-[#393939]"
              >
                <div className="flex items-center gap-4">
                  <span>{item.icon()}</span>
                  <span>{item.name}</span>
                </div>
                <div>{item.actionBtn()}</div>
              </div>
            ))}

            {branchesLoading ? (
              <>
                <div className=" rounded-md border-b-0 border-r-0 border-[#C6C6C6] px-3 py-1.5 shadow-sm ">
                  <div className="my-2 flex animate-pulse items-center justify-center rounded-md bg-gray-300 py-6"></div>
                </div>
                <div className=" rounded-md border-b-0 border-l-0 border-[#C6C6C6] px-3 py-1.5 shadow-sm ">
                  <div className="my-2 flex animate-pulse items-center justify-center rounded-md bg-gray-300 py-6"></div>
                </div>
              </>
            ) : (
              BRANCHES?.length > 0 &&
              BRANCHES?.map((branch: any) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between py-6 text-sm text-[#393939]"
                >
                  <div className="flex items-center gap-4">
                    <span>{branch.icon()}</span>
                    <span>{branch.name}</span>
                  </div>
                  <div>{branch.actionBtn()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BackendDeploy;
