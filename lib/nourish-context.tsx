import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { getPremiumStatus } from "@/lib/revenuecat";
import type { DietaryOption, NourishIdea, NourishRecommendation } from "@/shared/nourish";

const SAVED_IDEAS_KEY = "nourishloop.savedIdeas.v1";
const PREFERENCES_KEY = "nourishloop.preferences.v1";

export type NourishPreferences = {
  dietary: DietaryOption[];
  gentleReminders: boolean;
};

type NourishContextValue = {
  savedIdeas: NourishIdea[];
  preferences: NourishPreferences;
  latestRecommendation: NourishRecommendation | null;
  hasPro: boolean;
  hydrated: boolean;
  saveIdea: (idea: NourishIdea) => void;
  removeIdea: (id: string) => void;
  setPreferences: (preferences: NourishPreferences) => void;
  setLatestRecommendation: (recommendation: NourishRecommendation) => void;
  setHasPro: (hasPro: boolean) => void;
  refreshSubscription: () => Promise<void>;
};

const NourishContext = createContext<NourishContextValue | null>(null);

export function NourishProvider({ children }: PropsWithChildren) {
  const [savedIdeas, setSavedIdeas] = useState<NourishIdea[]>([]);
  const [preferences, setPreferencesState] = useState<NourishPreferences>({ dietary: [], gentleReminders: true });
  const [latestRecommendation, setLatestRecommendation] = useState<NourishRecommendation | null>(null);
  const [hasPro, setHasPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const [storedIdeas, storedPreferences] = await Promise.all([
        AsyncStorage.getItem(SAVED_IDEAS_KEY),
        AsyncStorage.getItem(PREFERENCES_KEY),
      ]);
      if (storedIdeas) setSavedIdeas(JSON.parse(storedIdeas));
      if (storedPreferences) setPreferencesState(JSON.parse(storedPreferences));
      try {
        setHasPro(await getPremiumStatus());
      } catch {
        setHasPro(false);
      } finally {
        setHydrated(true);
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(savedIdeas));
  }, [hydrated, savedIdeas]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }, [hydrated, preferences]);

  const saveIdea = useCallback((idea: NourishIdea) => {
    setSavedIdeas((current) => (current.some((saved) => saved.id === idea.id) ? current : [idea, ...current]));
  }, []);

  const removeIdea = useCallback((id: string) => {
    setSavedIdeas((current) => current.filter((idea) => idea.id !== id));
  }, []);

  const setPreferences = useCallback((nextPreferences: NourishPreferences) => setPreferencesState(nextPreferences), []);
  const refreshSubscription = useCallback(async () => setHasPro(await getPremiumStatus()), []);

  const value = useMemo(
    () => ({ savedIdeas, preferences, latestRecommendation, hasPro, hydrated, saveIdea, removeIdea, setPreferences, setLatestRecommendation, setHasPro, refreshSubscription }),
    [savedIdeas, preferences, latestRecommendation, hasPro, hydrated, saveIdea, removeIdea, setPreferences, refreshSubscription],
  );

  return <NourishContext.Provider value={value}>{children}</NourishContext.Provider>;
}

export function useNourish() {
  const context = useContext(NourishContext);
  if (!context) throw new Error("useNourish must be used within NourishProvider");
  return context;
}
