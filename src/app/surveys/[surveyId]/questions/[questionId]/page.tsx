"use client";
import { Question } from "@prisma/client";
import { useParams } from "next/navigation";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function PublicSurveyQuestionPage() {
  const [questionData, setQuestionData] = useState<Question>();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { surveyId, questionId } = useParams();

  const getQuestionData = useCallback(async () => {
    const response = await fetch(
      `/api/surveys/${surveyId}/questions/${questionId}`
    );
    const { data } = await response.json();
    setQuestionData(data);
  }, [surveyId, questionId]);

  useEffect(() => {
    getQuestionData();
  }, [getQuestionData]);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (!inputRef.current) return;
    e.preventDefault();
    const { currentTarget } = e;
    const formData = new FormData(currentTarget);
    const answer = formData.get("answer");
    try {
      await fetch(`/api/surveys/${surveyId}/questions/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify({
          answer,
        }),
      });

      inputRef.current.value = "";
      alert("Your answer was successfully submitted!");
    } catch (e) {
      alert(
        "Oops.. Something went wrong while submitting the answer, try again."
      );
      console.error("Failed to submit answer!", e);
    }
  };

  return (
    <div className="bg-white/50 p-5 rounded text-center"
      style={{ boxShadow: "0px 2px 35px 0 rgba(79,53,182,0.8)" }}>
      <p className="py-5 text-[26px] text-center text-[#4e4e4e]">Answer</p>
      <div
        className="rounded py-5 h-[350px] flex justify-center"
        style={{
          background: "linear-gradient(51.34deg, rgba(79,53,182,0.4) 25.53%, rgba(79,53,182,0) 82.48%)"
        }}>

        <form className="flex flex-col justify-center items-center gap-5" onSubmit={handleFormSubmit}>
          <p className="text-[17px] font-medium text-left text-[#4e4e4e]">
            Enter answer. Please be more specific !
          </p>
          <textarea
            ref={inputRef}
            name="answer"
            rows={10}
            className="p-2 bg-[#4f35b6]/40 w-[500px] h-[120px] rounded mt-2 mb-5"
            required={questionData?.required || false}
          ></textarea>
          <button
            type="submit"
            className="bg-[#110b28]/[0.66] p-2 text-white font-bold rounded-md uppercase my-3"
          >
            Submit Answer
          </button>
        </form>

      </div>
    </div>
  );
}
