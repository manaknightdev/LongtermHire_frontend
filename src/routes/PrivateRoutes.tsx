import React, { memo } from "react";
import { NotFound } from "./Routes";
import PublicRoute from "./PublicRoutes";
import AdminRoute from "./AdminRoutes";
import { useContexts } from "@/hooks/useContexts";
import { RoleEnum } from "@/utils/Enums";

interface PrivateRouteProps {
  path: string;
  element: JSX.Element;
  access: string[] | string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  path,
  element,
  access,
}: PrivateRouteProps) => {
  const { authState } = useContexts();

  if (authState?.isAuthenticated) {
    // console.log(authState)
    switch (true) {
      case [
        ...(["string"].includes(typeof access) ? [access] : access),
      ].includes(authState?.role as RoleEnum):
        return <AdminRoute path={path}>{element}</AdminRoute>;

      default:
        return <PublicRoute path={"*"} element={<NotFound />} />;
    }
  }
  if (!authState?.isAuthenticated) {
    return <PublicRoute path={"*"} element={<NotFound />} />;
  }
};

export default memo(PrivateRoute);
