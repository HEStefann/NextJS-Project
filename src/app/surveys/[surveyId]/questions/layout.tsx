import SurveyQuestionList from "@/components/SurveyQuestionList/SurveyQuestionList";
import React from "react";

interface PublicSurveyLayoutProps {
  children: React.ReactNode;
}

export default async function PublicSurveyLayout({
  children,
}: PublicSurveyLayoutProps) {
  return (
    // <div className="container mx-auto my-6">
    //   <div className="grid grid-cols-7 gap-10">
    //     <div className="col-span-2">
    //       <SurveyQuestionList />
    //     </div>
    //     <div className="col-span-5">{children}</div>
    //   </div>
    // </div>
    <>{children}</>
  );
}
