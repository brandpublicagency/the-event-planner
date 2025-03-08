
import React from "react";
import { Header, HeaderProps } from "@/components/layout/Header";

export type PageHeaderProps = HeaderProps;

export function PageHeader(props: PageHeaderProps) {
  // This component is now just a wrapper around the Header component
  // for backwards compatibility
  return <Header {...props} />;
}
