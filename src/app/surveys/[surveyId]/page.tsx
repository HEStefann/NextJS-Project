import Link from "next/link";
import prisma from "@/lib/prisma";
import MainComponent from "@/components/MainComponent/MainComponent";

const getSurvey = async (id: string) => {
  return prisma.survey.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

interface PublicSurveysPageProps {
  params: {
    surveyId: string;
  };
}
export default async function PublicSurveysPage({
  params,
}: PublicSurveysPageProps) {
  const survey = await getSurvey(params.surveyId);

  const startUrl = ["/surveys", params.surveyId, "questions"].join("/");

  return (
    <MainComponent>
      <div className="flex flex-col items-center justify-center h-full gap-[75px]">
        <p className="text-[26px] font-bold text-center text-[#4e4e4e]">
          {survey.name}
        </p>
        <p className="w-[741px] text-lg font-black text-center text-[#909090]">
          {survey.introduction}
        </p>
        <Link
          href={startUrl}
          className="w-[102px] h-10 rounded-xl bg-[#4f35b6]/[0.66] text-[17px] flex items-center justify-center text-white "
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          START
        </Link>
      </div>
    </MainComponent>
  );
}
