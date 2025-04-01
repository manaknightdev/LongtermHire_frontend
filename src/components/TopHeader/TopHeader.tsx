import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
import { StringCaser } from "@/utils/utils";
import { useContexts } from "@/hooks/useContexts";

const TopHeader = () => {
  const { Capitalize } = new StringCaser();
  const {
    globalState: { showBackButton }
  } = useContexts();

  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    const pathArr = location.pathname.split("/");
    if (pathArr[1] !== "user" && pathArr[1] !== "admin") {
      setCurrentPath(pathArr[1]);
    } else {
      setCurrentPath(pathArr[2]);
    }
  }, [location]);

  return (
    <div className="sticky right-0 top-0 z-20 flex h-14 max-h-14 w-full items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        {showBackButton && <BackButton />}
        <h1 className="text-base capitalize">
          {currentPath === "generate-ui"
            ? "Generate UI"
            : Capitalize(currentPath, {
                separator: " "
              })}
        </h1>
      </div>
    </div>
  );
};

export default TopHeader;
