
import React from "react";
import { Header, HeaderProps } from "@/components/layout/Header";

export type PageHeaderProps = HeaderProps;

export function PageHeader(props: PageHeaderProps) {
  // This component is now just a wrapper around the Header component
  // We're not rendering anything here to avoid duplication
  console.log("PageHeader is deprecated, use Header component directly instead");
  return null;
}
