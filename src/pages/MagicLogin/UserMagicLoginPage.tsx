import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContexts } from "@/hooks/useContexts";
import { useSDK } from "@/hooks/useSDK";

interface FormInputs {
  email: string;
}

const UserMagicLoginPage: React.FC = () => {
  const { sdk } = useSDK();
  const { showToast } = useContexts();

  const [attemptingLogin, setAttemptingLogin] = React.useState<boolean>(false);

  const params = useParams();

  const navigate = useNavigate();

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
  } = useForm<FormInputs>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormInputs): Promise<void> => {
    try {
      setAttemptingLogin(true);
      const result = await sdk.magicLoginAttempt(
        data.email,
        params?.role ?? ""
      );

      if (!result.error) {
        setAttemptingLogin(false);
        showToast("Please check your mail to complete login attempt");
      }
    } catch (error: any) {
      setAttemptingLogin(false);
      console.log("Error", error);
      setError("email", {
        type: "manual",
        message: error.message
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-xs">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-8 pt-6 pb-8 mt-8 mb-4 bg-white rounded shadow-md"
      >
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
              errors.email?.message ? "border-red-500" : ""
            }`}
          />
          <p className="text-xs italic text-red-500">{errors.email?.message}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded focus:shadow-outline hover:bg-blue-700 focus:outline-none"
          >
            {attemptingLogin ? "Attempting Log In..." : "Sign In"}{" "}
          </button>
        </div>
      </form>
      <p className="text-xs text-center text-gray-500">
        &copy; {new Date().getFullYear()} manaknightdigital inc. All rights
        reserved.
      </p>
    </div>
  );
};

export default UserMagicLoginPage;
