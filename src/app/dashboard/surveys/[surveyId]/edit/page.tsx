import SurveyForm from "@/components/SurveyForm/SurveyForm";
import { SurveyDTO } from "@/types/SurveyDTO";
import { SurveyStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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
  const survey = await getSurveyById(surveyId);
  const title = ["Editing survey", survey.name].join(" ");

  const updateSurvey = async (formData: FormData) => {
    "use server";
    const data: Partial<SurveyDTO["data"]> = {
      name: formData.get("name") as string,
      manager: formData.get("manager") as string,
      introduction: formData.get("introduction") as string,
      status: formData.get("status") as SurveyStatus,
    };
    await fetch(`${process.env.API_URL}/surveys/${surveyId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    redirect("/dashboard/surveys/");
  };

  return (
    <div className="flex flex-col gap-5">
      <SurveyForm title={title} defaultValues={survey} action={updateSurvey} buttonText="UPDATE" />
    </div>
  );
}
