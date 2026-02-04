"use node";

export interface IBlockchainAdapter {
  /**
   * Logs evidence to the blockchain (HCS or EVM event).
   * @param evidence The JSON stringified evidence/argument to log.
   * @returns The transaction hash or sequence number.
   */
  logEvidence(evidence: string): Promise<string>;

  /**
   * Pays out a claim to a recipient.
   * @param amount The amount to pay in USDC/HBAR.
   * @param recipient The wallet address of the recipient.
   * @returns True if successful.
   */
  payoutClaim(amount: number, recipient: string): Promise<boolean>;
}

export async function getAdapter(mode: "HEDERA" | "BASE"): Promise<IBlockchainAdapter> {
  if (mode === "HEDERA") {
    // Dynamic import to avoid loading unused SDKs
    const { HederaAdapter } = await import("./HederaAdapter");
    return new HederaAdapter();
  } else {
    // Dynamic import for Base Adapter
    const { BaseAdapter } = await import("./BaseAdapter");
    return new BaseAdapter();
  }
}
