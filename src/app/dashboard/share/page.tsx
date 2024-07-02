import prisma from "@/lib/prisma";
import { url } from "inspector";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { FaShare } from "react-icons/fa";
import "../../../styles/globals.css";
import React, { ReactNode } from "react";

const getSurveys = async () => {
    return prisma.survey.findMany({});
};

export default async function SurveysPage() {
    const surveys = await getSurveys();
    return (
        <>
            <p className="w-[260px] h-[39px] mt-[40px] mb-[50px] text-[26px] text-center text-[#4e4e4e]">
                SHARE SURVEYS
            </p>
            <div className="rounded bg-[#4f35b6]/70">
                <div className="max-w-full overflow-x-auto rounded">
                    <table className="w-full table-auto border border-[#4f35b6]/40 text-center">
                        <thead>
                            <tr className="w-[219px] h-[18px] bg-white/50 border-[#4f35b6]/40">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                                    Name
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                                    Manager
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-medium text-black border border-[#4f35b6]/40">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {surveys.map((survey, index) => (
                                <tr key={survey.id}>
                                    <td className="border border-[#4f35b6]/40 py-5 px-4 pl-9 xl:pl-11">
                                        <h5 className="font-medium text-white">
                                            {survey.name}
                                        </h5>
                                    </td>
                                    <td className="border border-[#4f35b6]/40 py-5 px-4">
                                        <a
                                            className="text-white"
                                            href={"mailto:" + survey.manager}
                                            target="_blank"
                                        >
                                            {survey.manager}
                                        </a>
                                    </td>
                                    <td className="border border-[#4f35b6]/40 py-5 px-4">
                                        <p
                                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${survey.status === "ONGOING"
                                                ? "text-white"
                                                : survey.status === "FINISHED"
                                                    ? "text-white"
                                                    : "text-white"
                                                }`}
                                        >
                                            {survey.status}
                                        </p>
                                    </td>
                                    <td className="border-t border-r-0 border-b-0 border-l border-[#4f35b6]/40 py-5 px-4">
                                        <div className="flex items-center justify-center text-white">
                                            <Link
                                                href={"/dashboard/surveys/" + survey.id + "/share"}
                                                className="hover:text-[#4f35b6]"
                                            >
                                                <FaShare />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
