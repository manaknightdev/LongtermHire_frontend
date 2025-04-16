import MkdJsonQuizOptions from "../MkdJsonQuizOptions";
import { QuestionTypes } from "../MkdJsonQuiz";

interface SingleChoiceProps {
  updateQuestions: (question: any) => void;
  currentQuestion: any;
}

const SingleChoice = ({
  updateQuestions,
  currentQuestion,
}: SingleChoiceProps) => {
  return (
    <>
      {currentQuestion &&
      currentQuestion?.type === QuestionTypes.single_choice ? (
        <MkdJsonQuizOptions
          updateQuestions={updateQuestions}
          currentQuestion={currentQuestion}
        />
      ) : null}
    </>
  );
};

export default SingleChoice;
