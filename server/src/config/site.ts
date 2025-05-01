import dotenv from "dotenv";
import { requireEnv } from "../helpers/require-env";

dotenv.config();

export const site = {
  SITE_NAME: requireEnv("SITE_NAME"),
  SITE_LINK: requireEnv("SITE_LINK"),
};
