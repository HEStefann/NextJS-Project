import React from "react";
import SurveyFormQuestionList from "@/components/SurveyFormQuestionList/SurveyFormQuestionList";
import prisma from "@/lib/prisma";

const getSurveyById = async (id: string) => {
  return prisma.survey.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

type SurveyEditPageParams = {
  params: {
    surveyId: string;
  };
};

export default async function SurveyEditPage({
  params: { surveyId },
}: SurveyEditPageParams) {
  return (
    <>
      <p className="text-[26px] text-center text-[#4e4e4e] my-[40px]">
        Questions
      </p>
      <SurveyFormQuestionList surveyId={surveyId} />
    </>
  );
}
