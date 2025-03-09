import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContexts } from "@/hooks/useContexts";
import { MkdInput } from "@/components/MkdInput";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdButton } from "@/components/MkdButton";
import { InteractiveButton } from "@/components/InteractiveButton";
import { ToastStatusEnum } from "@/utils/Enums";
import { useEffect, useState } from "react";
import { MKD_DOMAIN } from "@/utils";
interface AddWireframePageProps {
  onClose: () => void;
  onSuccess: (e?: any) => void;
}

const AddWireframePage = ({ onClose, onSuccess }: AddWireframePageProps) => {
  const { showToast, tokenExpireError, create } = useContexts();

  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      name: yup
        .string()
        .matches(/^[a-zA-Z0-9 ]*$/, "Only strings and numbers are allowed")
        .required("name is required"),
      hostname: yup.string().required("hostname is required"),
      slug: yup.string().required("slug is required")
    })
    .required();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { slug } = watch();

  const onSubmit = async (_data: yup.InferType<typeof schema>) => {
    try {
      setLoading(true);
      const payload = {
        name: _data.name,
        slug: _data.slug,
        hostname: _data.hostname
      };

      const result = await create("project", payload, {
        allowToast: true
      });

      if (result?.error) {
        throw new Error(result?.message);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setError("slug", {
        type: "manual",
        message: error.message
      });
      showToast(error.message, 4000, ToastStatusEnum.ERROR);
      tokenExpireError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hostname = `${slug ? slug : "<slug>"}.${MKD_DOMAIN}`;
    setValue("hostname", hostname);
  }, [slug]);

  return (
    <div className="h-full w-full">
      <form
        className="grid h-full max-h-full min-h-full w-full grid-rows-[1fr_auto] p-4 text-left"
        onSubmit={handleSubmit(onSubmit)}
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

        <div className="flex w-full items-center justify-between gap-5">
          <LazyLoad>
            <MkdButton
              showPlus={false}
              onClick={onClose}
              disabled={loading}
              className="!w-1/2 !bg-transparent !text-black"
            >
              Cancel
            </MkdButton>
          </LazyLoad>
          <LazyLoad>
            <InteractiveButton
              type="submit"
              disabled={loading}
              loading={loading}
              className="!w-1/2"
            >
              Submit
            </InteractiveButton>
          </LazyLoad>
        </div>
      </form>
    </div>
  );
};

export default AddWireframePage;
