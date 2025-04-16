import { useState } from "react";
import { useContexts } from "@/hooks/useContexts";
import { ViewMapType, ViewWrapper } from "@/components/ViewWrapper";
import { LazyLoad } from "../LazyLoad";
import { FrontendDeploy, BackendDeploy } from "./index";
import { useViewModelHook } from "@/hooks/useViewModelHook";
import { Models } from "@/utils/baas";
import { useParams } from "react-router";

const ProjectDeployment = () => {
  const [views] = useState<Record<string, ViewMapType>>({
    FRONTEND_DEPLOY: { value: "frontend", hasCount: false, count: 0 },
    BACKEND_DEPLOY: { value: "backend", hasCount: false, count: 0 }
  });

  const [view, setView] = useState(views.FRONTEND_DEPLOY.value);

  const { id } = useParams();

  const { data: project } = useViewModelHook(Models.PROJECT, id!);

  return (
    <div className="h-full max-h-full min-h-full overflow-y-auto bg-[#f9f9f9]">
      <div className="">
        <div className="relative bg-white px-8 pb-6 pt-3">
          <p className="mb-1 text-xl font-semibold">
            Deployment {project?.slug}
          </p>
        </div>
        <div>
          <LazyLoad>
            <ViewWrapper
              view={view}
              views={[...Object.keys(views)]}
              viewsMap={views}
              setView={(property: ViewMapType["value"]) => {
                setView(views[property]?.value);
              }}
              tabContainerClassName=" px-8 "
              className="!grid-rows-[auto_auto] !min-h-fit !max-h-fit !h-fit"
            >
              <LazyLoad view={views.FRONTEND_DEPLOY.value}>
                <FrontendDeploy view={view} />
              </LazyLoad>
              <LazyLoad view={views.BACKEND_DEPLOY.value}>
                <BackendDeploy view={view} project={project} />
              </LazyLoad>
            </ViewWrapper>
          </LazyLoad>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeployment;
{
  /* {isModalOpen && (
  <ModalPrompt
    open={isModalOpen}
    actionHandler={modalContent.actionHandler}
    closeModalFunction={closeModal}
    title={modalContent.title}
    message={modalContent.message}
    acceptText={`Confirm`}
    rejectText={`Cancel`}
  />
)} */
}
