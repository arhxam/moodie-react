import { createContext, useContext, type PropsWithChildren } from "react";

import type { MoodieProps } from "./moodie";

export type MoodieProviderProps = PropsWithChildren<{
  value: Partial<MoodieProps>;
}>;

const MoodieDefaultsContext = createContext<Partial<MoodieProps>>({});

export function MoodieProvider({ value, children }: MoodieProviderProps) {
  return (
    <MoodieDefaultsContext.Provider value={value}>
      {children}
    </MoodieDefaultsContext.Provider>
  );
}

export function useMoodieDefaults() {
  return useContext(MoodieDefaultsContext);
}
