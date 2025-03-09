import { useState } from "react";
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
import { useContexts } from "@/hooks/useContexts";
import { ViewMapType, ViewWrapper } from "@/components/ViewWrapper";
import { LazyLoad } from "../LazyLoad";
import { FrontendDeploy, BackendDeploy } from "./index";

const ProjectDeployment = ({}) => {
  const {
    globalState: { project }
  } = useContexts();

  const [deployment, _setDeployment] = useState({}) as any;
  const [hasDeployment, setHasDeployment] = useState(false);
  const [isLoading, _setIsLoading] = useState({ state: false, target: "page" });
  const [frontendBranches, _setFrontendBranches] = useState([]) as any;
  const [backendBranches, _setBackendBranches] = useState([]);
  const [_feBranch, setFeBranch] = useState<string>("");
  const [_beBranch, setBeBranch] = useState<string>("");
  const [guideFor, setGuideFor] = useState("front-end");
  const [_isModalOpen, _setIsModalOpen] = useState<boolean>(false);
  const [_modalContent, _setModalContent] = useState({}) as any;
  const [branchesLoading, setBranchesLoading] = useState<boolean>(true);

  const [views, setViews] = useState<Record<string, ViewMapType>>({
    FRONTEND_DEPLOY: { value: "frontend", hasCount: false, count: 0 },
    BACKEND_DEPLOY: { value: "backend", hasCount: false, count: 0 }
  });

  const [view, setView] = useState(views.FRONTEND_DEPLOY.value);

  const [platformBranchLoading, _setPlatformBranchLoading] = useState({
    state: false,
    platform: ""
  });

  const getPlatformRepoBranches = async (_platform: any) => {
    // if (!hasDeployment) return [];
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
      setHasDeployment(false);
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
          className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm  ${
            hasDeployment
              ? "!cursor-default border border-[#C6C6C6] !bg-green-500"
              : "!bg-primaryBlue text-white"
          }`}
          loading={
            isLoading.state == true && isLoading.target == "initializing"
          }
          disabled={
            hasDeployment ||
            (isLoading.state == true && isLoading.target == "initializing")
          }
          onClick={handleInitializeProjectDeployment}
        >
          {!hasDeployment ? "Initialize" : "Initialized"}
        </InteractiveButton>
      ),
      icon: () => <FaCloudUploadAlt className="h-6 w-6 text-green-500" />
    },
    {
      id: 11,
      name: "Clear Development Images",
      actionBtn: () => (
        <InteractiveButton
          disabled={
            isLoading.state == true && isLoading.target == "clear_s3_images"
          }
          onClick={clearS3Images}
        >
          {isLoading.state == true && isLoading.target == "clear_s3_images"
            ? "Clearing..."
            : "Clear"}
        </InteractiveButton>
      ),
      icon: () => <FaCameraRetro className="h-6 w-6 text-red-500" />
    },
    {
      id: 2,
      name: "React repository",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {hasDeployment && deployment.has_fe_repo ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_frontend.git`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              hasDeployment && deployment.has_fe_repo
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
            {hasDeployment && deployment.has_fe_repo ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <FaReact className="h-6 w-6 text-blue-500" />
    },
    {
      id: 3,
      name: "Back-end repository",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {hasDeployment && deployment.has_be_repo ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_backend.git`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              hasDeployment && deployment.has_be_repo
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : isLoading.state === true &&
                    isLoading.target === "create_backend_repo"
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true &&
              isLoading.target == "create_backend_repo"
            }
            disabled={
              deployment.has_be_repo ||
              (isLoading.state === true &&
                isLoading.target === "create_backend_repo")
            }
            onClick={(_e: any) => handleCreateRepo("backend")}
          >
            {hasDeployment && deployment.has_be_repo ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <FaNodeJs className="h-6 w-6 text-purple-500" />
    },
    {
      id: 4,
      name: "Android repository",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {hasDeployment && deployment.has_android_repo ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_android.git`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              hasDeployment && deployment.has_android_repo
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : isLoading.state === true &&
                    isLoading.target === "create_android_repo"
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true &&
              isLoading.target == "create_android_repo"
            }
            disabled={
              !hasDeployment ||
              deployment.has_android_repo ||
              (isLoading.state == true &&
                isLoading.target == "create_android_repo")
            }
            onClick={(_e: any) => handleCreateRepo("android")}
          >
            {hasDeployment && deployment.has_android_repo
              ? "Created"
              : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <FaAndroid className="h-6 w-6 text-blue-700" />
    },
    {
      id: 5,
      name: "IOS repository",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {hasDeployment && deployment.has_ios_repo ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_ios.git`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              hasDeployment && deployment.has_ios_repo
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : isLoading.state === true &&
                    isLoading.target === "create_ios_repo"
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true && isLoading.target == "create_ios_repo"
            }
            disabled={
              !hasDeployment ||
              deployment.has_ios_repo ||
              (isLoading.state == true && isLoading.target == "create_ios_repo")
            }
            onClick={(_e: any) => handleCreateRepo("ios")}
          >
            {hasDeployment && deployment.has_ios_repo ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <FaApple className="h-6 w-6 text-green-700" />
    },
    {
      id: 6,
      name: "Domain",
      actionBtn: () => {
        return hasDeployment && !deployment.has_domain ? (
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
        ) : hasDeployment && deployment.has_domain ? (
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
      id: 7,
      name: "React Jenkins job",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {hasDeployment && deployment.has_fe_job ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:8080/job/${project.slug}_frontend/`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              hasDeployment && deployment.has_fe_job
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
              !hasDeployment ||
              deployment.has_fe_job ||
              (isLoading.state == true &&
                isLoading.target == "create_frontend_job")
            }
            onClick={(_e: any) => handleCreateJenkinsJob("frontend")}
          >
            {hasDeployment && deployment.has_fe_job ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <SiSemanticuireact className="h-6 w-6 text-blue-900" />
    },
    {
      id: 8,
      name: "Back-end Jenkins job",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {hasDeployment && deployment.has_be_job ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:8080/job/${project.slug}_backend/`}
            />
          ) : (
            ""
          )}

          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              hasDeployment && deployment.has_be_job
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : isLoading.state == true &&
                    isLoading.target == "create_backend_job"
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true &&
              isLoading.target == "create_backend_job"
            }
            disabled={
              !hasDeployment ||
              deployment.has_be_job ||
              (isLoading.state == true &&
                isLoading.target == "create_backend_job")
            }
            onClick={(_e: any) => handleCreateJenkinsJob("backend")}
          >
            {hasDeployment && deployment?.has_be_job ? "Created" : "Create"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <SiNodedotjs className="h-6 w-6 text-green-900" />
    }
  ];

  const BRANCHES = [
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
                : hasDeployment && deployment.fe_deployed
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
              !hasDeployment ||
              !deployment.has_domain ||
              deployment.fe_deployed ||
              (isLoading.state == true &&
                isLoading.target == "deploy_frontend") ||
              (platformBranchLoading.state == true &&
                platformBranchLoading.platform == "frontend")
            }
            onClick={(_e: any) => askDeployFrontend()}
          >
            {hasDeployment && deployment.fe_deployed
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
      id: 10,
      name: "Back-end Deploy",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {backendBranches.length > 0 && (
            <select
              name=""
              id=""
              className=" rounded-md border border-[#C6C6C6] px-3 py-1.5 shadow-sm "
              onChange={(e) => setBeBranch(e.target.value)}
            >
              <option disabled>Choose branch to deploy</option>
              {backendBranches.map((branch: any) => (
                <option key={branch.name} value={branch.name}>
                  {branchTimeToDate(branch.name)}
                </option>
              ))}
            </select>
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              backendBranches.length == 0
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-black"
                : hasDeployment && deployment.be_deployed
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                  : isLoading.state == true &&
                      isLoading.target == "deploy_backend"
                    ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                    : "bg-primaryBlue text-white"
            } `}
            loading={
              isLoading.state == true && isLoading.target == "deploy_backend"
            }
            disabled={
              backendBranches.length == 0 ||
              !hasDeployment ||
              deployment.be_deployed ||
              (platformBranchLoading.state == true &&
                platformBranchLoading.platform == "backend") ||
              (isLoading.state == true &&
                isLoading.target == "backend_branches_loading")
            }
            onClick={(_e: any) => askDeployBackend()}
          >
            {hasDeployment && deployment.be_deployed
              ? "Deployed"
              : platformBranchLoading.state == true &&
                  platformBranchLoading.platform == "backend"
                ? "Fetching branches..."
                : backendBranches.length == 0
                  ? "No branch to deploy"
                  : "Deploy"}
          </InteractiveButton>
        </div>
      ),
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.16 3.75C19.62 4.13 20 4.66 20 5.32V10.69C20 10.95 19.88 11.27 19.53 11.62C19.17 11.98 18.63 12.33 17.89 12.65C16.42 13.28 14.34 13.69 12 13.69C9.66 13.69 7.58 13.28 6.11 12.65C5.37 12.33 4.82 11.98 4.47 11.62C4.12 11.27 4 10.95 4 10.69V5.32C4 4.66 4.38 4.13 4.84 3.75C5.3 3.36 5.92 3.05 6.62 2.8C8.03 2.3 9.93 2 12 2C14.07 2 15.97 2.3 17.38 2.8C18.08 3.05 18.7 3.36 19.16 3.75ZM7.12 4.22C6.51 4.43 6.07 4.67 5.8 4.9C5.52 5.14 5.5 5.28 5.5 5.33C5.5 5.38 5.52 5.53 5.8 5.76C6.07 5.98 6.51 6.22 7.12 6.44C8.34 6.87 10.06 7.15 12 7.15C13.94 7.15 15.67 6.87 16.88 6.44C17.49 6.23 17.93 5.99 18.2 5.76C18.48 5.52 18.5 5.38 18.5 5.33C18.5 5.28 18.48 5.13 18.2 4.9C17.93 4.68 17.49 4.44 16.88 4.22C15.66 3.79 13.94 3.51 12 3.51C10.06 3.51 8.33 3.79 7.12 4.22Z"
            fill="#6F6F6F"
          />
          <path
            d="M5.52 14.0304C7.21 14.7604 9.51 15.1904 12 15.1904C14.49 15.1904 16.78 14.7604 18.48 14.0304C19.05 13.7904 19.56 13.5104 20 13.1904V18.6804C20 19.3504 19.62 19.8804 19.16 20.2604C18.7 20.6504 18.08 20.9604 17.38 21.2104C15.97 21.7104 14.07 22.0104 12 22.0104C9.93 22.0104 8.03 21.7104 6.62 21.2104C5.92 20.9604 5.3 20.6504 4.84 20.2604C4.38 19.8704 4 19.3404 4 18.6804V13.1904C4.44 13.5104 4.96 13.7904 5.52 14.0304Z"
            fill="#6F6F6F"
          />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen bg-[#f9f9f9]">
      <div>
        <div>
          <div className="relative flex items-start justify-between bg-white px-8 pb-6 pt-3">
            <div>
              <p className="mb-1 text-xl font-semibold">
                Deployment {project?.slug}
              </p>

              <LazyLoad>
                <ViewWrapper
                  view={view}
                  views={[...Object.keys(views)]}
                  viewsMap={views}
                  setView={(property: ViewMapType["value"]) => {
                    setView(views[property]?.value);
                  }}
                  className="!grid-rows-[auto_auto] !min-h-fit !max-h-fit !h-fit"
                >
                  <LazyLoad view={views.FRONTEND_DEPLOY.value}>
                    <FrontendDeploy view={view} />
                  </LazyLoad>
                  <LazyLoad view={views.BACKEND_DEPLOY.value}>
                    <BackendDeploy view={view} />
                  </LazyLoad>
                </ViewWrapper>
              </LazyLoad>
            </div>
          </div>

          <div className="flex justify-between border-t border-[#E0E0E0] bg-[#f9f9f9] px-8">
            <div className="mb-4 mt-6 w-full rounded-md border border-[#E0E0E0] bg-white px-5 py-3">
              <div className="divide-y">
                {isLoading.state == true && isLoading.target == "page" ? (
                  <>
                    {["", "", "", "", "", "", "", "", ""].map(
                      (_item, index) => (
                        <div
                          key={index}
                          className=" rounded-md border-b-0 border-l-0 border-[#C6C6C6] px-3 py-1.5 shadow-sm "
                        >
                          <div className="my-2 flex animate-pulse items-center justify-center rounded-md bg-gray-300 py-6"></div>
                        </div>
                      )
                    )}
                  </>
                ) : isLoading.state == false && !hasDeployment ? (
                  <div className="flex h-[50vh] flex-col items-center justify-center">
                    <p className="mb-4 text-lg font-semibold">
                      Please initialize the project to proceed.
                    </p>
                    <InteractiveButton
                      className="rounded-md bg-primaryBlue px-4 py-2 text-white"
                      onClick={handleInitializeProjectDeployment}
                      loading={
                        isLoading.state && isLoading.target === "initializing"
                      }
                    >
                      Initialize Project
                    </InteractiveButton>
                  </div>
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

                {hasDeployment && branchesLoading ? (
                  <>
                    <div className=" rounded-md border-b-0 border-r-0 border-[#C6C6C6] px-3 py-1.5 shadow-sm ">
                      <div className="my-2 flex animate-pulse items-center justify-center rounded-md bg-gray-300 py-6"></div>
                    </div>
                    <div className=" rounded-md border-b-0 border-l-0 border-[#C6C6C6] px-3 py-1.5 shadow-sm ">
                      <div className="my-2 flex animate-pulse items-center justify-center rounded-md bg-gray-300 py-6"></div>
                    </div>
                  </>
                ) : (
                  hasDeployment &&
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
        </div>
      </div>

      {/* {isModalOpen && (
        <ModalPrompt
          open={isModalOpen}
          actionHandler={modalContent.actionHandler}
          closeModalFunction={closeModal}
          title={modalContent.title}
          message={modalContent.message}
          acceptText={`Confirm`}
          rejectText={`Cancel`}
        />
      )} */}
    </div>
  );
};

export default ProjectDeployment;
