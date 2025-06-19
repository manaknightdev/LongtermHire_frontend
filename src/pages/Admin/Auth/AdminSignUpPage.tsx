import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContexts } from "@/hooks/useContexts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSDK } from "@/hooks/useSDK";
import { RoleEnum, ToastStatusEnum } from "@/utils/Enums";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InteractiveButton } from "@/components/InteractiveButton";
import { MkdInput } from "@/components/MkdInput";
import { LazyLoad } from "@/components/LazyLoad";
import { MkdPasswordInput } from "@/components/MkdPasswordInput";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface AdminSignUpProps {
  role?: string;
}

const AdminSignUpPage = ({ role = RoleEnum.SUPER_ADMIN }: AdminSignUpProps) => {
  const { sdk } = useSDK();
  const { state } = useTheme();
  const mode = state?.theme;

  const { authDispatch: dispatch, showToast } = useContexts();

  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect_uri = searchParams.get("redirect_uri");

  const navigate = useNavigate();

  const schema = yup
    .object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })
    .required();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    try {
      setSubmitLoading(true);
      const result = await sdk.register(data.email, data.password, role);

      if (!result.error) {
        dispatch({
          type: "LOGIN",
          payload: result as any,
        });

        showToast("Succesfully Registered", 4000, ToastStatusEnum.SUCCESS);
        navigate(redirect_uri ?? `/admin/dashboard`);
      } else {
        setSubmitLoading(false);
        if (result.validation) {
          const keys = Object.keys(result.validation);
          for (let i = 0; i < keys.length; i++) {
            const field = keys[i];
            setError(field as any, {
              type: "manual",
              message: result.validation[field],
            });
          }
        }
      }
    } catch (error: any) {
      setSubmitLoading(false);
      showToast(error?.message, 4000, ToastStatusEnum.ERROR);
      setError("email", {
        type: "manual",
        message: error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message,
      });
    }
  };

  const containerStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
  };

  const cardStyles = {
    backgroundColor: THEME_COLORS[mode].BACKGROUND,
    borderColor: THEME_COLORS[mode].BORDER,
    boxShadow: `0 10px 15px -3px ${THEME_COLORS[mode].SHADOW}20, 0 4px 6px -2px ${THEME_COLORS[mode].SHADOW}10`,
  };

  return (
    <div
      className="m-auto flex justify-center items-center w-full h-full max-h-full min-h-full transition-colors duration-200"
      style={containerStyles}
    >
      <div
        className="my-12 flex w-[90%] flex-col items-center rounded-lg border p-6 transition-all duration-200 md:w-[22.8125rem]"
        style={cardStyles}
      >
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
          Register
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

          <InteractiveButton
            type="submit"
            className={`my-12 flex w-full items-center justify-center rounded-md bg-[#4F46E5] py-2 tracking-wide text-white  outline-none focus:outline-none`}
            loading={submitLoading}
            disabled={submitLoading}
          >
            Register
          </InteractiveButton>
          <div>
            <h3 className="text-center text-sm normal-case text-gray-800">
              Already have an account?{" "}
              <Link
                className="my-text-gradient mb-8 self-end text-sm font-semibold"
                to={`/admin/login`}
              >
                Login{" "}
              </Link>{" "}
            </h3>
          </div>
        </form>
        <div className="oauth flex w-full max-w-md grow flex-col gap-4 px-6 text-[#344054]">
          <p className="h-10 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} manaknightdigital inc. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* <section
          className="hidden w-1/2 md:block"
          style={{
            backgroundImage:
              "url(https://ergo.manaknightdigital.com/login-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></section> */}
    </div>
  );
};

export default AdminSignUpPage;
