import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router";
import { useContexts } from "@/hooks/useContexts";
import { updatedRolesFn } from "@/utils/utils";
import { RoleEnum } from "@/utils/Enums";

let modalTimeout: any;

export default function SessionExpiredModal() {
  const { authState: state, authDispatch: dispatch } = useContexts();

  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const role = state?.role as RoleEnum;
  const sessionExpired = state?.sessionExpired;

  const logout = () => {
    dispatch({ type: "SESSION_EXPIRED", payload: false });
    dispatch({ type: "LOGOUT" });
    if (role) {
      navigate(
        `${updatedRolesFn(role, location)}/login?redirect_uri=${pathname}`
      );
    } else {
      navigate(`/login?redirect_uri=${pathname}`);
    }
    clearTimeout(modalTimeout as any);
  };

  useEffect(() => {
    if (sessionExpired) {
      modalTimeout = setTimeout(() => {
        logout();
      }, 4000);
    }
  }, [sessionExpired]);

  if (!sessionExpired) return null;

  return (
    <div className="relative min-h-svh max-h-svh h-svh w-full">
      <Transition appear show={true} as={Fragment}>
        <Dialog as="div" className="relative z-[99999999]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Session Expired
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your current login session has expired. Redirecting to
                      login page shortly
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => logout()}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
