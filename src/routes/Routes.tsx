import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
// import { AuthContext } from "@/context/Auth";
// import { GlobalContext } from "@/context/Global";

import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoutes";
import { PublicWrapper } from "@/components/PublicWrapper";
import { NotFoundPage } from "@/pages/404";
import { SnackBar } from "@/components/SnackBar";
import { SessionExpiredModal } from "@/components/SessionExpiredModal";

// generatePagesRoutes
import { AdminWrapper } from "@/components/AdminWrapper";

import {
  AdminForgotPage,
  AdminLoginPage,
  AdminProfilePage,
  AdminResetPage,
  LandingPage,
  MagicLoginVerifyPage,
  UserMagicLoginPage,
  ListAdminWireframeTablePage,
  AdminSignUpPage,
  TestComponents,
} from "./LazyLoad";

import EditWireframePage from "@/pages/Admin/Edit/EditWireframePage";
import { useContexts } from "@/hooks/useContexts";
import { RoleEnum } from "@/utils/Enums";
import { LazyLoad } from "@/components/LazyLoad";
import { RouteChangeModal } from "@/components/RouteChangeModal";

export interface DynamicWrapperProps {
  isAuthenticated?: boolean;
  role?: RoleEnum;
  children: React.ReactNode;
}

export const DynamicWrapper: React.FC<DynamicWrapperProps> = ({
  isAuthenticated,
  role,
  children,
}) => {
  if (!isAuthenticated) {
    return <PublicWrapper>{children}</PublicWrapper>;
  }
  if (isAuthenticated) {
    if (role && [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN].includes(role)) {
      return <AdminWrapper>{children}</AdminWrapper>;
    }
  }
};

export interface NotFoundProps {
  isAuthenticated?: boolean;
  role?: RoleEnum | null;
}

export const NotFound: React.FC<NotFoundProps> = ({
  isAuthenticated,
  role,
}) => {
  if (!isAuthenticated) {
    return (
      <PublicWrapper>
        <NotFoundPage />
      </PublicWrapper>
    );
  }
  if (isAuthenticated) {
    if (role && [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN].includes(role)) {
      return (
        <AdminWrapper>
          <NotFoundPage />
        </AdminWrapper>
      );
    }
  }
};

