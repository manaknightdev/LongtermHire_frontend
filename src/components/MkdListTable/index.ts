import { lazy } from "react";

export { MkdListTableV2 } from "./V2";
export { MkdListTableV3 } from "./V3";
export { SetColumns } from "./SetColumns";
export { MkdListTableV3Wrapper } from "./V3Wrapper";
export {
  FilterDropdown,
  FilterDateRange,
  FilterJoinDropdown,
  FilterOptions
} from "./FilterDropdown";

export const TableFilter = lazy(() => import("./Filter"));
export const MkdListTable = lazy(() => import("./MkdListTable"));
export const MkdListTableRowCol = lazy(() => import("./RowCol"));
export const RenderActions = lazy(() => import("./RenderActions"));
export const TableActions = lazy(() => import("./TableActions"));
export const FilterDisplays = lazy(() => import("./FilterDisplays"));
export const MkdListTableRowButtons = lazy(() => import("./RowButtons"));
export const OverlayTableActions = lazy(() => import("./OverlayActions"));
export const MkdListTableRowDropdown = lazy(() => import("./RowDropdown"));
export const MkdListTableRowListColumn = lazy(() => import("./RowListColumn"));
export const RenderDropdownActions = lazy(
  () => import("./RenderDropdownActions")
);
