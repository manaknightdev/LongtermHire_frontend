import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { Views } from "@/context/Global";
import { EditWireframeTabTypes } from "@/utils/constants";
import { EditWireframeTabs } from "@/components/EditWireframeTabs";
import { LazyLoad } from "@/components/LazyLoad";
import { ModalPrompt } from "@/components/Modal";
import { useContexts } from "@/hooks/useContexts";
import { ProjectDeployment } from "@/components/Deployment";
import { ViewMapType, ViewWrapper } from "@/components/ViewWrapper";
import { UploadConfig } from "@/components/UploadConfig";

const EditWireframePage = () => {
  const { globalDispatch, setGlobalState } = useContexts();

  const [activeTab, setActiveTab] = useState(EditWireframeTabTypes?.API);
  const [_isChanged, setIsChanged] = useState(false);
  const [openSavePrompt, setOpenSavePrompt] = useState(false);

  const [views, setViews] = useState<Record<string, ViewMapType>>({
    API_CONFIGURATION: {
      value: "api-configuration",
      hasCount: false,
      count: 0
    },
    UPLOAD_CONFIGURATION: {
      value: "upload-configuration",
      hasCount: false,
      count: 0
    }
  });

  const [view, setView] = useState(views.API_CONFIGURATION.value);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    globalDispatch({
      type: "SHOW_BACKBUTTON",
      payload: { showBackButton: true }
    });

    return () => {
      globalDispatch({
        type: "SHOW_BACKBUTTON",
        payload: { showBackButton: false }
      });
    };
  }, []);

  React.useEffect(() => {
    globalDispatch({
      type: "SETPATH",
      payload: {
        path: "wireframe"
      }
    });
  }, []);

  const updateUrlWithTab = (tab: string) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("tab", tab);
    navigate({ search: queryParams.toString() });
  };

  const handleClick = (value: string) => {
    setActiveTab(value);
    updateUrlWithTab(value);
  };

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  React.useEffect(() => {
    if (activeTab === EditWireframeTabTypes?.API) {
      setGlobalState("view", Views.RouteList);
    }
  }, [activeTab]);

  // if (!requirementIsReady) {
  //   return <SkeletonLoader />;
  // }

  return (
    <div className="mx-auto grid h-full max-h-full min-h-full grid-rows-[auto_1fr]">
      <div className="w-full h-fit m-auto sticky top-0 z-10 inset-x-0">
        <LazyLoad>
          <EditWireframeTabs
            activeTab={activeTab}
            handleClick={handleClick}
            filterArr={[EditWireframeTabTypes?.Requirements]}
          />
        </LazyLoad>
      </div>

      <div className="h-full min-h-full max-h-full">
        {activeTab === EditWireframeTabTypes.Requirements && (
          <LazyLoad counts={[1, 3, 2, 1, 2]} count={5}>
            <></>
          </LazyLoad>
        )}

        {activeTab === EditWireframeTabTypes?.API && (
          <LazyLoad counts={[1, 3, 2, 1, 2]} count={5}>
            <ViewWrapper
              view={view}
              views={[...Object.keys(views)]}
              viewsMap={views}
              setView={(property: ViewMapType["value"]) => {
                setView(views[property]?.value);
              }}
              tabContainerClassName="!px-10"
              // className="!grid-rows-[auto_auto] !min-h-fit !max-h-fit !h-fit"
            >
              <LazyLoad view={views.API_CONFIGURATION.value}>
                <>
                  <iframe
                    src="https://resilient-fairy-1f9082.netlify.app/"
                    className="h-full w-full"
                    loading="lazy"
                  />
                </>
              </LazyLoad>
              <LazyLoad view={views.UPLOAD_CONFIGURATION.value}>
                <UploadConfig />
              </LazyLoad>
            </ViewWrapper>
          </LazyLoad>
        )}

        {activeTab === EditWireframeTabTypes?.Deployment && (
          <LazyLoad counts={[1, 3, 2, 1, 2]} count={5}>
            <ProjectDeployment />
          </LazyLoad>
        )}
      </div>

      <LazyLoad>
        <ModalPrompt
          open={openSavePrompt}
          closeModalFunction={() => setOpenSavePrompt(false)}
          actionHandler={() => {
            setIsChanged(false);
            setOpenSavePrompt(false);
          }}
          title={`Unsaved Changes`}
          message={`You have unsaved changes, do you wish to skip unsaved changes?.`}
          titleClasses={`text-blue-950 text-2xl font-semibold font-['Inter']`}
          messageClasses={`text-slate-500 text-sm font-medium font-['Inter'] leading-tight`}
          acceptText="Skip"
          rejectText="OK"
        />
      </LazyLoad>
    </div>
  );
};

export default EditWireframePage;