export default () => {
  const {
    globalState,
    globalDispatch: dispatch,
    authState: state,
    setGlobalState,
  } = useContexts();

  const isOpen = globalState?.isOpen ?? false;
  const openRouteChangeModal = globalState?.openRouteChangeModal ?? false;

  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // function setDimension(e: Event) {
  //   const target = e.currentTarget as Window;
  //   if (target.innerWidth >= 1024) {
  //     toggleSideBar(true);
  //   } else toggleSideBar(false);
  //   setScreenSize(target.innerWidth);
  // }

  // const toTop = () => {
  //   containerRef.current.scrollTo(0, 0);
  // };

  const portalChange = useCallback(
    (e: any) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.altKey &&
        ["r", "R"].includes(e.key)
      ) {
        setGlobalState("openRouteChangeModal", true);
      }
      // console.log("PORTAL CHANGE  >>", openRouteChangeModal, e);
      if (["Escape", "escape", "ESCAPE", "Esc", "esc"].includes(e.key)) {
        setGlobalState("openRouteChangeModal", false);
      }
    },
    [setGlobalState]
  );

  const toggleSideBar = (open: boolean) => {
    if (isOpen && screenSize < 1024) {
      dispatch({
        type: "OPEN_SIDEBAR",
        payload: { isOpen: open },
      });
    } else if (!isOpen && screenSize >= 1024) {
      dispatch({
        type: "OPEN_SIDEBAR",
        payload: { isOpen: open },
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener(
      "resize",
      (e) => {
        const target = e.currentTarget as Window;
        if (target.innerWidth >= 1024) {
          toggleSideBar(true);
        } else toggleSideBar(false);
        setScreenSize(target.innerWidth);
      },
      { signal }
    );

    return () => {
      controller.abort();
    };
  }, [screenSize]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("keydown", portalChange, { signal });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      onClick={() => {
        isOpen ? toggleSideBar(false) : null;
      }}
      className={`h-svh grid grid-cols-1 grid-rows-[auto_1fr] min-h-svh max-h-svh overflow-y-hidden overflow-x-hidden bg-background`}
    >
      <Routes>
        <Route
          path="/admin/profile"
          element={
            <PrivateRoute
              access={"admin"}
              path={"/admin/profile"}
              element={
                <AdminWrapper>
                  <AdminProfilePage />
                </AdminWrapper>
              }
            />
          }
        />

        <Route
          path="/admin/edit-wireframe/:id"
          element={
            <PrivateRoute
              access={["admin", "super_admin"]}
              path={"/admin/edit-wireframe/:id"}
              element={
                <AdminWrapper>
                  <EditWireframePage />
                </AdminWrapper>
              }
            />
          }
        />

        <Route
          path="/admin/build"
          element={
            <PrivateRoute
              access={["admin", "super_admin"]}
              path={"/admin/build"}
              element={
                <AdminWrapper>
                  <ListAdminWireframeTablePage />
                </AdminWrapper>
              }
            />
          }
        />

        <Route
          path="/"
          element={
            <PublicRoute
              path={"/"}
              element={
                // <PublicWrapper>
                <LandingPage />
                // </PublicWrapper>
              }
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            <PublicRoute
              path={"/admin/login"}
              element={
                <PublicWrapper>
                  <AdminLoginPage />
                </PublicWrapper>
              }
            />
          }
        />
        <Route
          path="/admin/sign-up"
          element={
            <PublicRoute
              path={"/admin/sign-up"}
              element={
                <PublicWrapper>
                  <AdminSignUpPage />
                </PublicWrapper>
              }
            />
          }
        />
        <Route
          path="/admin/forgot"
          element={
            <PublicRoute
              path={"/admin/forgot"}
              element={
                <PublicWrapper>
                  <AdminForgotPage />
                </PublicWrapper>
              }
            />
          }
        />
        <Route
          path="/admin/reset"
          element={
            <PublicRoute
              path={"/admin/reset"}
              element={
                <PublicWrapper>
                  <AdminResetPage />
                </PublicWrapper>
              }
            />
          }
        />
        <Route
          path="/magic-login"
          element={
            <PublicRoute
              path={"/magic-login"}
              element={
                <PublicWrapper>
                  <UserMagicLoginPage />
                </PublicWrapper>
              }
            />
          }
        />
        <Route
          path="/magic-login/verify"
          element={
            <PublicRoute
              path={"/magic-login/verify"}
              element={
                <PublicWrapper>
                  <MagicLoginVerifyPage />
                </PublicWrapper>
              }
            />
          }
        />

        {/* Custom Routes */}

        <Route
          path="/test-components"
          element={
            <PublicRoute
              path={"/test-components"}
              element={
                <PublicWrapper>
                  <TestComponents />
                </PublicWrapper>
              }
            />
          }
        />

        <Route
          path={"*"}
          element={
            <PublicRoute
              path={"*"}
              element={
                <NotFound
                  isAuthenticated={state?.isAuthenticated}
                  role={state?.role as RoleEnum | null}
                />
              }
            />
          }
        />
      </Routes>
      <SessionExpiredModal />
      <SnackBar />

      <LazyLoad>
        <RouteChangeModal
          isOpen={openRouteChangeModal}
          onClose={() => setGlobalState("openRouteChangeModal", false)}
          options={[
            ...(state?.isAuthenticated
              ? [
                  {
                    name: `${state?.role} Login`,
                    route: `/${state?.role}/login`,
                  },
                  { name: "Test Components", route: "/test-components" },
                ]
              : [
                  { name: "Admin Login", route: "/admin/login" },
                  { name: "User Login", route: "/user/login" },
                  { name: "Test Components", route: "/test-components" },
                ]),
          ]}
          title="Change Route"
        />
      </LazyLoad>
    </div>
  );
};
