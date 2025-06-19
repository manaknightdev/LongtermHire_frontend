import { lazy } from "react";

const MkdPasswordInputComponent = lazy(() => import("./MkdPasswordInput"));
const MkdPasswordInputExample = lazy(
  () => import("./MkdPasswordInput.example")
);

export const MkdPasswordInput = MkdPasswordInputComponent;
export { MkdPasswordInputExample };
export default MkdPasswordInputComponent;
