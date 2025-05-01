import ContactComponent from "@/components/contact-component";
import React from "react";
import { getMetadata } from "@/lib/get-metadata";
import { Metadata } from "next";
import { routes } from "@/lib/routes";

export function generateMetadata(): Metadata {
  return getMetadata(routes.contactUs());
}

const page = () => {
  return <ContactComponent />;
};

export default page;
