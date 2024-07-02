"use client";
import { Question } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MainComponent from "@/components/MainComponent/MainComponent";
export default function PublicSurveyQuestionPage() {
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { surveyId, questionsPage } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const questionsPerPage = 5;
  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const router = useRouter();

  const currentQuestions = questionsData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < Math.ceil(questionsData.length / questionsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getQuestionsData = useCallback(async () => {
    const response = await fetch(`/api/surveys/${surveyId}/questions`);
    const { data } = await response.json();
    setQuestionsData(data);
    setCurrentQuestion(data[0]);
  }, [surveyId]);

  useEffect(() => {
    getQuestionsData();
  }, [getQuestionsData]);
  const pages = Math.ceil(questionsData.length / questionsPerPage);
  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!inputRef.current) return;
    e.preventDefault();
    const { currentTarget } = e;
    const formData = new FormData(currentTarget);
    const answer = formData.get("answer");
    try {
      await fetch(
        `/api/surveys/${surveyId}/questions/${currentQuestion?.id}/answers`,
        {
          method: "POST",
          body: JSON.stringify({
            answer,
          }),
        }
      );
      inputRef.current.value = "";
      // Add the current question to the answeredQuestions array
      if (currentQuestion) {
        setAnsweredQuestions([...answeredQuestions, currentQuestion]);
        // Get the next unanswered question
        alert("Your answer was successfully submitted!");
        const nextQuestion = getNextUnansweredQuestion(currentQuestion?.id);
        // Set the next unanswered question as the current question
        setCurrentQuestion(nextQuestion || null);
        // calculate based on the questions and questions per page if questionsData is 8 and questions per page is 5 then current page should be 2
        setCurrentPage(
          Math.ceil(
            (questionsData.indexOf(nextQuestion || currentQuestion) + 1) /
            questionsPerPage
          ) - 1
        );
      }
    } catch (e) {
      alert(
        "Oops.. Something went wrong while submitting the answer, try again."
      );
      console.error("Failed to submit answer!", e);
    }
  };
  function getNextUnansweredQuestion(currentQuestionId: string) {
    const currentQuestionIndex = questionsData.findIndex(
      (question) => question.id === currentQuestionId
    );

    // Check for unanswered questions in the next questions
    for (let i = currentQuestionIndex + 1; i < questionsData.length; i++) {
      if (!answeredQuestions.includes(questionsData[i])) {
        return questionsData[i];
      }
    }

    // If no unanswered questions in the next questions, check the previous questions
    for (let i = 0; i < currentQuestionIndex; i++) {
      if (!answeredQuestions.includes(questionsData[i])) {
        return questionsData[i];
      }
    }

    // If all questions are answered
    alert("All questions are answered. Thank you!");
    router.push(`/surveys/${surveyId}/thank-you`);
  }
  return (
    <div className="flex gap-[48px]">
      <div className="flex flex-col justify-center items-center gap-[38px]">
        <div
          className="w-[502px] pb-[25px] rounded-xl bg-white/75 flex flex-col gap-[17px] pt-[39px]"
          style={{ boxShadow: "0px 2px 35px 0 rgba(79,53,182,0.8)" }}
        >
          <p className="text-[26px] text-center text-[#4e4e4e]">Questions</p>
          <div className="flex flex-col gap-[23px] mx-[50px]">
            {currentQuestions.map((question: Question) => (
              <div
                key={question.id}
                className="flex justify-between cursor-pointer"
                onClick={() => setCurrentQuestion(question)}
              >
                <div className="relative flex items-center justify-center">
                  <p className="absolute text-[17px] font-bold text-white/75">
                    {question.position + 1}
                  </p>
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <g filter="url(#filter0_f_257_903)">
                      <path
                        d="M29 16.5C29 23.4036 23.4036 29 16.5 29C9.59644 29 4 23.4036 4 16.5C4 9.59644 9.59644 4 16.5 4C23.4036 4 29 9.59644 29 16.5Z"
                        fill={
                          answeredQuestions.includes(question)
                            ? "#4F35B6"
                            : currentQuestion?.id === question.id
                              ? "#4F35B6"
                              : "#11053E"
                        }
                        style={{ mixBlendMode: "color-burn" }}
                      ></path>
                    </g>
                    <defs>
                      <filter
                        id="filter0_f_257_903"
                        x="0"
                        y="0"
                        width="33"
                        height="33"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        ></feBlend>
                        <feGaussianBlur
                          stdDeviation="2"
                          result="effect1_foregroundBlur_257_903"
                        ></feGaussianBlur>
                      </filter>
                    </defs>
                  </svg>
                </div>
                <p className="w-[349px] text-base font-medium text-left text-black">
                  {question.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="pb-[19px] w-full px-[12px] rounded-xl bg-white/75 flex flex-col items-center gap-[27px]"
          style={{ boxShadow: "0px 2px 35px 0 rgba(79,53,182,0.8)" }}
        >
          <p className="text-[25px] font-medium text-center text-[#4e4e4e]">
            Pages
          </p>
          <div className="flex gap-[15px] w-full">
            <button
              className="flex justify-center items-center px-2.5 py-[9px] rounded-xl bg-[#110b28]/[0.66] text-[17px] text-center text-white"
              style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
              onClick={prevPage}
            >
              Back
            </button>
            <div className="w-full flex justify-center">
              <div className="flex justify-between">
                {Array.from({ length: pages }, (_, i) => (
                  <div
                    key={i}
                    className="relative flex items-center justify-center cursor-pointer"
                    onClick={() => setCurrentPage(i)}
                  >
                    <p className="absolute text-[17px] font-bold text-white/75">
                      {i + 1}
                    </p>
                    <svg
                      width="33"
                      height="34"
                      viewBox="0 0 33 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="none"
                    >
                      <g filter="url(#filter0_f_256_1206)">
                        <circle
                          cx="16.5"
                          cy="17.25"
                          r="12.5"
                          fill={
                            Number(currentPage) === i ? "#4F35B6" : "#11053E"
                          }
                          style={{ mixBlendMode: "color-burn" }}
                        ></circle>
                      </g>
                      <defs>
                        <filter
                          id="filter0_f_256_1206"
                          x="0"
                          y="0.75"
                          width="33"
                          height="33"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          ></feFlood>
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          ></feBlend>
                          <feGaussianBlur
                            stdDeviation="2"
                            result="effect1_foregroundBlur_256_1206"
                          ></feGaussianBlur>
                        </filter>
                      </defs>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="flex justify-center items-center px-2.5 py-[9px] rounded-xl bg-[#4f35b6]/[0.66] text-[17px] text-center text-white"
              style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <MainComponent>
        <p className="text-[26px] mt-[40px] mb-[30px] text-center text-[#4e4e4e]">
          Answer
        </p>
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center items-center h-[352px] gap-10 px-[25px] pt-[50px] pb-[25px] rounded-xl"
          style={{
            background:
              "linear-gradient(51.34deg, rgba(79,53,182,0.4) 25.53%, rgba(79,53,182,0) 82.48%)",
            boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)",
          }}
        >
          <div className="flex flex-col gap-[14px]">
            <p className="text-[17px] font-medium pl-[14px] text-[#4e4e4e]">
              {currentQuestion?.text}
            </p>
            <textarea
              ref={inputRef}
              name="answer"
              rows={10}
              className="w-[623px] h-[107px] p-[10px] rounded-[20px] bg-[#4f35b6]/40"
              required={currentQuestion?.required || false}
              defaultValue={
                answeredQuestions.find(
                  (answer) => answer.id === currentQuestion?.id
                )?.text || ""
              }
              style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
            />
          </div>
          <button
            type="submit"
            className="w-[100px] h-[42.03px] rounded-xl bg-[#110b28]/[0.66] text-[17px] text-center text-white"
            style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
          >
            Submit
          </button>
        </form>
      </MainComponent>
    </div>
  );
}