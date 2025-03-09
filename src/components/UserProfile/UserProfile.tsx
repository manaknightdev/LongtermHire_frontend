import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InteractiveButton } from "@/components/InteractiveButton";
import { LazyLoad } from "@/components/LazyLoad";
import { useProfile } from "@/hooks/useProfile";
import { MkdInput } from "@/components/MkdInput";
import { UpdatePasswordModal } from "./index";
import { useSDK } from "@/hooks/useSDK";
import { Title } from "@/components/Title";
import { Container } from "@/components/Container";
import { MkdButton } from "@/components/MkdButton";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";
import { useContexts } from "@/hooks/useContexts";

const UserProfile = ({}) => {
  const { sdk } = useSDK();

  const [oldEmail, setOldEmail] = useState("");
  const [fileObj, setFileObj] = React.useState({}) as any;
  const [oldPhoto, setOldPhoto] = useState("");
  const [dashboardImage, setDashboardImage] = useState("");
  const [_uploadedPhoto, _setUploadedPhoto] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [defaultValues, setDefaultValues] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    photo: "",
    dashboard_image: "",
    company_name: ""
  });

  const [states, setStates] = useState({
    showModal: false,
    modal: ""
  });

  const { profile } = useProfile();

  const {
    authDispatch: dispatch,
    globalDispatch,
    tokenExpireError,
    showToast,
    update: updateRequest,
    setGlobalState: setGLobalProperty
  } = useContexts();

  const schema = yup
    .object({
      email: yup.string().email().required(),
      first_name: yup.string().nullable(),
      last_name: yup.string().nullable(),
      phone: yup.string().nullable(),
      photo: yup.string().nullable(),
      dashboard_image: yup.string().nullable(),
      company_name: yup.string().nullable()
      // division: yup.string().nullable(),
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

  const { dashboard_image, photo: profile_image } = watch();

  // const removeItem = (index: any, name: string | number, multiple = false) => {
  //   let tempFileObj = fileObj;

  //   if (multiple) {
  //     let tempFiles = tempFileObj[name];
  //     tempFiles.splice(index, 1);
  //     tempFileObj[name] = [...tempFiles];
  //   } else {
  //     tempFileObj[name] = null;
  //   }

  //   setFileObj({ ...tempFileObj });
  // };

  const previewImage = (
    field: string | number,
    target: any,
    multiple = false
  ) => {
    let tempFileObj = fileObj as any;
    // console.log(target);
    if (multiple) {
      if (tempFileObj[field]) {
        tempFileObj[field] = [
          ...tempFileObj[field],
          {
            file: target.files[0],
            tempFile: {
              url: URL.createObjectURL(target.files[0]),
              name: target.files[0]?.name ?? "",
              type: target.files[0]?.type ?? ""
            }
          }
        ];
      } else {
        tempFileObj[field] = [
          {
            file: target.files[0],
            tempFile: {
              url: URL.createObjectURL(target.files[0]),
              name: target.files[0].name,
              type: target.files[0].type
            }
          }
        ];
      }
    } else {
      tempFileObj[field] = {
        file: target.files[0],
        name: target.files[0].name,
        type: target.files[0].type,
        tempURL: URL.createObjectURL(target.files[0])
      };
    }
    setFileObj({ ...tempFileObj });
  };
  // const updateAssets = (field: string | number, data: any[], multiple = false) => {
  //   let tempFileObj = { ...fileObj };
  //   if (multiple) {
  //     if (tempFileObj[field]) {
  //       tempFileObj[field] = [
  //         ...tempFileObj[field],
  //         ...data.map((item: any) => ({ file: null, tempFile: item })),
  //       ];
  //     } else {
  //       tempFileObj[field] = [
  //         ...data.map((item: any) => ({ file: null, tempFile: item })),
  //       ];
  //     }
  //   } else {
  //     tempFileObj[field] = {
  //       file: null,
  //       tempURL: data,
  //     };
  //   }
  //   setFileObj(() => ({ ...tempFileObj }));
  // };

  async function fetchData() {
    try {
      const result = await sdk.getProfile();

      setDefaultValues(
        () =>
          ({
            ...result?.model,
            role: result?.model?.role ?? result?.model?.role_id
          }) as any
      );
      setValue("email", result?.model?.email);
      setValue("first_name", result?.model?.first_name);
      setValue("last_name", result?.model?.last_name);
      setValue("phone", result?.model?.phone);
      setValue("dashboard_image", result?.model?.dashboard_image);
      setValue("photo", result?.model?.photo);
      setOldEmail(result?.model?.email);
      setOldPhoto(result?.model?.photo);
      setDashboardImage(result?.model?.dashboard_image);
      dispatch({
        type: "UPDATE_PROFILE",
        payload: {
          ...result?.model,
          role: result?.model?.role ?? result?.model?.role_id
        }
      });
    } catch (error: any) {
      console.log("Error", error);
      tokenExpireError(
        error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    setDefaultValues(data as any);
    try {
      setSubmitLoading(true);

      if (fileObj && fileObj["photo"] && fileObj["photo"]?.file) {
        let formData = new FormData();
        formData.append("file", fileObj["photo"]?.file);
        let uploadResult = await sdk.uploadImage(formData);
        console.log("uploadResult");
        console.log(uploadResult);
        data["photo"] = uploadResult.url;
        showToast("Profile Photo Updated", 1000);
      }
      if (
        fileObj &&
        fileObj["dashboard_image"] &&
        fileObj["dashboard_image"]?.file
      ) {
        let formData = new FormData();
        formData.append("file", fileObj["dashboard_image"]?.file);
        let uploadResult = await sdk.uploadImage(formData);
        console.log("uploadResult");
        console.log(uploadResult);
        data["dashboard_image"] = uploadResult.url;
        showToast("Profile Photo Updated", 1000);
      }
      const result = await sdk.updateProfile({
        first_name: data.first_name || defaultValues?.first_name,
        last_name: data.last_name || defaultValues?.last_name,
        phone: data.phone || defaultValues?.phone,
        // company: data.company || defaultValues?.company,
        photo: data.photo || oldPhoto,
        dashboard_image: data.dashboard_image || dashboardImage
      });
      const userUpdateResult = await updateRequest(
        "user",
        profile?.id,
        {
          first_name: data.first_name || defaultValues?.first_name,
          last_name: data.last_name || defaultValues?.last_name,
          phone: data.phone || defaultValues?.phone,
          photo: data.photo || oldPhoto
        },
        { allowToast: false }
      );

      if (!userUpdateResult.error) {
        showToast("Profile Updated", 4000);
        closeModal();
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
        closeModal();
      }
      if (oldEmail !== data.email) {
        const emailresult = await sdk.updateEmail(data.email);
        if (!emailresult.error) {
          showToast("Email Updated", 1000);
        } else {
          if (emailresult.validation) {
            const keys = Object.keys(emailresult.validation);
            for (let i = 0; i < keys.length; i++) {
              const field = keys[i];
              setError(field as any, {
                type: "manual",
                message: emailresult.validation[field]
              });
            }
          }
        }
        closeModal();
      }

      await fetchData();
      setSubmitLoading(false);
    } catch (error: any) {
      setSubmitLoading(false);
      console.log("Error", error);
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

  React.useEffect(() => {
    globalDispatch({
      type: "SETPATH",
      payload: {
        path: "profile"
      }
    });

    fetchData();
  }, []);

  const closeModal = () => {
    setStates((prev) => ({
      ...prev,
      modal: "",
      showModal: false
    }));
  };

  React.useEffect(() => {
    setGLobalProperty("backpanel", "headerType");
    setGLobalProperty("Profile", "pageTitle");
    if (["user"].includes(profile?.role)) {
      setValue("company_name", profile?.company_name);
    }
  }, [profile?.role]);

  return (
    <>
      <div className="mx-auto flex h-full max-h-full min-h-full flex-col items-center justify-start gap-5 overflow-auto rounded bg-soft-200 !font-inter leading-snug tracking-wide shadow-md md:p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"!px-2 !w-full space-y-5 md:!w-[75%]"}
        >
          <Container>
            {["user"].includes(profile?.role) && (
              <section className="space-y-5">
                <div>
                  <ProfileImageUpload
                    image={
                      fileObj?.dashboard_image?.tempURL ||
                      dashboard_image ||
                      dashboardImage
                    }
                    title="Dashboard Logo"
                    name={"dashboard_image"}
                    onUpload={previewImage}
                  />
                </div>
                <div className="grid grid-cols-1 gap-[1.5rem] md:grid-cols-4">
                  <MkdInput
                    label={"Company"}
                    name={"company_name"}
                    register={register}
                    errors={errors}
                    disabled={true}
                  />
                </div>
                <hr />
              </section>
            )}
            <section className="grid grid-cols-1 gap-[1.5rem] ">
              <Title className={"!border-0 !p-0 !shadow-none "}>
                {" "}
                User Details{" "}
              </Title>

              <div>
                <ProfileImageUpload
                  image={fileObj?.photo?.tempURL || profile_image || oldPhoto}
                  title="Profile Image"
                  name={"photo"}
                  onUpload={previewImage}
                />
              </div>

              <div className="grid grid-cols-1 gap-[1.5rem] md:grid-cols-4">
                <MkdInput
                  label={"First Name"}
                  name={"first_name"}
                  register={register}
                  errors={errors}
                />
                <MkdInput
                  label={"Last Name"}
                  name={"last_name"}
                  register={register}
                  errors={errors}
                />
              </div>
              <div className="grid grid-cols-1 gap-[1.5rem] md:grid-cols-4">
                <MkdInput
                  label={"Phone"}
                  name={"phone"}
                  register={register}
                  errors={errors}
                />
                <MkdInput
                  label={"Email"}
                  name={"email"}
                  register={register}
                  errors={errors}
                />
              </div>
              <LazyLoad>
                <MkdButton
                  className={`!shadow-none w-fit !border-0 !bg-white font-[700] !text-primary`}
                  onClick={() => {
                    setStates((prev) => ({
                      ...prev,
                      modal: "password",
                      showModal: true
                    }));
                  }}
                >
                  Change Password
                </MkdButton>
              </LazyLoad>
            </section>
          </Container>

          <Container className={"!bg-transparent !shadow-none !p-0"}>
            <InteractiveButton
              type="submit"
              loading={submitLoading}
              disabled={submitLoading}
              className="w-full rounded px-4 py-2  font-bold text-white md:w-[auto]"
            >
              Save Changes
            </InteractiveButton>
          </Container>
        </form>
      </div>

      <UpdatePasswordModal
        isOpen={states.showModal && ["password"].includes(states.modal)}
        onClose={closeModal}
      />
    </>
  );
};

export default UserProfile;
