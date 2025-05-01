import PrivacyContent from "@/components/privacy";
import { getMetadata } from "@/lib/get-metadata";
import { routes } from "@/lib/routes";
import { Metadata } from "next";
import React from "react";

export function generateMetadata(): Metadata {
  return getMetadata(routes.privacy());
}

const page = () => {
  return <PrivacyContent />;
};

export default page;
