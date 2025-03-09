import React, { memo, useEffect } from "react";
import metadataJSON from "@/utils/metadata.json";
import { StringCaser } from "@/utils/utils";

interface PublicRouteProps {
  element: React.ReactElement;
  path?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element, path }) => {
  useEffect(() => {
    const defaultPath = "/";
    const metadata = metadataJSON[path || defaultPath] || metadataJSON[""];
    
    document.title = metadata?.title
      ? StringCaser(metadata.title, {
          casetype: "capitalize",
          separator: " ",
        })
      : "Wireframe Tool | Manaknight Digital";
  }, [path]);

  return element;
};

export default memo(PublicRoute);
