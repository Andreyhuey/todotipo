import TermsConditionsContent from "@/components/terms";
import { getMetadata } from "@/lib/get-metadata";
import { routes } from "@/lib/routes";
import { Metadata } from "next";
import React from "react";

export function generateMetadata(): Metadata {
  return getMetadata(routes.terms());
}

const page = () => {
  return <TermsConditionsContent />;
};

export default page;
