import React, { memo, useEffect } from "react";
import { Navigate } from "react-router";
import metadataJSON from "@/utils/metadata.json";
import { StringCaser } from "@/utils/utils";
import { useContexts } from "@/hooks/useContexts";

interface AdminRouteProps {
  path: string;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ path, children }) => {
  const { authState } = useContexts();
  const stringCaser = new StringCaser();

  const { isAuthenticated } = authState;

  useEffect(() => {
    const metadata = metadataJSON[path ?? "/"];
    if (metadata !== undefined) {
      document.title = metadata?.title
        ? stringCaser.Capitalize(metadata?.title, {
            separator: " "
          })
        : "Wireframe Tool | Manaknight Digital";
    } else {
      document.title = "Wireframe Tool | Manaknight Digital";
    }
  }, [path]);

  return (
    <>
      {isAuthenticated ? (
        <>{children}</>
      ) : (
        <Navigate to="/admin/login" replace />
      )}
    </>
  );
};

export default memo(AdminRoute);
