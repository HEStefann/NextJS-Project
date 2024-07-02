import MainComponent from "@/components/MainComponent/MainComponent";

export default function ThankYouPage() {
  return (
    <MainComponent>
      <div className="flex flex-col items-center justify-center gap-[10px] h-full">
        <p className="text-[26px] font-bold text-center uppercase text-[#4e4e4e]">
          Successfully completed survey
        </p>
        <p className="text-lg font-black text-center text-[#909090]">
          Thank you.
        </p>
      </div>
    </MainComponent>
  );
}
