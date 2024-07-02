import React from "react";

interface MainComponentProps {
  children?: React.ReactNode;
}

const MainComponent = ({ children }: MainComponentProps) => (
  <main
    className="overflow-y-auto w-[880px] min-h-[728px] mt-[50px] pb-[40px] rounded-xl bg-white/75 flex flex-col items-center mb-[77px]"
    style={{ boxShadow: "0px 4px 32px 23px rgba(79,53,182,0.23)" }}
  >
    {children}
  </main>
);

export default MainComponent;
