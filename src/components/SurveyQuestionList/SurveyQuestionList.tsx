"use client";
import { QuestionsDTO } from "@/types/QuestionDTO";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SurveyQuestionList() {
  const { questionId, surveyId } = useParams();
  const [questions, setQuestions] = useState<QuestionsDTO["data"]>([]);

  const getQuestions = useCallback(async () => {
    const response = await fetch(`/api/surveys/${surveyId}/questions`);
    const { data } = await response.json();
    setQuestions(data);
  }, [surveyId]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);


  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const paginatedQuestions = questions.slice(
    currentPage * questionsPerPage,
    currentPage * questionsPerPage + questionsPerPage
  );

  return (
    <div className="bg-white/50 rounded p-5" style={{ boxShadow: "0px 2px 35px 0 rgba(79,53,182,0.8)" }}>
      <p className="text-[26px] text-center text-[#4e4e4e] py-2 mb-5">Questions</p>
      <ul className="divide-y divide-white/50 rounded">
        {paginatedQuestions.map((question) => (
          <li
            className={clsx("flex py-4 px-4 pl-11 relative", {
              "bg-[#4F35B6] rounded": questionId === question.id,
            })}
            key={question.id}
          >
            <div
              className={clsx(
                "absolute top-1/2 transform -translate-y-1/2 left-2 w-4 h-4 bg-blue-500 rounded-full text-xs text-center",
                {
                  "bg-[#4F35B6] text-white w-[25px] h-[25px] flex items-center justify-center": questionId !== question.id,
                  "bg-white text-[#4F35B6]": questionId === question.id,
                }
              )}
            >
              {question.position}
            </div>
            <Link
              href={`/surveys/${surveyId}/questions`}
              className={clsx({
                "text-white": questionId === question.id,
              })}
            >
              {question.text}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-between px-4 py-2 rounded text-white bg-[#4f35b6]/[0.4] mt-3">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative px-2.5 py-[9px] rounded-xl bg-[#4f35b6]/[0.66]"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          <p className="flex-grow-0 flex-shrink-0 text-[17px] text-center text-white">Back</p>
        </button>
        <p className="p-3">Page {currentPage} of {totalPages - 1} </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative px-2.5 py-[9px] rounded-xl bg-[#4f35b6]/[0.66]"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          <p className="flex-grow-0 flex-shrink-0 text-[17px] text-center text-white">Next</p>
        </button>
      </div>
    </div>
  );
}