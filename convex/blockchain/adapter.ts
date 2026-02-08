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

  /**
   * Verified user stake (The Truth Bond).
   * @param amount Amount to stake.
   * @param userAddress The user's wallet.
   * @returns Transaction hash.
   */
  stake(amount: number, userAddress: string): Promise<string>;

  /**
   * Slashes a user's stake due to fraud.
   * @param userAddress The user who lied.
   * @param amount Amount to slash.
   * @returns Transaction hash.
   */
  slashStake(userAddress: string, amount: number): Promise<string>;

  /**
   * Returns a stake to the user after verification.
   * @param userAddress The user who told the truth.
   * @param amount Amount to return.
   * @returns Transaction hash.
   */
  returnStake(userAddress: string, amount: number): Promise<string>;
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
