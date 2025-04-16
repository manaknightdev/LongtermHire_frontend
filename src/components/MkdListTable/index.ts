import { lazy } from "react";

export const MkdListTableRowListColumn = lazy(
  () => import("./MkdListTableRowListColumn")
);
export const MkdListTable = lazy(() => import("./MkdListTable"));
export const MkdListTableV2 = lazy(() => import("./MkdListTableV2"));
export const TableActions = lazy(() => import("./TableActions"));
export const OverlayTableActions = lazy(() => import("./OverlayTableActions"));
export const MkdListTableRowCol = lazy(() => import("./MkdListTableRowCol"));
export const MkdListTableFilter = lazy(() => import("./MkdListTableFilter"));
export const MkdListTableRowButtons = lazy(
  () => import("./MkdListTableRowButtons")
);
export const MkdListTableRowDropdown = lazy(
  () => import("./MkdListTableRowDropdown")
);
export const SetColumns = lazy(() => import("./SetColumns/SetColumns"));
