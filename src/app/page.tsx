"use client";
import Image from "next/image";
import MainComponent from "../components/MainComponent/MainComponent";
import Link from "next/link";

export default function Home() {
  return (
    <MainComponent>
      <p className="text-[26px] mt-[92px] font-bold text-center text-[#4e4e4e]">
        WELCOME
      </p>
      <p className="max-w-[597px] mt-[122px] text-lg font-black text-center text-[#909090]">
        This app will help you to create your surveys and get helpful insights
        about your audience or your employees
      </p>
      <Link href="/dashboard/surveys/create/">
        <button
          className="w-[102px] h-10 rounded-xl bg-[#4f35b6]/[0.66] mt-[52px] mb-[92px] text-[17px] text-center text-white"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          START
        </button>
      </Link>
    </MainComponent>
  );
}
