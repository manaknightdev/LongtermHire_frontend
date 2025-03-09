import { lazy } from "react";

export const CircularProgressBar = lazy(() => import("./CircularProgressBar"));
export const MkdJsonQuiz = lazy(() => import("./MkdJsonQuiz"));
export const MkdJsonQuizOption = lazy(() => import("./MkdJsonQuizOption"));
export const MkdJsonQuizOptions = lazy(() => import("./MkdJsonQuizOptions"));
export const MkdJsonQuizQuestions = lazy(
  () => import("./MkdJsonQuizQuestions")
);
export const MkdJsonQuizResult = lazy(() => import("./MkdJsonQuizResult"));
