import React, { ReactNode } from "react";
import MainComponent from "../../components/MainComponent/MainComponent";
import DockComponent from "@/components/DockComponent/DockComponent";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainComponent>{children}</MainComponent>
      <DockComponent />
    </>
  );
}
