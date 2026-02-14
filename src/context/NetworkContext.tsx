"use client";

import React, { createContext, useContext, useState } from "react";

export type ChainMode = "HEDERA" | "BASE" | "ETHERLINK" | "OPBNB";

interface NetworkContextType {
  chainMode: ChainMode;
  setChainMode: (mode: ChainMode) => void;
  explorerUrl: (hashOrAddress: string, type: "tx" | "address") => string;
  chainName: string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  // Defaulting to ETHERLINK for current testing phase
  const [chainMode, setChainMode] = useState<ChainMode>("ETHERLINK");

  const chainName = {
    HEDERA: "Hedera Testnet",
    BASE: "Base Sepolia",
    ETHERLINK: "Etherlink Shadownet",
    OPBNB: "opBNB Testnet"
  }[chainMode];

  const explorerUrl = (hashOrAddress: string, type: "tx" | "address") => {
    const baseUrl = {
      HEDERA: "https://hashscan.io/testnet",
      BASE: "https://sepolia.basescan.org",
      ETHERLINK: "https://shadownet.explorer.etherlink.com",
      OPBNB: "https://opbnb-testnet.bscscan.com"
    }[chainMode];

    // Hedera has different URL structure, but for now assuming standard EVM path for simplicity in this context
    // or handling EVM specific paths. 
    // Actually Hedera Hashscan is /transaction/ or /account/
    if (chainMode === "HEDERA") {
         return `${baseUrl}/${type === "tx" ? "transaction" : "account"}/${hashOrAddress}`;
    }

    return `${baseUrl}/${type}/${hashOrAddress}`;
  };

  return (
    <NetworkContext.Provider value={{ chainMode, setChainMode, explorerUrl, chainName }}>
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
