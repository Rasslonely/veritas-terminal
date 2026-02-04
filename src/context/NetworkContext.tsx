"use client";

import React, { createContext, useContext, useState } from "react";

type ChainMode = "HEDERA" | "BASE";

interface NetworkContextType {
  chainMode: ChainMode;
  setChainMode: (mode: ChainMode) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [chainMode, setChainMode] = useState<ChainMode>("HEDERA");

  return (
    <NetworkContext.Provider value={{ chainMode, setChainMode }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
