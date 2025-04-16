import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  GlobalContext,
  RequestItems,
  createRequest,
  customRequest,
  deleteRequest,
  setLoading,
  showToast,
  updateRequest
} from "@/context/Global";
` `;
import { AuthContext } from "@/context/Auth";
import { MkdInput } from "@/components/MkdInput";
import { InteractiveButton } from "@/components/InteractiveButton";

import { MkdButton } from "@/components/MkdButton";
import { RestAPIMethod } from "@/utils/types/types";
import { RestAPIMethodEnum } from "@/utils/Enums";

interface ActionConfirmationProps {
  data?: any;
  options?: {
    endpoint: string | null;
    method: RestAPIMethod | undefined;
    payload?: any;
  };
  onSuccess?: (result?: any) => void;
  onClose: () => void;
  multiple?: boolean;
  action?: string;
  mode?: string;
  customMessage?: string;
  table?: string;
  input?: string;
  disableCancel?: boolean;
  inputConfirmation?: boolean;
  role?: string;
}

export const ActionConfirmation = ({
  data,
  options = { endpoint: null, method: "GET", payload: null },
  onSuccess,
  onClose,
  multiple = false,
  action = "",
  mode = "create",
  customMessage = "",
  table = "",
  input = "input",
  disableCancel = false,
  inputConfirmation = true
}: ActionConfirmationProps) => {
  const schema = yup
    .object({
      ...(["input", "input_create"].includes(mode)
        ? {
            [input]: yup.string().required()
          }
        : {
            confirm: yup
              .string()
              .required()
              .oneOf([action], `Confirmation must be "${action}"`)
          })
    })
    .required();

  const {
    state: { createModel, updateModel, deleteModel },
    dispatch: globalDispatch
  } = React.useContext(GlobalContext);
  const { dispatch } = React.useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const formData = watch();

  const makeRequests = async () => {
    if (!["create", "update", "delete", "custom"].includes(mode)) {
      return showToast(
        globalDispatch,
        "Mode must be create, update, delete or custom",
        5000,
        "error"
      );
    }
    if (!Array.isArray(data)) {
      return showToast(globalDispatch, "Data must be an list", 5000, "error");
    }
    const requestPromise = data?.map((item) => requestMode(mode, item));
    const results = await Promise.all(requestPromise);
    if (results.some((result) => !result?.error) && onSuccess) {
      onSuccess();
    }
  };

  const requestMode = (mode: string, data: any) => {
    if (["create"].includes(mode)) {
      return createRequest(globalDispatch, dispatch, table, data, {
        allowToast: false
      });
    }
    if (["update"].includes(mode)) {
      return updateRequest(globalDispatch, dispatch, table, data?.id, data, {
        allowToast: false
      });
    }
    if (["delete"].includes(mode)) {
      return deleteRequest(globalDispatch, dispatch, table, data.id, {
        allowToast: false
      });
    }
    if (["custom"].includes(mode)) {
      return customRequest(
        globalDispatch,
        dispatch,
        {
          endpoint: options?.endpoint ?? "",
          method: options?.method ?? RestAPIMethodEnum.POST,
          payload: options?.payload ?? data,
          allowToast: false
        },
        RequestItems?.createModel
      );
    }
  };

  const editData = async (data: any) => {
    const result = await updateRequest(
      globalDispatch,
      dispatch,
      table,
      data?.id,
      data,
      {
        allowToast: false
      }
    );

    if (!result?.error && onSuccess) {
      onSuccess();
    }
  };

  const inputCreateData = async (data: any) => {
    const result = await createRequest(
      globalDispatch,
      dispatch,
      table,
      {
        ...data,
        [input]: formData?.[input as keyof typeof formData]
      },
      {
        allowToast: false
      }
    );

    if (!result?.error && onSuccess) {
      onSuccess({
        [input]: formData?.[input as keyof typeof formData],
        id: result?.data
      });
    }
  };

  const createData = async (data: any) => {
    if (action === "move") return moveRequest(data);
    const result = await createRequest(globalDispatch, dispatch, table, data, {
      allowToast: false
    });

    if (!result?.error && onSuccess) {
      onSuccess();
    }
  };

  const deleteData = async (data: any) => {
    const result = await deleteRequest(
      globalDispatch,
      dispatch,
      table,
      data.id,
      {
        allowToast: false
      }
    );

    if (!result?.error && onSuccess) {
      onSuccess();
    }
  };

  const customData = async (data: any) => {
    const result = await customRequest(
      globalDispatch,
      dispatch,
      {
        endpoint: options?.endpoint ?? "",
        method: options?.method ?? RestAPIMethodEnum.POST,
        payload: options?.payload ?? data,
        allowToast: false
      },
      RequestItems.createModel
    );

    if (
      result &&
      result?.hasOwnProperty("error") &&
      !result?.error &&
      onSuccess
    ) {
      onSuccess(result);
    }
  };
  const inputData = () => {
    const data = formData?.[input as keyof typeof formData];
    if (onSuccess) {
      onSuccess({ [input]: data });
    }
  };
  const manualData = (data: any) => {
    if (onSuccess) {
      onSuccess(data);
    }
  };
  const moveRequest = async (data: any) => {
    const result = await customRequest(
      globalDispatch,
      dispatch,
      {
        endpoint: "/v3/api/custom/qualitysign/inventory/move",
        method: "POST",
        payload: data
      },
      RequestItems.createModel
    );

    if (!result?.error && onSuccess) {
      onSuccess(result);
    }
  };
  const requests = {
    create: createData,
    input_create: inputCreateData,
    update: editData,
    delete: deleteData,
    custom: customData,
    manual: manualData,
    input: inputData
  };
  const onSubmit = async () => {
    if (multiple) {
      makeRequests();
    } else {
      const request = requests[mode as keyof typeof requests];
      return request(data);
    }
  };

  useEffect(() => {
    if (!inputConfirmation) {
      setValue("confirm", action);
    }
  }, [inputConfirmation]);

  useEffect(() => {
    setLoading(globalDispatch, false, RequestItems?.createModel);
    setLoading(globalDispatch, false, RequestItems?.updateModel);
    setLoading(globalDispatch, false, RequestItems?.deleteModel);
  }, []);

  return (
    // <div className={`px-5 ${multiple ? "flex justify-center" : ""}`}>
    <div className="mx-auto flex h-fit flex-col items-center justify-start rounded !font-inter leading-snug tracking-wide">
      <form
        className={`flex h-fit w-full flex-col text-start`}
        onSubmit={handleSubmit(onSubmit, (error) => {
          console.log("ERROR >>", error);
        })}
      >
        <div className="space-y-5">
          <div className="my-2">
            {customMessage ? (
              <div>{customMessage}</div>
            ) : (
              <div>
                <span>Are you sure you want to </span> {action}{" "}
                {(data?.id && data?.id?.length && data?.id?.length > 1) ||
                data?.length > 1
                  ? "these"
                  : "this"}{" "}
                {table?.split("_")?.join(" ")}?
              </div>
            )}
          </div>
          <div className={`!mb-10 ${inputConfirmation ? "" : "hidden"}`}>
            <MkdInput
              type={"text"}
              page={"items"}
              name={
                ["input", "input_create"].includes(mode) ? input : `confirm`
              }
              errors={errors}
              register={register}
              label={
                <div className="font-bold text-black">
                  Type{" "}
                  {["input", "input_create"].includes(mode)
                    ? ""
                    : `'${action}'`}{" "}
                  below
                </div>
              }
              className={"grow"}
            />
          </div>

          <div className="mt-5  flex w-full grow gap-5">
            {disableCancel ? null : (
              <MkdButton
                type="button"
                onClick={() => onClose()}
                disabled={
                  createModel?.loading ||
                  updateModel?.loading ||
                  deleteModel?.loading
                }
                className="grow self-end !border-soft-200 !bg-transparent font-bold !text-sub-500"
              >
                Cancel
              </MkdButton>
            )}
            <InteractiveButton
              type="submit"
              loading={
                createModel?.loading ||
                updateModel?.loading ||
                deleteModel?.loading
              }
              disabled={
                createModel?.loading ||
                updateModel?.loading ||
                deleteModel?.loading
              }
              className={`self-end rounded px-4 py-2 font-bold capitalize text-white ${
                disableCancel ? "!grow" : "!w-1/2"
              }`}
            >
              {action}
            </InteractiveButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActionConfirmation;
