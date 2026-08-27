import { COOKIE_NAME } from "../shared/const.js";
import { dietaryOptions, energyOptions, foodMoodOptions, hungerOptions, timeOptions } from "../shared/nourish";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { listIdeas, recommendIdea } from "./nourish-service";
import { z } from "zod";

const checkInSchema = z.object({
  hunger: z.enum(hungerOptions),
  energy: z.enum(energyOptions),
  time: z.enum(timeOptions),
  mood: z.enum(foodMoodOptions),
  ingredients: z.array(z.string().trim().min(1).max(40)).max(8),
  dietary: z.array(z.enum(dietaryOptions)).max(4),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  nourish: router({
    catalogue: publicProcedure
      .input(z.object({ dietary: z.array(z.enum(dietaryOptions)).max(4).default([]) }).optional())
      .query(({ input }) => listIdeas(input?.dietary ?? [])),
    recommend: publicProcedure.input(checkInSchema).query(({ input }) => recommendIdea(input)),
  }),

});

export type AppRouter = typeof appRouter;
