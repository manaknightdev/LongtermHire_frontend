import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InteractiveButton } from "@/components/InteractiveButton";
import { LoginBgNew } from "@/assets/images";
import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum, RoleEnum } from "@/utils/Enums";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdInput } from "@/components/MkdInput";
import { useSDK } from "@/hooks/useSDK";
import { MkdPasswordInput } from "@/components/MkdPasswordInput";

interface AdminLoginPageProps {
  role?: string;
}

const AdminLoginPage = ({
  role = RoleEnum.SUPER_ADMIN
}: AdminLoginPageProps) => {
  const { sdk } = useSDK();

  const { authDispatch: dispatch, showToast } = useContexts();

  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect_uri = searchParams.get("redirect_uri");

  const navigate = useNavigate();

  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().required()
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
      const result = await sdk.login(data.email, data.password, role);

      console.log("result", result);
      if (!result.error) {
        dispatch({
          type: "LOGIN",
          payload: result as any
        });
        showToast("Succesfully Logged In", 4000, ToastStatusEnum.SUCCESS);
        navigate(redirect_uri ?? `/admin/build`);
      } else {
        setSubmitLoading(false);
        if (result.validation) {
          const keys = Object.keys(result.validation);
          for (let i = 0; i < keys.length; i++) {
            const field = keys[i];
            setError(field as "email" | "password", {
              type: "manual",
              message: result.validation[field]
            });
          }
        }
      }
    } catch (error: any) {
      setSubmitLoading(false);
      showToast(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message,
        4000,
        ToastStatusEnum.ERROR
      );
      setError("email", {
        type: "manual",
        message: error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message
      });
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${LoginBgNew})` }}
    >
      <div className="flex min-h-full grow flex-col items-center justify-center">
        <div className="my-12 flex w-[90%] flex-col items-center rounded-lg border  border-[#a8a8a8] p-6 shadow-md md:w-[22.8125rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M12.5 2C10.0147 2 8 4.01472 8 6.5C8 8.98528 10.0147 11 12.5 11C14.9853 11 17 8.98528 17 6.5C17 4.01472 14.9853 2 12.5 2Z"
              fill="#4F46E5"
            />
            <path
              d="M12.5004 12.5C8.3271 12.5 5.27345 15.2936 4.4402 19.0013C4.19057 20.112 5.10014 21 6.09882 21H18.902C19.9007 21 20.8102 20.112 20.5606 19.0013C19.7274 15.2936 16.6737 12.5 12.5004 12.5Z"
              fill="#4F46E5"
            />
          </svg>
          <div className="my-2 text-xl font-semibold text-[#262626]">
            Welcome Back
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-1 text-[#525252]">Don’t have account? </span>{" "}
            <Link to={`/admin/sign-up`} className="text-[#4F46E5]">
              Sign up here
            </Link>
          </div>

          <form className="w-full max-w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 flex flex-col text-sm">
              <LazyLoad>
                <MkdInput
                  type="email"
                  label="Email"
                  name="email"
                  placeholder="admin@mail.com"
                  register={register}
                  errors={errors}
                />
              </LazyLoad>
            </div>
            <div className="flex flex-col text-sm">
              <LazyLoad>
                <MkdPasswordInput
                  required
                  name="password"
                  label="Password"
                  errors={errors}
                  register={register}
                />
              </LazyLoad>
            </div>
            <div className="my-2 flex justify-between text-sm">
              <div className="flex items-center text-[#525252]">
                <label
                  className={`flex h-[1.5rem] items-center justify-center gap-3 py-1 text-black`}
                >
                  <input
                    type="checkbox"
                    className={`h-[1.5rem] w-[1.5rem] cursor-pointer rounded-[0.5rem]  text-[#4F46E5] accent-[#4F46E5] outline-0 focus:outline-none focus:ring-0`}
                  />
                  <div className="h-full cursor-pointer">Remember me</div>
                </label>
              </div>
              <Link to={`/admin/forgot`} className="text-[#4F46E5]">
                Forgot password
              </Link>
            </div>
            <InteractiveButton
              type="submit"
              className={`my-12 flex w-full items-center justify-center rounded-md bg-[#4F46E5] py-2 tracking-wide text-white  outline-none focus:outline-none`}
              loading={submitLoading}
              disabled={submitLoading}
            >
              Sign in
            </InteractiveButton>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginPage;
{
  /* <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.99998 3.33337C13.5326 3.33335 16.9489 5.50937 19.0735 9.61715L19.2715 10L19.0735 10.3828C16.9489 14.4906 13.5326 16.6667 10 16.6667C6.46737 16.6667 3.05113 14.4907 0.926472 10.3829L0.728455 10.0001L0.926472 9.61724C3.05113 5.50946 6.46736 3.3334 9.99998 3.33337ZM7.08333 10C7.08333 8.38921 8.38917 7.08337 10 7.08337C11.6108 7.08337 12.9167 8.38921 12.9167 10C12.9167 11.6109 11.6108 12.9167 10 12.9167C8.38917 12.9167 7.08333 11.6109 7.08333 10Z"
                        fill="#A8A8A8"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.28033 2.21967C2.98744 1.92678 2.51256 1.92678 2.21967 2.21967C1.92678 2.51256 1.92678 2.98744 2.21967 3.28033L5.38733 6.44799C4.04329 7.533 2.8302 8.97021 1.81768 10.7471C1.37472 11.5245 1.37667 12.4782 1.81881 13.2539C3.74678 16.6364 6.40456 18.789 9.29444 19.6169C12.0009 20.3923 14.8469 19.9857 17.3701 18.4308L20.7197 21.7803C21.0126 22.0732 21.4874 22.0732 21.7803 21.7803C22.0732 21.4874 22.0732 21.0126 21.7803 20.7197L3.28033 2.21967ZM14.2475 15.3082L13.1559 14.2166C12.81 14.3975 12.4167 14.4995 11.9991 14.4995C10.6184 14.4995 9.49911 13.3802 9.49911 11.9995C9.49911 11.5819 9.60116 11.1886 9.78207 10.8427L8.69048 9.75114C8.25449 10.3917 7.99911 11.1662 7.99911 11.9995C7.99911 14.2087 9.78998 15.9995 11.9991 15.9995C12.8324 15.9995 13.6069 15.7441 14.2475 15.3082Z"
                        fill="#A8A8A8"
                      />
                      <path
                        d="M19.7234 16.5416C20.5189 15.7335 21.2556 14.7869 21.9145 13.7052C22.5512 12.66 22.5512 11.34 21.9145 10.2948C19.3961 6.16075 15.7432 4.00003 11.9999 4C10.6454 3.99999 9.30281 4.28286 8.02148 4.83974L19.7234 16.5416Z"
                        fill="#A8A8A8"
                      />
                    </svg>
                  )}
                </span> */
}
