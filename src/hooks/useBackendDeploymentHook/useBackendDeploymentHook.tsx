import { useCreateModelMutation, useCustomModelQuery } from "@/query/shared";
import { ToastStatusEnum } from "@/utils/Enums";
import { useEffect, useMemo, useState } from "react";
import { MKD_DOMAIN } from "@/utils";
import { Models } from "@/utils/baas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContexts } from "@/hooks/useContexts";

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

interface UseBackendDeploymentHookProps {
  project: any;
}

export const useBackendDeploymentHook = ({
  project
}: UseBackendDeploymentHookProps) => {
  const {
    globalState: { settings, nodes, roles, routes }
  } = useContexts();
  const { mutateAsync: customRequest, isPending } = useCustomModelQuery();

  const config = useMemo(() => {
    return {
      settings,
      nodes,
      roles,
      routes
    };
  }, [settings, nodes, roles, routes]);

  const [deployment, _setDeployment] = useState({}) as any;

  const [loading, setLoading] = useState({
    setup: false,
    create_repo: false,
    create_jenkins_job: false
  });

  const [backendBranches, _setBackendBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState<boolean>(false);

  const handleSetup = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        setup: true
      }));
      const result = await customRequest({
        endpoint: `/v1/api/{{project}}/custom/build/backend`,
        method: "POST",
        body: {
          project: project?.slug,
          config: JSON.stringify(config)
        }
      });

      if (result.error) {
        throw new Error(result.message);
      }

      setLoading((prev) => ({
        ...prev,
        setup: false
      }));
    } catch (error) {
      setLoading((prev) => ({
        ...prev,
        setup: false
      }));
    }
  };

  const handleCreateJenkinsJob = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        create_jenkins_job: true
      }));
      const result = await customRequest({
        endpoint: `/v1/api/{{project}}/custom/job/backend`,
        method: "POST",
        body: {
          project: project?.slug,
          branch: "master"
        }
      });

      if (result.error) {
        throw new Error(result.message);
      }

      setLoading((prev) => ({
        ...prev,
        create_jenkins_job: false
      }));
    } catch (error) {
      setLoading((prev) => ({
        ...prev,
        create_jenkins_job: false
      }));
    }
  };

  const DEPLOY_ITEMS = [
    {
      id: 1,
      name: "Deployment",
      actionBtn: () => (
        <InteractiveButton
          className={`flex items-center rounded-md px-3 py-2 shadow-sm !cursor-default border border-[#C6C6C6] !shadow-green-500 !bg-green-500`}
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
      id: 3,
      name: "Set Up Backend",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {deployment.has_be_repo ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_backend.git`}
            />
          ) : (
            ""
          )}
          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              deployment.has_be_repo
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : loading.setup
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={loading.setup}
            disabled={deployment.has_be_repo || loading.setup}
            onClick={(_e: any) => handleSetup()}
          >
            {deployment.has_be_repo ? "Created" : "Setup"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <FaNodeJs className="h-6 w-6 text-purple-500" />
    },
    // {
    //   id: 4,
    //   name: "Android repository",
    //   actionBtn: () => (
    //     <div className="flex items-center gap-4">
    //       { deployment.has_android_repo ? (
    //         <DisplayDomainUrl
    //           text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_android.git`}
    //         />
    //       ) : (
    //         ""
    //       )}
    //       <InteractiveButton
    //         className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
    //            deployment.has_android_repo
    //             ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
    //             : isLoading.state === true &&
    //                 isLoading.target === "create_android_repo"
    //               ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
    //               : "bg-primaryBlue text-white"
    //         } `}
    //         loading={
    //           isLoading.state == true &&
    //           isLoading.target == "create_android_repo"
    //         }
    //         disabled={
    //
    //           deployment.has_android_repo ||
    //           (isLoading.state == true &&
    //             isLoading.target == "create_android_repo")
    //         }
    //         onClick={(_e: any) => handleSetup("android")}
    //       >
    //         { deployment.has_android_repo
    //           ? "Created"
    //           : "Create"}
    //       </InteractiveButton>
    //     </div>
    //   ),
    //   icon: () => <FaAndroid className="h-6 w-6 text-blue-700" />
    // },
    // {
    //   id: 5,
    //   name: "IOS repository",
    //   actionBtn: () => (
    //     <div className="flex items-center gap-4">
    //       { deployment.has_ios_repo ? (
    //         <DisplayDomainUrl
    //           text={`http://23.29.118.76:3000/mkdlabs/${project.slug}_ios.git`}
    //         />
    //       ) : (
    //         ""
    //       )}
    //       <InteractiveButton
    //         className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
    //            deployment.has_ios_repo
    //             ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
    //             : isLoading.state === true &&
    //                 isLoading.target === "create_ios_repo"
    //               ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
    //               : "bg-primaryBlue text-white"
    //         } `}
    //         loading={
    //           isLoading.state == true && isLoading.target == "create_ios_repo"
    //         }
    //         disabled={
    //
    //           deployment.has_ios_repo ||
    //           (isLoading.state == true && isLoading.target == "create_ios_repo")
    //         }
    //         onClick={(_e: any) => handleSetup("ios")}
    //       >
    //         { deployment.has_ios_repo ? "Created" : "Create"}
    //       </InteractiveButton>
    //     </div>
    //   ),
    //   icon: () => <FaApple className="h-6 w-6 text-green-700" />
    // },
    // {
    //   id: 6,
    //   name: "Domain",
    //   actionBtn: () => {
    //     return !deployment.has_domain ? (
    //       <InteractiveButton
    //         className={`flex cursor-pointer items-center rounded-md bg-primaryBlue px-3 py-2 text-white shadow-sm ${
    //           isLoading.state == true && isLoading.target == "create_domain"
    //             ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
    //             : ""
    //         } `}
    //         loading={
    //           isLoading.state == true && isLoading.target == "create_domain"
    //         }
    //         disabled={
    //           isLoading.state == true && isLoading.target == "create_domain"
    //         }
    //         onClick={(_e: any) => handleCreateDomain()}
    //       >
    //         Create
    //       </InteractiveButton>
    //     ) : deployment.has_domain ? (
    //       <InteractiveButton
    //         className={`flex cursor-pointer items-center rounded-md border border-[#C6C6C6] !bg-[#DC2626]  px-3 py-2 shadow-sm ${
    //           isLoading.state == true && isLoading.target == "delete_domain"
    //             ? "!cursor-not-allowed !bg-yellow-700"
    //             : ""
    //         } `}
    //         loading={
    //           isLoading.state == true && isLoading.target == "delete_domain"
    //         }
    //         disabled={
    //           isLoading.state == true && isLoading.target == "delete_domain"
    //         }
    //         onClick={(_e: any) => handleDeleteDomain()}
    //       >
    //         Delete
    //       </InteractiveButton>
    //     ) : null;
    //   },
    //   icon: () => <FaGlobe className="h-6 w-6 text-yellow-700" />
    // },

    {
      id: 8,
      name: "Back-end Jenkins job",
      actionBtn: () => (
        <div className="flex items-center gap-4">
          {deployment.has_be_job ? (
            <DisplayDomainUrl
              text={`http://23.29.118.76:8080/job/${project.slug}_backend/`}
            />
          ) : (
            ""
          )}

          <InteractiveButton
            className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
              deployment.has_be_job
                ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
                : loading.create_jenkins_job
                  ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
                  : "bg-primaryBlue text-white"
            } `}
            loading={loading.create_jenkins_job}
            disabled={deployment.has_be_job || loading.create_jenkins_job}
            onClick={(_e: any) => handleCreateJenkinsJob()}
          >
            {deployment?.has_be_job ? "Created" : "Run"}
          </InteractiveButton>
        </div>
      ),
      icon: () => <SiNodedotjs className="h-6 w-6 text-green-900" />
    }
  ];

  const BRANCHES: any[] = [
    // {
    //   id: 10,
    //   name: "Back-end Deploy",
    //   actionBtn: () => (
    //     <div className="flex items-center gap-4">
    //       {backendBranches.length > 0 && (
    //         <select
    //           name=""
    //           id=""
    //           className=" rounded-md border border-[#C6C6C6] px-3 py-1.5 shadow-sm "
    //           onChange={(e) => setBeBranch(e.target.value)}
    //         >
    //           <option disabled>Choose branch to deploy</option>
    //           {backendBranches.map((branch: any) => (
    //             <option key={branch.name} value={branch.name}>
    //               {branchTimeToDate(branch.name)}
    //             </option>
    //           ))}
    //         </select>
    //       )}
    //       <InteractiveButton
    //         className={`flex cursor-pointer items-center rounded-md px-3 py-2 shadow-sm ${
    //           backendBranches.length == 0
    //             ? "!cursor-not-allowed border border-[#C6C6C6] !bg-black"
    //             : deployment.be_deployed
    //               ? "!cursor-not-allowed border border-[#C6C6C6] !bg-green-500"
    //               : isLoading.state == true &&
    //                   isLoading.target == "deploy_backend"
    //                 ? "!cursor-not-allowed border border-[#C6C6C6] !bg-yellow-700"
    //                 : "bg-primaryBlue text-white"
    //         } `}
    //         loading={
    //           isLoading.state == true && isLoading.target == "deploy_backend"
    //         }
    //         disabled={
    //           backendBranches.length == 0 ||
    //           deployment.be_deployed ||
    //           (platformBranchLoading.state == true &&
    //             platformBranchLoading.platform == "backend") ||
    //           (isLoading.state == true &&
    //             isLoading.target == "backend_branches_loading")
    //         }
    //         onClick={(_e: any) => askDeployBackend()}
    //       >
    //         {deployment.be_deployed
    //           ? "Deployed"
    //           : platformBranchLoading.state == true &&
    //               platformBranchLoading.platform == "backend"
    //             ? "Fetching branches..."
    //             : backendBranches.length == 0
    //               ? "No branch to deploy"
    //               : "Deploy"}
    //       </InteractiveButton>
    //     </div>
    //   ),
    //   icon: () => (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //     >
    //       <path
    //         fillRule="evenodd"
    //         clipRule="evenodd"
    //         d="M19.16 3.75C19.62 4.13 20 4.66 20 5.32V10.69C20 10.95 19.88 11.27 19.53 11.62C19.17 11.98 18.63 12.33 17.89 12.65C16.42 13.28 14.34 13.69 12 13.69C9.66 13.69 7.58 13.28 6.11 12.65C5.37 12.33 4.82 11.98 4.47 11.62C4.12 11.27 4 10.95 4 10.69V5.32C4 4.66 4.38 4.13 4.84 3.75C5.3 3.36 5.92 3.05 6.62 2.8C8.03 2.3 9.93 2 12 2C14.07 2 15.97 2.3 17.38 2.8C18.08 3.05 18.7 3.36 19.16 3.75ZM7.12 4.22C6.51 4.43 6.07 4.67 5.8 4.9C5.52 5.14 5.5 5.28 5.5 5.33C5.5 5.38 5.52 5.53 5.8 5.76C6.07 5.98 6.51 6.22 7.12 6.44C8.34 6.87 10.06 7.15 12 7.15C13.94 7.15 15.67 6.87 16.88 6.44C17.49 6.23 17.93 5.99 18.2 5.76C18.48 5.52 18.5 5.38 18.5 5.33C18.5 5.28 18.48 5.13 18.2 4.9C17.93 4.68 17.49 4.44 16.88 4.22C15.66 3.79 13.94 3.51 12 3.51C10.06 3.51 8.33 3.79 7.12 4.22Z"
    //         fill="#6F6F6F"
    //       />
    //       <path
    //         d="M5.52 14.0304C7.21 14.7604 9.51 15.1904 12 15.1904C14.49 15.1904 16.78 14.7604 18.48 14.0304C19.05 13.7904 19.56 13.5104 20 13.1904V18.6804C20 19.3504 19.62 19.8804 19.16 20.2604C18.7 20.6504 18.08 20.9604 17.38 21.2104C15.97 21.7104 14.07 22.0104 12 22.0104C9.93 22.0104 8.03 21.7104 6.62 21.2104C5.92 20.9604 5.3 20.6504 4.84 20.2604C4.38 19.8704 4 19.3404 4 18.6804V13.1904C4.44 13.5104 4.96 13.7904 5.52 14.0304Z"
    //         fill="#6F6F6F"
    //       />
    //     </svg>
    //   )
    // }
  ];

  return {
    deployment,
    loading,
    backendBranches,
    BRANCHES,
    DEPLOY_ITEMS,
    branchesLoading
  };
};
