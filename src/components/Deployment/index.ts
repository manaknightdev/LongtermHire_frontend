import { lazy } from "react";

export const ProjectDeployment = lazy(() => import("./ProjectDeployment"));
export const FrontendDeploy = lazy(() => import("./FrontendDeploy"));
export const BackendDeploy = lazy(() => import("./BackendDeploy"));
