"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomConnectButton({ className }: { className?: string }) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === "authenticated");

        return (
          <div
            className={cn("w-full transition-opacity duration-200", className, {
              "opacity-0 pointer-events-none select-none": !ready,
            })}
            aria-hidden={!ready}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button 
                    onClick={openConnectModal} 
                    className="w-full gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    variant="outline"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Terminal
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" className="w-full">
                    Wrong Network
                  </Button>
                );
              }

              return (
                <div className="flex gap-2 w-full">
                  <Button 
                    onClick={openAccountModal} 
                    variant="outline"
                    className="flex-1 bg-background/50 backdrop-blur-md border-primary/20"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
