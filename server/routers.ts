import { z } from "zod";
import { allergenOptions, budgetOptions, dietaryOptions, energyOptions, foodMoodOptions, hungerOptions, timeOptions } from "../shared/nourish";
import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { buildShoppingList, buildWeeklyPlan, listIdeas, recommendIdea } from "./nourish-service";

const checkInSchema = z.object({
  hunger: z.enum(hungerOptions),
  energy: z.enum(energyOptions),
  time: z.enum(timeOptions),
  mood: z.enum(foodMoodOptions),
  ingredients: z.array(z.string().trim().min(1).max(40)).max(8),
  dietary: z.array(z.enum(dietaryOptions)).max(4),
  allergens: z.array(z.enum(allergenOptions)).max(6).default([]),
  avoidIngredients: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  budget: z.enum(budgetOptions).default("flexible"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  nourish: router({
    catalogue: publicProcedure.input(z.object({ dietary: z.array(z.enum(dietaryOptions)).max(4).default([]) }).optional()).query(({ input }) => listIdeas(input?.dietary ?? [])),
    recommend: publicProcedure.input(checkInSchema).query(({ input }) => recommendIdea(input)),
    weeklyPlan: publicProcedure.input(checkInSchema).query(({ input }) => buildWeeklyPlan(input)),
    shoppingList: publicProcedure.input(z.object({ ideaIds: z.array(z.string().trim().min(1).max(80)).min(1).max(10) })).query(({ input }) => buildShoppingList(input.ideaIds)),
  }),
});

export type AppRouter = typeof appRouter;
