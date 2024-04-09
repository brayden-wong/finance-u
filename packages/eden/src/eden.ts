import { edenTreaty } from "@elysiajs/eden";
import { z } from "zod";
import type { Api } from "@finance/api";

const UrlSchema = z
  .string({ required_error: "API URL is required" })
  .min(1)
  .url({ message: "Invalid URL" });

const url = process.env.NEXT_PUBLIC_API_URL;

const result = UrlSchema.parse(url);

export const api = edenTreaty<Api>(result);
