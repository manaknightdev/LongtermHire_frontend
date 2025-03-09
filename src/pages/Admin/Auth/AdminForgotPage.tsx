import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { InteractiveButton } from "@/components/InteractiveButton";
import { useContexts } from "@/hooks/useContexts";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdInput } from "@/components/MkdInput";
import { useSDK } from "@/hooks/useSDK";

const AdminForgotPage = () => {
  const { sdk } = useSDK();
  const { showToast, tokenExpireError } = useContexts();

  const [submitLoading, setSubmitLoading] = useState(false);

  const schema = yup
    .object({
      email: yup.string().email().required()
    })
    .required();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      setSubmitLoading(true);
      const result = await sdk.forgot(data.email);

      if (!result.error) {
        showToast("Reset Code Sent");
      } else {
        if (result.validation) {
          const keys = Object.keys(result.validation);
          for (let i = 0; i < keys.length; i++) {
            const field = keys[i];
            setError(field as "email", {
              type: "manual",
              message: result.validation[field]
            });
          }
        }
      }
      setSubmitLoading(false);
    } catch (error: any) {
      setSubmitLoading(false);
      setError("email", {
        type: "manual",
        message: error.response.data.message
          ? error.response.data.message
          : error.message
      });
      tokenExpireError(
        error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-xs">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 mt-8 rounded bg-white px-8 pb-8 pt-6 shadow-md "
        >
          <div className="mb-4">
            <LazyLoad>
              <MkdInput
                name="email"
                type="text"
                errors={errors}
                register={register}
                label={"Email"}
              />
            </LazyLoad>
          </div>

          <div className="flex items-center justify-between">
            <InteractiveButton
              className="focus:shadow-outline rounded bg-primaryBlue px-4 py-2 font-bold text-white focus:outline-none disabled:cursor-not-allowed"
              type="submit"
              loading={submitLoading}
              disabled={submitLoading}
            >
              Forgot Password
            </InteractiveButton>
            <Link
              className="inline-block align-baseline text-sm font-bold text-primaryBlue"
              to={`/admin/login`}
            >
              Login?
            </Link>
          </div>
        </form>
        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} manaknightdigital inc. All rights
          reserved.
        </p>
      </div>
    </>
  );
};

export default AdminForgotPage;
