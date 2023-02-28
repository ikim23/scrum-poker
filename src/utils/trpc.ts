import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { type AppRouter } from "~/server/api/root";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [httpBatchLink({ url: "/api/trpc" })],
    };
  },
  ssr: false,
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
