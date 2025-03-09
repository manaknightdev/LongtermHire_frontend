import { useContext, useEffect, useState } from "react";
import MkdJsonQuizQuestions from "./MkdJsonQuizQuestions";
import MkdJsonQuizResult from "./MkdJsonQuizResult";
import { GlobalContext, showToast } from "@/context/Global";

export const QuestionTypes = {
  single_choice: "single_choice",
  multiple_choice: "multiple_choice",
  short_answer: "short_answer",
  long_answer: "long_answer",

  true_or_false: "true_or_false",
};

const Screens = {
  Questions: "Questions",
  Result: "Result",
};

type QuestionInterface = {
  id: string;
  type: string;
  question: string;
  options: any[];
  answer: any;
  correct_answer: any;
  is_answer: boolean;
  answers: any[];
};
interface MkdJsonQuizProps {
  className?: string;
  onSubmit?: (data?: any) => void;
  onContinue?: () => void;
  jsonQuestions?: QuestionInterface[];
}

const MkdJsonQuiz = ({
  className,
  onSubmit,
  onContinue,
  jsonQuestions = [],
}: MkdJsonQuizProps) => {
  const { dispatch: globalDipatch } = useContext(GlobalContext);

  const [totalScore, setTotalScore] = useState(0);
  const [questions, setQuestions] = useState(jsonQuestions);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions?.[questionNumber]
  );

  const [currentScreen, setCurrentScreen] = useState(Screens.Questions);

  const updateQuestions = (tempCurrentQuestion: any) => {
    const tempQuestions = [...questions]; // No need to use JSON.parse/stringify
    tempQuestions.splice(questionNumber, 1, tempCurrentQuestion);
    setQuestions(() => [...tempQuestions]);
    setCurrentQuestion(() => tempCurrentQuestion);
  };

  const onContinueCLick = () => {
    if (!onContinue) {
      setQuestionNumber(0);
      setCurrentScreen(Screens.Questions);
      return;
    }
    onContinue();
  };

  const isDisable = () => {
    if (questionNumber + 1 === questions?.length) {
      return true;
    } else {
      switch (currentQuestion?.type) {
        case QuestionTypes.single_choice:
        case QuestionTypes.short_answer:
        case QuestionTypes.long_answer:
        case QuestionTypes.true_or_false:
          return !currentQuestion?.answer;
        case QuestionTypes.multiple_choice:
          return !(
            currentQuestion?.answers && currentQuestion?.answers?.length
          );
        default:
          return true;
      }
    }
  };

  const isSumitDisabled = () => {
    const answers = questions.map((question) => {
      switch (question?.type) {
        case QuestionTypes.single_choice:
        case QuestionTypes.short_answer:
        case QuestionTypes.long_answer:
        case QuestionTypes.true_or_false:
          return !!question?.answer;
        case QuestionTypes.multiple_choice:
          return !!(question?.answers && question?.answers?.length);

        default:
          return true;
      }
    });

    return answers.includes(false);
  };

  const onSubmitQuestion = () => {
    if (!onSubmit) {
      showToast(globalDipatch, "Unable to Submit Quiz!", 5000, "error");
      return;
    }

    const eachScore =
      parseFloat("100") /
      parseFloat(`${questions && questions?.length ? questions?.length : 1}`);

    const totalScore =
      questions && questions?.length
        ? questions?.reduce((prev, question) => {
            switch (question?.type) {
              case QuestionTypes.single_choice:
                if (question?.answer?.is_answer) {
                  return prev + eachScore;
                } else {
                  return prev;
                }
              case QuestionTypes.short_answer:
              case QuestionTypes.long_answer:

              case QuestionTypes.true_or_false:
                if (question?.answer === question?.correct_answer) {
                  return prev + eachScore;
                } else {
                  return prev;
                }
              case QuestionTypes.multiple_choice:
                const correctAnswers = question?.options?.filter(
                  (option) => option?.is_answer
                );
                const selectedAnswers = question?.answers?.length;
                const correctSelectedAnswers = question?.answers?.filter(
                  (answer) => answer?.is_answer
                );
                if (
                  correctAnswers?.length === selectedAnswers &&
                  correctAnswers?.length === correctSelectedAnswers?.length
                ) {
                  return prev + eachScore;
                } else {
                  return prev;
                }

              default:
                return prev;
            }
          }, 0)
        : null;

    setTotalScore(Number(totalScore?.toFixed(2)));

    onSubmit({
      questions,
      total_score: Number(totalScore?.toFixed(2)),
      score_per_question: eachScore,
    });

    setCurrentScreen(Screens.Result);
  };
  const onPrev = () => {
    setQuestionNumber((prev) => prev - 1);
  };

  const onNext = () => {
    setQuestionNumber((prev) => prev + 1);
  };

  useEffect(() => {
    setCurrentQuestion(questions[questionNumber]);
  }, [questionNumber]);

  return (
    <div
      className={`flex h-fit max-h-fit min-h-[31.25rem] w-full min-w-full max-w-full flex-col items-center rounded-md p-5 pb-10 shadow-md ${className}`}
    >
      {currentScreen === Screens.Questions ? (
        <MkdJsonQuizQuestions
          currentQuestion={currentQuestion}
          isDisable={isDisable}
          isSumitDisabled={isSumitDisabled}
          onNext={onNext}
          onPrev={onPrev}
          questionLength={questions?.length}
          questionNumber={questionNumber}
          updateQuestions={updateQuestions}
          onSubmit={onSubmitQuestion}
        />
      ) : null}

      {currentScreen === Screens.Result ? (
        <MkdJsonQuizResult
          totalScore={totalScore}
          onContinue={onContinueCLick}
        />
      ) : null}
    </div>
  );
};

MkdJsonQuiz.defaultProps = {
  className: "",
};

export default MkdJsonQuiz;
