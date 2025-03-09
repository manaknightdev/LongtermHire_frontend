import MkdJsonQuizOptions from "../MkdJsonQuizOptions";
import { QuestionTypes } from "../MkdJsonQuiz";

interface MultipleChoiceProps {
  updateQuestions: (question: any) => void;
  currentQuestion: any;
}

const MultipleChoice = ({
  updateQuestions,
  currentQuestion,
}: MultipleChoiceProps) => {
  return (
    <>
      {currentQuestion &&
      currentQuestion?.type === QuestionTypes.multiple_choice ? (
        <MkdJsonQuizOptions
          updateQuestions={updateQuestions}
          currentQuestion={currentQuestion}
        />
      ) : null}
    </>
  );
};

export default MultipleChoice;
