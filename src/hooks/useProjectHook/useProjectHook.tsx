import { useCreateModelMutation } from "@/query/shared";
import { ToastStatusEnum } from "@/utils/Enums";
import { useEffect } from "react";
import { MKD_DOMAIN } from "@/utils";
import { Models } from "@/utils/baas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContexts } from "@/hooks/useContexts";

interface UseProjectHookProps {
  onSuccess?: (e?: any) => void;
}

export const useProjectHook = ({ onSuccess }: UseProjectHookProps) => {
  const { mutateAsync: createProject, isPending } = useCreateModelMutation(
    Models.PROJECT
  );

  const { showToast, tokenExpireError } = useContexts();

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
      const payload = {
        name: _data.name,
        slug: _data.slug,
        hostname: _data.hostname
      };

      const result = await createProject(payload);

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
    }
  };

  useEffect(() => {
    const hostname = `${slug ? slug : "<slug>"}.${MKD_DOMAIN}`;
    setValue("hostname", hostname);
  }, [slug]);

  return {
    errors,
    register,
    handleSubmit,
    onSubmit,
    isPending
  };
};
