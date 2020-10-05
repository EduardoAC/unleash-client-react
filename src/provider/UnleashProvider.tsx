import type { ReactNode } from "react";
import React, { createContext, useEffect } from "react";
import { UnleashClient } from "../client/UnleashClient";
import type { Config } from "../types/unleash-flags";

interface UnleashProviderProps {
  children: ReactNode;
  config: Config;
}

export const UnleashFlagsContext = createContext<UnleashClient | undefined>(undefined);

export function UnleashProvider(props: UnleashProviderProps) {
  const { children, config } = props;  
  const flagsClientInstance = new UnleashClient(config);

  // call the init on load
  useEffect(() => {
    flagsClientInstance.start();
    return () => {
      flagsClientInstance.stop();
    }
  }, []);

  return (
    <UnleashFlagsContext.Provider value={flagsClientInstance}>
      {children}
    </UnleashFlagsContext.Provider>
  );
}
