import { useContexts } from "@/hooks/useContexts";
import { ViewMapType } from "@/components/ViewWrapper";

import { InteractiveButton } from "@/components/InteractiveButton";
import { DisplayDomainUrl } from "@/components/DisplayDomainUrl";
// import { ModalPrompt } from "@/components/Modal";

import {
  FaAndroid,
  FaApple,
  FaCameraRetro,
  FaCloudUploadAlt,
  FaGlobe,
  FaNodeJs,
  FaReact
} from "react-icons/fa";
import { SiNodedotjs, SiSemanticuireact } from "react-icons/si";
import { useState } from "react";
import { useFrontendDeploymentHook } from "@/hooks/useFrontendDeploymentHook";

interface FrontendDeployProps {
  view: ViewMapType["value"];
}

const FrontendDeploy = ({}: FrontendDeployProps) => {
  const {
    globalState: { project }
  } = useContexts();

  const {} = useFrontendDeploymentHook({});

  const [deployment, _setDeployment] = useState({}) as any;
  const [isLoading, _setIsLoading] = useState({ state: false, target: "page" });
  const [frontendBranches, _setFrontendBranches] = useState([]) as any;
  const [backendBranches, _setBackendBranches] = useState([]);
  const [_feBranch, setFeBranch] = useState<string>("");
  const [_beBranch, setBeBranch] = useState<string>("");
  const [guideFor, setGuideFor] = useState("front-end");
  const [_isModalOpen, _setIsModalOpen] = useState<boolean>(false);
  const [_modalContent, _setModalContent] = useState({}) as any;
  const [branchesLoading, setBranchesLoading] = useState<boolean>(false);

  const [platformBranchLoading, _setPlatformBranchLoading] = useState({
    state: false,
    platform: ""
  });

  const getPlatformRepoBranches = async (_platform: any) => {
    try {
      // if(platform) {
      //   setPlatformBranchLoading({ state: true, platform: `${platform}` });
      // }
      // const feBranches = await wSdk.getRepoBranches(project?.slug, "frontend");
      // const beBranches = await wSdk.getRepoBranches(project?.slug, "backend");
      // if (feBranches.error || beBranches.error)
      //   throw new Error(feBranches.error || beBranches.error);
      // if (
      //   feBranches.list.message === "The target couldn't be found."
      // ) {
      //   setBranchesLoading(false);
      //   setPlatformBranchLoading({ state: false, platform: `${platform}` });
      // } else {
      //   setFrontendBranches(feBranches.list);
      //   setPlatformBranchLoading({ state: false, platform: `${platform}` });
      // }
      // if (beBranches.list.message === "The target couldn't be found.") {
      //   setBranchesLoading(false);
      //   setPlatformBranchLoading({ state: false, platform: `${platform}` });
      // } else {
      //   setBackendBranches(beBranches.list);
      //   setPlatformBranchLoading({ state: false, platform: `${platform}` });
      // }
      // setBranchesLoading(false);
      // return { feBranches: feBranches.list, beBranches: beBranches.list };
    } catch (error) {
      setBranchesLoading(false);
      // tokenExpireError(error.message);
    }
  };

  const handleInitializeProjectDeployment = async () => {
    // try {
    // setIsLoading({ state: true, target: "initializing" });
    //   const result = await wSdk.initializeProjectDeployment(project?.slug);
    //   if (!result.error) {
    //     setHasDeployment(true);
    //     let res = await getProjectDeployment(project);
    //   }
    // } catch (error) {
    //   setHasDeployment(false);
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
    // setIsLoading({ state: false, target: null });
  };

  const handleCreateRepo = async (_platform: string) => {
    //     try {
    //       setIsLoading({ state: true, target: `create_${platform}_repo` });
    //       const result = await wSdk.createRepo(project?.slug, platform);
    //       if (!result.error) {
    // console.log(result)
    //        getPlatformRepoBranches(platform);
    //          getProjectDeployment(project);
    //         setIsLoading({ state: false, target: null });
    //       }
    //     } catch (error) {
    //       console.log(error)
    //       setIsLoading({ state: false, target: null });
    //       tokenExpireError(dispatch, error.message);
    //     }
  };

  const handleCreateDomain = async () => {
    // try {
    //   setIsLoading({ state: true, target: `create_domain` });
    //   const result = await wSdk.createDomainRecord(project?.slug);
    //   if (!result.error) {
    //     await getProjectDeployment(project);
    //   }
    // } catch (error) {
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
    // setIsLoading({ state: false, target: null });
  };

  const askDeleteDomain = () => {
    // const content = {
    //   title: `Delete Domain`,
    //   actionHandler: handleDeleteDomain,
    //   message: `Are you sure you want to delete domain record?`,
    // };
    // setModalContent({ ...content });
    // setIsModalOpen(true);
  };

  const handleDeleteDomain = async () => {
    // try {
    //   setIsLoading({ state: true, target: `delete_domain` });
    //   const result = await wSdk.deleteDomainRecord(project?.slug);
    //   if (!result.error) {
    //     await getProjectDeployment(project);
    //     setIsLoading({ state: false, target: null });
    //   }
    // } catch (error) {
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
  };

  const askCreateJenkingsJob = (_platform: any) => {
    // const content = {
    //   title: `Create ${
    //     platform[0].toUpperCase() + platform.slice(1)
    //   } Jenkins job`,
    //   actionHandler: () => handleCreateJenkinsJob(platform),
    //   message: `Are you sure you want to create ${platform} jenkins job?`,
    // };
    // setModalContent({ ...content });
    // setIsModalOpen(true);
  };

  const handleCreateJenkinsJob = async (_platform: string) => {
    // try {
    //   setIsLoading({ state: true, target: `create_${platform}_job` });
    //   const result = await wSdk.createJenkinsJob(project?.slug, platform);
    //   if (!result.error) {
    //     await getProjectDeployment(project);
    //   }
    // } catch (error) {
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
    // setIsLoading({ state: false, target: null });
  };

  const askDeployFrontend = () => {
    // const content = {
    //   title: `Deploy Frontend`,
    //   actionHandler: handleDeployFrontend,
    //   message: `Are you sure you want to deploy frontend?`,
    // };
    // setModalContent({ ...content });
    // setIsModalOpen(true);
  };

  const handleDeployFrontend = async () => {
    // if (feBranch == "") return;
    // try {
    //   setIsLoading({ state: true, target: `deploy_frontend` });
    //   const result = await wSdk.provisionProject(
    //     project?.slug,
    //     "frontend",
    //     feBranch ?? "master"
    //   );
    //   if (!result.error) {
    //     closeModal();
    //     await getProjectDeployment(project);
    //   }
    // } catch (error) {
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
    // setIsLoading({ state: false, target: null });
  };

  const askDeployBackend = () => {
    // const content = {
    //   title: `Deploy Backend`,
    //   actionHandler: handleDeployBackend,
    //   message: `Are you sure you want to deploy backend?`,
    // };
    // setModalContent({ ...content });
    // setIsModalOpen(true);
  };

  const handleDeployBackend = async () => {
    // if (beBranch == "") return;
    // try {
    //   setIsLoading({ state: true, target: `deploy_backend` });
    //   const result = await wSdk.provisionProject(
    //     project?.slug,
    //     "backend",
    //     beBranch ?? "master"
    //   );
    //   if (!result.error) {
    //     closeModal();
    //     await getProjectDeployment(project);
    //   }
    // } catch (error) {
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
    // setIsLoading({ state: false, target: null });
  };

  const branchTimeToDate = (branch = "") => {
    const branchNameUnits = branch.split("_");
    if (branchNameUnits.length <= 1) return branch;

    const date = new Date(Number(branchNameUnits[1]));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDateTime = `${branchNameUnits[0]} - Commit ${year}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return formattedDateTime;
  };

  // useEffect(() => {
  //   getPlatformRepoBranches( );

  // }, [deployment.has_fe_repo, deployment.has_be_repo]);

  // clear s3 images
  const clearS3Images = async () => {
    // try {
    //   setIsLoading({ state: true, target: `clear_s3_images` });
    //   const result = await wSdk.clearS3Images(project?.project_id);
    //   if (!result.error) {
    //    showToast(globalDispatch, "S3 images cleared successfully", 4000, "success");
    //   }
    // } catch (error) {
    //   showToast(globalDispatch, error.message, 4000, "error");
    //   setIsLoading({ state: false, target: null });
    //   tokenExpireError(dispatch, error.message);
    // }
    // setIsLoading({ state: false, target: null });
  };
  // console.log(project)

  const DEPLOY_ITEMS = [
    {
      id: 1,
      name: "Deployment",
      actionBtn: () => (
        <InteractiveButton
          className={`flex items-center rounded-md px-3 py-2 shadow-sm !cursor-default border border-[#C6C6C6] !bg-green-500`}
          loading={
            isLoading.state == true && isLoading.target == "initializing"
          }
          disabled={true}
          // onClick={handleInitializeProjectDeployment}
        >
          Initialized
        </InteractiveButton>
      ),
      icon: () => <FaCloudUploadAlt className="h-6 w-6 text-green-500" />
    },
    // {
    //   id: 11,
    //   name: "Clear Development Images",
    //   actionBtn: () => (
    //     <InteractiveButton
    //       disabled={
    //         isLoading.state == true && isLoading.target == "clear_s3_images"
    //       }
    //       onClick={clearS3Images}
    //     >
    //       {isLoading.state == true && isLoading.target == "clear_s3_images"
    //         ? "Clearing..."
    //         : "Clear"}
    //     </InteractiveButton>
    //   ),
    //   icon: () => <FaCameraRetro className="h-6 w-6 text-red-500" />
    // },
    {
      id: 6,
      name: "Domain",
      actionBtn: () => {
        return !deployment.has_domain ? (
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md bg-primaryBlue px-3 py-2 text-white shadow-sm ${
              isLoading.state == true && isLoading.target == "create_domain"
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                : ""
            } `}
            loading={
              isLoading.state == true && isLoading.target == "create_domain"
            }
            disabled={
              isLoading.state == true && isLoading.target == "create_domain"
            }
            onClick={(_e: any) => handleCreateDomain()}
          >
            Create
          </InteractiveButton>
        ) : deployment.has_domain ? (
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md border border-[#C6C6C6] !bg-[#DC2626]  px-3 py-2 shadow-sm ${
              isLoading.state == true && isLoading.target == "delete_domain"
                ? "!cursor-not-allowed !bg-yellow-700"
                : ""
            } `}
            loading={
              isLoading.state == true && isLoading.target == "delete_domain"
            }
            disabled={
              isLoading.state == true && isLoading.target == "delete_domain"
            }
            onClick={(_e: any) => handleDeleteDomain()}
          >
            Delete
          </InteractiveButton>
        ) : null;
      },
      icon: () => <FaGlobe className="h-6 w-6 text-yellow-700" />
    },
    {
      id: 2,
      name: "React repository",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {deployment.has_fe_repo ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_frontend.git`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              deployment.has_fe_repo
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : isLoading.state === true &&
                    isLoading.target === "create_frontend_repo"
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true &&
              isLoading.target == "create_frontend_repo"
            }
            disabled={
              deployment.has_fe_repo ||
              (isLoading.state === true &&
                isLoading.target === "create_frontend_repo")
            }
            onClick={() => handleCreateRepo("frontend")}
          >
            {deployment.has_fe_repo ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <FaReact className="h-6 w-6 text-blue-500" />
    },
    {
      id: 9,
      name: "React Deploy",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {frontendBranches.length > 0 && (
            <select
              name=""
              id=""
              className="rounded-md border border-[#C6C6C6] px-3 py-1.5 shadow-sm"
              onChange={(e) => setFeBranch(e.target.value)}
            >
              <option disabled>Choose branch to deploy</option>
              {frontendBranches.map((branch: any) => (
                <option key={branch.name} value={branch.name}>
                  {branchTimeToDate(branch.name)}
                </option>
              ))}
            </select>
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              frontendBranches.length == 0
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-black"
                : deployment.fe_deployed
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                  : isLoading.state == true &&
                      isLoading.target == "deploy_frontend"
                    ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                    : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true && isLoading.target == "deploy_frontend"
            }
            disabled={
              frontendBranches.length == 0 ||
              !deployment.has_domain ||
              deployment.fe_deployed ||
              (isLoading.state == true &&
                isLoading.target == "deploy_frontend") ||
              (platformBranchLoading.state == true &&
                platformBranchLoading.platform == "frontend")
            }
            onClick={(_e: any) => askDeployFrontend()}
          >
            {deployment.fe_deployed
              ? "Deployed"
              : platformBranchLoading.state == true &&
                  platformBranchLoading.platform == "frontend"
                ? "Fetching branches..."
                : frontendBranches.length == 0
                  ? "No branch to deploy"
                  : "Deploy"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <SiSemanticuireact className="h-6 w-6 text-purple-900" />
    },
    {
      id: 7,
      name: "React Jenkins job",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {deployment.has_fe_job ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:8080/job/${project.slug}_frontend/`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              deployment.has_fe_job
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : isLoading.state == true &&
                    isLoading.target == "create_frontend_job"
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true &&
              isLoading.target == "create_frontend_job"
            }
            disabled={
              deployment.has_fe_job ||
              (isLoading.state == true &&
                isLoading.target == "create_frontend_job")
            }
            onClick={(_e: any) => handleCreateJenkinsJob("frontend")}
          >
            {deployment.has_fe_job ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <SiSemanticuireact className="h-6 w-6 text-blue-900" />
    }
  ];

  const BRANCHES: any[] = [
    // {
    //   id: 9,
    //   name: "React Deploy",
    //   actionBtn: () => (
    //     <div className="flex items-center gap-4">
    //       {frontendBranches.length > 0 && (
    //         <select
    //           name=""
    //           id=""
    //           className="rounded-md border border-[#C6C6C6] px-3 py-1.5 shadow-sm"
    //           onChange={(e) => setFeBranch(e.target.value)}
    //         >
    //           <option disabled>Choose branch to deploy</option>
    //           {frontendBranches.map((branch: any) => (
    //             <option key={branch.name} value={branch.name}>
    //               {branchTimeToDate(branch.name)}
    //             </option>
    //           ))}
    //         </select>
    //       )}
    //       <InteractiveButton
    //         className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
    //           frontendBranches.length == 0
    //             ? "!cursor-not-allowed border border-[#C6C6C6] !bg-black"
    //             : deployment.fe_deployed
    //               ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
    //               : isLoading.state == true &&
    //                   isLoading.target == "deploy_frontend"
    //                 ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
    //                 : "bg-primaryBlue text-white"
    //         } `}
    //         loading={
    //           isLoading.state == true && isLoading.target == "deploy_frontend"
    //         }
    //         disabled={
    //           frontendBranches.length == 0 ||
    //           !deployment.has_domain ||
    //           deployment.fe_deployed ||
    //           (isLoading.state == true &&
    //             isLoading.target == "deploy_frontend") ||
    //           (platformBranchLoading.state == true &&
    //             platformBranchLoading.platform == "frontend")
    //         }
    //         onClick={(_e: any) => askDeployFrontend()}
    //       >
    //         {deployment.fe_deployed
    //           ? "Deployed"
    //           : platformBranchLoading.state == true &&
    //               platformBranchLoading.platform == "frontend"
    //             ? "Fetching branches..."
    //             : frontendBranches.length == 0
    //               ? "No branch to deploy"
    //               : "Deploy"}
    //       </InteractiveButton>
    //     </div>
    //   ),
    //   icon: () => <SiSemanticuireact className="h-6 w-6 text-purple-900" />
    // }
  ];
  return (
    <>
      <div className="relative px-10 pb-6 pt-3 flex w-full rounded-b-md border-t-0  bg-white py-2 text-sm text-gray-700 ">
        <ol className="list-decimal">
          <li>Create Domain</li>
          <li>Create React repository</li>
          <li>Click to Deploy</li>
          <li>Create React Jenkins job</li>
          {/* <li>Select branch from React Deploy</li> */}
        </ol>
      </div>

      <div className="flex justify-between border-t border-[#E0E0E0] bg-[#f9f9f9] px-8">
        <div className="mb-4 mt-6 w-full rounded-md border border-[#E0E0E0] bg-white px-5 py-3">
          <div className="divide-y">
            {isLoading.state == true && isLoading.target == "page" ? (
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
            ) : (
              DEPLOY_ITEMS.map((item) => (
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
              ))
            )}

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
              BRANCHES.map((branch) => (
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

export default FrontendDeploy;
