import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    GITHUB_PAT: z.string().min(1),
    GITHUB_USERNAME: z.string().min(1),
    GITHUB_REPO_NAME: z.string().min(1),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_PAT: process.env.GITHUB_PAT,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
