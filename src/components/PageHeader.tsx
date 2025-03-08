
import React from "react";
import { Header, HeaderProps } from "@/components/layout/Header";

export type PageHeaderProps = HeaderProps;

export function PageHeader(props: PageHeaderProps) {
  // Forward all props to the Header component
  return <Header {...props} />;
}
