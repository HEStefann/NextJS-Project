import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import SentimentScoreMeter from "@/components/SentimentScoreMeter/SentimentScoreMeter";

const getQuestionsForSurvey = async (surveyId: string) => {
  const questions = await prisma.question.findMany({
    where: {
      surveyId,
    },
    include: {
      report: true,
      answers: true,
    },
  });

  const data = questions.map(({ id, text, answers, report }) => ({
    id,
    text,
    answersCount: answers.length,
    score: report?.sentimentScore,
  }));

  return data;
};

interface SurveyQuestionReportPageProps {
  params: {
    surveyId: string;
    questionId: string;
  };
}

export default async function SurveyQuestionsPage({
  params,
}: SurveyQuestionReportPageProps) {
  const questions = await getQuestionsForSurvey(params.surveyId);

  return (
    <>
      <p className="w-[144.67px] h-[39px] mt-[40px] mb-[50px] text-[26px] text-center text-[#4e4e4e]">
        REPORTS
      </p>
      <div className="rounded bg-[#4f35b6]/70 overflow-y-auto">
        <div className="max-w-[790px] rounded">
          <table className="w-full table-auto border border-[#4f35b6]/40 text-center">
            <thead>
              <tr className="w-[219px] h-[18px] bg-white/50 border-[#4f35b6]/40">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Question
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Answers
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Sentiment score
                </th>
                <th className="py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question.id}>
                  <td className="break-all border border-[#4f35b6]/40 py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-white">{question.text}</h5>
                  </td>
                  <td className="border border-[#4f35b6]/40 py-5 px-4">
                    {question.answersCount}
                  </td>
                  <td className="border border-[#4f35b6]/40 py-5 px-4">
                    {question.score || "N/A"}
                  </td>

                  <td className="border-t border-r-0 border-b-0 border-l border-[#4f35b6]/40 py-5 px-4">
                    <div className="flex justify-center items-center space-x-3.5 text-white">
                      <Link
                        href={`/dashboard/reports/${params.surveyId}/questions/${question.id}`}
                        className="hover:text-primary"
                      >
                        <FaMagnifyingGlassChart />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Link href="/dashboard/surveys">
        <div
          className="mt-5 flex justify-center items-center gap-2.5 px-2.5 py-[9px] rounded bg-[#4f35b6]/[0.66]"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          <p className="flex-grow-0 flex-shrink-0 text-[17px] text-center text-white">
            Back
          </p>
        </div>
      </Link>
    </>
  );
}
