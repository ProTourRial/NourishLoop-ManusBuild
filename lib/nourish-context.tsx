import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { getPremiumStatus } from "@/lib/revenuecat";
import type { AllergenPreference, BudgetPreference, DietaryOption, NourishIdea, NourishRecommendation, NourishWeeklyPlan } from "@/shared/nourish";

const SAVED_IDEAS_KEY = "nourishloop.savedIdeas.v1";
const PREFERENCES_KEY = "nourishloop.preferences.v2";
const WEEKLY_PLAN_KEY = "nourishloop.weeklyPlan.v1";
const SHOPPING_CHECKS_KEY = "nourishloop.shoppingChecks.v1";

export type NourishPreferences = {
  dietary: DietaryOption[];
  allergens: AllergenPreference[];
  avoidIngredients: string[];
  budget: BudgetPreference;
  gentleReminders: boolean;
  reminderTime: string;
};

type NourishContextValue = {
  savedIdeas: NourishIdea[];
  preferences: NourishPreferences;
  latestRecommendation: NourishRecommendation | null;
  weeklyPlan: NourishWeeklyPlan | null;
  shoppingChecks: Record<string, boolean>;
  hasPro: boolean;
  hydrated: boolean;
  saveIdea: (idea: NourishIdea) => void;
  removeIdea: (id: string) => void;
  setPreferences: (preferences: NourishPreferences) => void;
  setLatestRecommendation: (recommendation: NourishRecommendation) => void;
  setWeeklyPlan: (plan: NourishWeeklyPlan | null) => void;
  toggleShoppingItem: (id: string) => void;
  setHasPro: (hasPro: boolean) => void;
  refreshSubscription: () => Promise<void>;
};

const NourishContext = createContext<NourishContextValue | null>(null);
const defaultPreferences: NourishPreferences = { dietary: [], allergens: [], avoidIngredients: [], budget: "flexible", gentleReminders: false, reminderTime: "12:00" };

export function NourishProvider({ children }: PropsWithChildren) {
  const [savedIdeas, setSavedIdeas] = useState<NourishIdea[]>([]);
  const [preferences, setPreferencesState] = useState<NourishPreferences>(defaultPreferences);
  const [latestRecommendation, setLatestRecommendation] = useState<NourishRecommendation | null>(null);
  const [weeklyPlan, setWeeklyPlanState] = useState<NourishWeeklyPlan | null>(null);
  const [shoppingChecks, setShoppingChecks] = useState<Record<string, boolean>>({});
  const [hasPro, setHasPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const [storedIdeas, storedPreferences, storedPlan, storedChecks] = await Promise.all([AsyncStorage.getItem(SAVED_IDEAS_KEY), AsyncStorage.getItem(PREFERENCES_KEY), AsyncStorage.getItem(WEEKLY_PLAN_KEY), AsyncStorage.getItem(SHOPPING_CHECKS_KEY)]);
      if (storedIdeas) setSavedIdeas(JSON.parse(storedIdeas));
      if (storedPreferences) setPreferencesState({ ...defaultPreferences, ...JSON.parse(storedPreferences) });
      if (storedPlan) setWeeklyPlanState(JSON.parse(storedPlan));
      if (storedChecks) setShoppingChecks(JSON.parse(storedChecks));
      try { setHasPro(await getPremiumStatus()); } catch { setHasPro(false); } finally { setHydrated(true); }
    };
    hydrate();
  }, []);

  useEffect(() => { if (hydrated) AsyncStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(savedIdeas)); }, [hydrated, savedIdeas]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)); }, [hydrated, preferences]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(WEEKLY_PLAN_KEY, JSON.stringify(weeklyPlan)); }, [hydrated, weeklyPlan]);
  useEffect(() => { if (hydrated) AsyncStorage.setItem(SHOPPING_CHECKS_KEY, JSON.stringify(shoppingChecks)); }, [hydrated, shoppingChecks]);

  const saveIdea = useCallback((idea: NourishIdea) => setSavedIdeas((current) => (current.some((saved) => saved.id === idea.id) ? current : [idea, ...current])), []);
  const removeIdea = useCallback((id: string) => setSavedIdeas((current) => current.filter((idea) => idea.id !== id)), []);
  const setPreferences = useCallback((nextPreferences: NourishPreferences) => setPreferencesState(nextPreferences), []);
  const setWeeklyPlan = useCallback((plan: NourishWeeklyPlan | null) => setWeeklyPlanState(plan), []);
  const toggleShoppingItem = useCallback((id: string) => setShoppingChecks((current) => ({ ...current, [id]: !current[id] })), []);
  const refreshSubscription = useCallback(async () => setHasPro(await getPremiumStatus()), []);

  const value = useMemo(() => ({ savedIdeas, preferences, latestRecommendation, weeklyPlan, shoppingChecks, hasPro, hydrated, saveIdea, removeIdea, setPreferences, setLatestRecommendation, setWeeklyPlan, toggleShoppingItem, setHasPro, refreshSubscription }), [savedIdeas, preferences, latestRecommendation, weeklyPlan, shoppingChecks, hasPro, hydrated, saveIdea, removeIdea, setPreferences, setWeeklyPlan, toggleShoppingItem, refreshSubscription]);
  return <NourishContext.Provider value={value}>{children}</NourishContext.Provider>;
}

export function useNourish() {
  const context = useContext(NourishContext);
  if (!context) throw new Error("useNourish must be used within NourishProvider");
  return context;
}
