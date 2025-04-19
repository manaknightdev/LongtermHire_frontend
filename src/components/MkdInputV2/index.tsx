import { lazy } from "react";

const MkdInputV2Component = lazy(() => import("./MkdInputV2"));
const MkdInputV2Label = lazy(() => import("./MkdInputV2Label"));
const MkdInputV2Field = lazy(() => import("./MkdInputV2Field"));
const MkdInputV2Error = lazy(() => import("./MkdInputV2Error"));
const MkdInputV2Container = lazy(() => import("./MkdInputV2Container"));
// examples
const MkdInputV2Example = lazy(() => import("./MkdInputV2.example"));
const MkdInputV2HookFormExample = lazy(
  () => import("./MkdInputV2.hookform.example")
);

// Create the compound component by attaching sub-components
const MkdInputV2 = Object.assign(MkdInputV2Component, {
  Container: MkdInputV2Container,
  Label: MkdInputV2Label,
  Field: MkdInputV2Field,
  Error: MkdInputV2Error,
});

// Export the compound component
export default MkdInputV2;

// Export the components individually for use in other files
export {
  MkdInputV2,
  MkdInputV2Container,
  MkdInputV2Label,
  MkdInputV2Field,
  MkdInputV2Error,
  MkdInputV2Example,
  MkdInputV2HookFormExample,
};
