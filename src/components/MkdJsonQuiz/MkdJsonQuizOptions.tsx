import { Key } from "react";
import MkdJsonQuizOption from "./MkdJsonQuizOption";

interface MkdJsonQuizOptionsProps {
  currentQuestion: any;
  updateQuestions: (question: any) => void;
}

const MkdJsonQuizOptions = ({
  currentQuestion,
  updateQuestions,
}: MkdJsonQuizOptionsProps) => {
  return (
    <div className="flex w-full grow flex-col items-center justify-between gap-5">
      {currentQuestion &&
      currentQuestion?.options &&
      currentQuestion?.options?.length
        ? currentQuestion?.options?.map(
            (option: unknown, optionkey: Key | null | undefined) => (
              <MkdJsonQuizOption
                className={``}
                key={optionkey}
                option={option}
                currentQuestion={currentQuestion}
                updateQuestions={updateQuestions}
              />
            )
          )
        : null}
    </div>
  );
};

export default MkdJsonQuizOptions;
