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

  const socialLogin = async (type: string) => {
    const result = await sdk.oauthLoginApi(type, RoleEnum.SUPER_ADMIN);
    window.open(result, "_self"); //  "sharer",  "toolbar=0,status=0,width=650,height=400,"
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
          <div className="w-full text-[1rem] text-[#525252] text-center">
            {/* OR */}
          </div>

          <div className="oauth mt-2 flex w-full flex-col gap-[2rem] text-[#344054] ">
            <button
              onClick={() => socialLogin("google")}
              className="my-2 flex h-[2.75rem] min-w-[70%] cursor-pointer items-center justify-center gap-3 rounded-sm border-2  px-4"
            >
              <img
                src={
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALpSURBVHgBtVbNTxNBFH8zuy3QoN0YJMEQs8QQP05LAsbEg4uRxMSD4AeaeLB6xEPhpIkm4MF4IsG/oODF4Edajgahy8UDxbAcjDEc2IORCIlUhVK6u/OcKbVpaZdWxN+lkzd9v9+b9968WQK7YEnXlYPSxm0GqCMQjZtUYScASUSw+NJwGU40GXOGFwfxIg7IqX6KGEYABSqCWBmKPc2TCbOiwEpXhwaMRAFQhb+Ei/i4aXpuyFNAkBMG8eqiLoVIG2N2Z5NhWiUCyxfPqLLtznuTYxKQWIRk869wT60SuYD8ZyHZrGzk3NGkCP3r6Cy0GGYyH5CuqRL1DXKhkBd5/gRrfa0h+7MSKQ0aRhqnEwOwC1YvtOuO41jlyPMCzpRvKT3boKbeNRdsYOzw1FwP/COoPSnriKjWdKxCsO8j0GAmm0/HdQZgHyADhXM8FdtqnPzArUVIv280gsOWVc5BH9xUoWrUJkWRi7pBiAQufRmF4fIukt+N8Hh0qAYsNUoBSztHRtmCfQASVCn8Z1BCiLXT6DJbg32CzPhFKpwXv9AHkY3jOoA5Uc6B53+Mn90o2SBi0mKo2MS5RZvyVVwYFp0g3P95GpbdQNJJuy3mnVgSqsT5JxuRnQKMQYj6uhyDr5Pjm8fg3o+zsMwCQlqR66RIteT6082S6LNw7BlJ/EpX22ufp1r1DEiF2yeOXDupfH396W0lcopMZKCoG/llNYzB4LN8+tvHr8zz3JYUl48MPkHJ0OyNN2NFxJFuZb1W7pfSp8J1K3cV6jQU+aHk1+IP/At5Ae3FTVWm9ny5e5FT4uMasi8WL7RKcs+nALUboO5bGKStozl2GJl+VD+w7VaAjpfXNRTHxb09OP61Hqj53m3GH9a35cUL/5DofWU6zNfGI7RgD9g6FI1hxu4stJV99LVotyJnaJjXZAiqAPI6Aa/Thx118hTIC/G6UMjolJLL2Y+AXBMgr4coPmc2CMVYojc648XxG0ZrPRAMMnAhAAAAAElFTkSuQmCC"
                }
                className="h-[18px] w-[18px]"
              />
              <span className="text-[1rem] text-[#525252] font-[600]">
                Sign in With Google
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginPage;
