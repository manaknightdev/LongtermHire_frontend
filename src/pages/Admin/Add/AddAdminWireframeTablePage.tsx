import { MkdInput } from "@/components/MkdInput";
import { LazyLoad } from "@/components/LazyLoad";
import { OfflineAwareForm } from "@/components/OfflineAwareForm";
import { Models } from "@/utils/baas";
import { useProjectHook } from "@/hooks/useProjectHook";

interface AddWireframePageProps {
  onClose?: () => void;
  onSuccess: (e?: any) => void;
}

const AddWireframePage = ({ onSuccess }: AddWireframePageProps) => {
  const { errors, handleSubmit, onSubmit, register } = useProjectHook({
    onSuccess,
  });

  return (
    <div className="h-full w-full">
      <OfflineAwareForm
        onSubmit={handleSubmit(onSubmit)}
        table={Models.PROJECT}
        operation="create"
        showOfflineWarning={true}
        enableOptimisticSubmit={true}
        className="grid h-full max-h-full min-h-full w-full grid-rows-[auto_auto_1fr] p-4 text-left"
        formClassName="grid h-full max-h-full min-h-full w-full grid-rows-[1fr_auto]"
      >
        <div className="flex h-full max-h-full min-h-full flex-col gap-4 overflow-y-auto">
          <div>
            <LazyLoad>
              <MkdInput
                type="text"
                name="name"
                label="Name"
                register={register}
                errors={errors}
              />
            </LazyLoad>
          </div>
          <div>
            <LazyLoad>
              <MkdInput
                type="text"
                name="slug"
                label="Slug"
                register={register}
                errors={errors}
              />
            </LazyLoad>
          </div>
          <div>
            <LazyLoad>
              <MkdInput
                type="text"
                name="hostname"
                label="Hostname"
                disabled={true}
                errors={errors}
                register={register}
              />
            </LazyLoad>
          </div>
        </div>

        {/* <div className="flex w-full items-center justify-between gap-5">
          <LazyLoad>
            <MkdButton
              showPlus={false}
              onClick={onClose}
              className="!w-1/2 !bg-transparent !text-black"
            >
              Cancel
            </MkdButton>
          </LazyLoad>
        </div> */}
      </OfflineAwareForm>
    </div>
  );
};

export default AddWireframePage;
