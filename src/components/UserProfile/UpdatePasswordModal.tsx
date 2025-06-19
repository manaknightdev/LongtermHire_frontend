import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { InteractiveButton } from "@/components/InteractiveButton";
import { Modal } from "@/components/Modal";

import { MkdButton } from "@/components/MkdButton";
import { MkdPasswordInput } from "@/components/MkdPasswordInput";
import { StringCaser } from "@/utils/utils";
import { useSDK } from "@/hooks/useSDK";

import { useContexts } from "@/hooks/useContexts";
import { ToastStatusEnum } from "@/utils/Enums";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePasswordModal = ({
  isOpen = false,
  onClose
}: UpdatePasswordModalProps) => {
  const stringCaser = new StringCaser();
  const { sdk } = useSDK();

  const { tokenExpireError, showToast } = useContexts();

  const schema = yup
    .object({
      password: yup
        .string()
        .required()
        .min(8)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message:
              "Password must be at least 8 characters long, Contain at least one uppercase letter, One lowercase letter, One number, one number and one special character."
          }
        ),
      confirm: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match")
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

  const onSubmit = useCallback(
    async (_data: any) => {
      try {
        if (_data?.password && _data?.password?.length > 0) {
          const passwordresult = await sdk.updatePassword(_data.password);
          if (!passwordresult.error) {
            showToast("Password Updated", 5000, ToastStatusEnum.SUCCESS);
          } else {
            if (passwordresult.validation) {
              const keys = Object.keys(passwordresult.validation);
              for (let i = 0; i < keys.length; i++) {
                const field = keys[i];
                setError(field as any, {
                  type: "manual",
                  message: passwordresult.validation[field]
                });
              }
            }
          }
        }
      } catch (error: any) {
        const message = error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message;
        showToast(message, 5000, ToastStatusEnum.ERROR);
        tokenExpireError(message);
      }
    },
    [sdk, setError, showToast, tokenExpireError]
  );
  // md:min-h-[90%] md:h-[90%] md:max-h-[90%] max-h-[90%] min-h-[90%]
  return (
    <>
      <Modal
        isOpen={isOpen}
        modalCloseClick={() => onClose && onClose()}
        title="Edit Password"
        modalHeader
        classes={{
          modalDialog:
            "!grid grid-rows-[auto_90%] !gap-0 !w-full !px-0 md:!w-[25.125rem] !h-fit grid-rows-[auto_auto]",
          modalContent: `!z-10 !px-0 overflow-hidden !pt-0 !mt-0`,
          modal: "h-full"
        }}
      >
        <div className={`h-full min-h-full p-5`}>
          {isOpen ? (
            <>
              <form
                className={`relative mx-auto grid h-full max-h-full min-h-full w-full grow grid-cols-1 grid-rows-[75%_20%] gap-5 rounded text-start !font-inter leading-snug tracking-wide`}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex w-full flex-col gap-5">
                  <div>
                    <MkdPasswordInput
                      name={"password"}
                      label={"Password"}
                      // errors={errors}
                      register={register}
                      containerClassName={"grow"}
                    />
                    {errors && errors?.password && (
                      <p className="text-field-error m-auto mt-2 text-[.8rem] italic text-red-500">
                        {errors?.password?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <MkdPasswordInput
                      name={"confirm"}
                      label={"Confirm Password"}
                      // errors={errors}
                      register={register}
                      containerClassName={"grow"}
                    />
                    {errors && errors?.confirm && (
                      <p className="text-field-error m-auto mt-2 text-[.8rem] italic text-red-500">
                        {stringCaser.Capitalize(
                          errors?.confirm?.message as string,
                          {
                            separator: " "
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex w-full gap-5">
                  <MkdButton
                    onClick={() => onClose()}
                    className={`!grow !border-none !bg-white !text-black`}
                  >
                    Cancel
                  </MkdButton>
                  <InteractiveButton
                    type="submit"
                    // loading={updateModel?.loading}
                    // disabled={updateModel?.loading}
                    className="!grow px-4 py-2 font-bold capitalize text-white"
                  >
                    Update Password
                  </InteractiveButton>
                </div>
              </form>
            </>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default UpdatePasswordModal;
