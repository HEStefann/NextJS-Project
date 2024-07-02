import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import SentimentScoreMeter from "@/components/SentimentScoreMeter/SentimentScoreMeter";

interface SurveyQuestionReportPageProps {
  params: {
    surveyId: string;
    questionId: string;
  };
}

const getQuestion = async (surveyId: string, questionId: string) => {
  const question = await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      surveyId,
    },
    include: {
      report: true,
    },
  });

  return question;
};

const getQuestionData = async (surveyId: string, questionId: string) => {
  const answers = await prisma.questionAnswer.findMany({
    where: {
      question: {
        id: questionId,
        surveyId,
      },
    },
  });

  return answers;
};

export default async function SurveyQuestionReportPage({
  params,
}: SurveyQuestionReportPageProps) {
  const question = await getQuestion(params.surveyId, params.questionId);
  const answers = await getQuestionData(params.surveyId, params.questionId);
  const keywords = (question.report?.keywords || []).splice(0, 10);
  const sentimentScorePercentPosition =
    ((question.report?.sentimentScore || 0) + 1) * 50;
  const sentimentScorePercent = (question.report?.sentimentScore || 0) * 100;
  const sentimentScoreMeterColor = `hsl(${sentimentScorePercentPosition}, 100%, 30%)`;

  return (
    <div className="px-[20px] flex flex-col justify-center items-center">
      <p className="break-all p-[17px] my-[37px] text-xl font-medium text-center text-[#4e4e4e]">
        {question.text}
      </p>
      <div className="rounded-[18px] bg-[#4f35b6]/70 overflow-y-auto w-full">
        <div className="max-w-full overflow-x-auto rounded-[20px]">
          <table className="w-full table-auto border border-[#4f35b6]/40 text-center">
            <thead>
              <tr className="w-[219px] h-[18px] bg-white/50 border-[#4f35b6]/40">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Answer
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Score
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Sentiment
                </th>
              </tr>
            </thead>
            <tbody>
              {answers.map((answer) => (
                <tr key={answer.id}>
                  <td className="border border-[#4f35b6]/40 py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-white">{answer.answer}</h5>
                  </td>
                  <td className="border border-[#4f35b6]/40 py-5 px-4">
                    {answer.sentimentScore}
                  </td>
                  <td className="border border-[#4f35b6]/40 py-5 px-4">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium`}
                    >
                      {answer.sentimentLabel}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5 relative">
        <p className="text-xl font-medium text-center text-[#4e4e4e]">
          Sentiment score
        </p>
        {question.report ? (
          <p
            className="text-[21px] absolute text-center text-[#074f3b]"
            style={{
              background: sentimentScoreMeterColor,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              left:
                sentimentScorePercentPosition > 90
                  ? "90%"
                  : sentimentScorePercentPosition - 1 + "%",
            }}
          >
            {sentimentScorePercent}%
          </p>
        ) : null}
        <div className="h-[30px]"></div>
        <svg
          width="735"
          height="51"
          viewBox="0 0 735 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[711px] h-[25.26px]"
          preserveAspectRatio="none"
        >
          <g filter="url(#filter0_d_256_1777)">
            <g clip-path="url(#clip0_256_1777)">
              <rect
                x="12"
                y="10.9584"
                width="711"
                height="25.2639"
                rx="5"
                fill="url(#paint0_linear_256_1777)"
                fill-opacity="0.6"
                shape-rendering="crispEdges"
              ></rect>
              <rect
                x="12"
                y="10.9584"
                width="711"
                height="25.2639"
                rx="5"
                fill="url(#paint1_linear_256_1777)"
                shape-rendering="crispEdges"
              ></rect>
              <line
                x1="622"
                y1="44.9584"
                x2="622"
                y2="10.9584"
                stroke="#198667"
                stroke-width="6"
              ></line>
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_256_1777"
              x="0"
              y="0.958374"
              width="735"
              height="49.2639"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset dy="2"></feOffset>
              <feGaussianBlur stdDeviation="6"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.12549 0 0 0 0 0.12549 0 0 0 0 0.12549 0 0 0 0.2 0"
              ></feColorMatrix>
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_256_1777"
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_256_1777"
                result="shape"
              ></feBlend>
            </filter>
            <linearGradient
              id="paint0_linear_256_1777"
              x1="12"
              y1="23.8711"
              x2="452"
              y2="23.871"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.265625" stop-color="#F30000"></stop>
              <stop offset="1" stop-color="#EBFF00" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_256_1777"
              x1="723"
              y1="23.8711"
              x2="304.5"
              y2="23.8708"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.347916" stop-color="#198667"></stop>
              <stop offset="1" stop-color="#EBFF00" stop-opacity="0"></stop>
            </linearGradient>
            <clipPath id="clip0_256_1777">
              <rect
                x="12"
                y="10.9584"
                width="711"
                height="25.2639"
                rx="5"
                fill="white"
              ></rect>
            </clipPath>
          </defs>
        </svg>

        <div className="flex justify-between">
          <p className="text-[21px] text-center text-[#4f35b6]">-100%</p>
          <p className="text-[21px] text-center text-[#4f35b6]">0%</p>
          <p className="text-[21px] text-center text-[#4f35b6]">100%</p>
        </div>
      </div>
      <div className="mt-5 rounded-[18px] bg-[#4f35b6]/70 overflow-y-auto w-full">
        <div className="max-w-full overflow-x-auto rounded-[20px] h-[250px] ">
          <table className="w-full table-auto border border-[#4f35b6]/40 text-center">
            <thead>
              <tr className="w-[219px] h-[18px] bg-white/50 border-[#4f35b6]/40">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                  Keywords
                </th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword, index) => (
                <tr key={index}>
                  <td className="border border-[#4f35b6]/40 py-5 px-4 pl-9 xl:pl-11">
                    {keyword.split(" ").map((word, wordIndex) => (
                      <div key={wordIndex}>
                        <h5 className="font-medium text-white">{word}</h5>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Link href={`/dashboard/reports/${params.surveyId}`}>
        <button
          className="w-[102px] h-10 rounded bg-[#110b28]/[0.66] text-[17px] text-center text-white mt-[50px] mb-[50px]"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          Back
        </button>
      </Link>
    </div>
  );
}
