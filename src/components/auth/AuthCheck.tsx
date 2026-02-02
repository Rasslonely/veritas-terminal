"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function AuthCheck() {
  const { address, isConnected } = useAccount();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isConnected && address) {
      storeUser({ walletAddress: address });
    }
  }, [isConnected, address, storeUser]);

  return null;
}
