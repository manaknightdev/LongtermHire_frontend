import * as yup from "yup";
import { useState } from "react";
import { useSDK } from "@/hooks/useSDK";
import { useForm } from "react-hook-form";
import { useContexts } from "@/hooks/useContexts";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { InteractiveButton } from "@/components/InteractiveButton";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdInput } from "@/components/MkdInput";
import { MkdPasswordInput } from "@/components/MkdPasswordInput";

const AdminResetPage = ({}) => {
  const { sdk } = useSDK();

  const { tokenExpireError, showToast } = useContexts();

  const [submitLoading, setSubmitLoading] = useState(false);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const schema = yup
    .object({
      code: yup.string().required(),
      password: yup.string().required(),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), undefined], "Passwords must match")
    })
    .required();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    if (!token) {
      return showToast("Invalid token");
    }

    try {
      setSubmitLoading(true);
      const result = await sdk.reset(token, data.code, data.password);
      if (!result.error) {
        showToast("Password Reset");
        setTimeout(() => {
          navigate(`/admin/login`);
        }, 2000);
      } else {
        if (result.validation) {
          const keys = Object.keys(result.validation);
          for (let i = 0; i < keys.length; i++) {
            const field = keys[i];
            setError(field as any, {
              type: "manual",
              message: result.validation[field]
            });
          }
        }
      }
      setSubmitLoading(false);
    } catch (error: any) {
      setSubmitLoading(false);
      setError("code", {
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
                name="code"
                type="text"
                errors={errors}
                register={register}
                label={"Code"}
                required={true}
                placeholder={"Enter Code"}
              />
            </LazyLoad>
          </div>
          <div className="mb-6">
            <LazyLoad>
              <MkdPasswordInput
                required
                name="password"
                errors={errors}
                label="Password"
                register={register}
              />
            </LazyLoad>
          </div>
          <div className="mb-6">
            <LazyLoad>
              <MkdPasswordInput
                required
                errors={errors}
                register={register}
                name="confirmPassword"
                label="Confirm Password"
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
              Reset Password
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

export default AdminResetPage;
