import { metadataMap } from "@/constants/metadata.data";
import type { Metadata } from "next";

export function getMetadata(path: string): Metadata {
  return (
    metadataMap[path] ?? {
      title: "EasyRentProps",
      description: "Your trusted property partner in Orlando",
    }
  );
}
