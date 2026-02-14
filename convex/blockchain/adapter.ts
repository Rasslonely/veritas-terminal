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
  /**
   * Returns a stake to the user after verification.
   * @param userAddress The user who told the truth.
   * @param amount Amount to return.
   * @returns Transaction hash.
   */
  returnStake(userAddress: string, amount: number): Promise<string>;

  /**
   * Mints a Flash Policy NFT on Hedera (HTS).
   * @param userAddress The user receiving the policy.
   * @param metadata JSON metadata for the policy.
   * @returns Token ID (and Serial Number).
   */
  mintPolicyNFT(userAddress: string, metadata: string): Promise<string>;

  /**
   * Burns a Policy NFT upon claim payout.
   * @param tokenId The HTS Token ID.
   * @param serialNumber The serial number (if NFT) or amount.
   * @returns Transaction hash.
   */
  burnPolicyNFT(tokenId: string, serialNumber: number): Promise<string>;
}

export async function getAdapter(): Promise<IBlockchainAdapter> {
  const mode = process.env.NEXT_PUBLIC_CHAIN_MODE || "BASE";
  console.log(`🔌 Initializing Blockchain Adapter: ${mode}`);

  if (mode === "HEDERA") {
    const { HederaAdapter } = await import("./HederaAdapter");
    return new HederaAdapter();
  } 
  
  // For all EVM chains (BASE, ETHERLINK, OPBNB), use the polymorphic EVMAdapter
  const { EVMAdapter } = await import("./EVMAdapter");
  
  if (mode === "ETHERLINK") return new EVMAdapter("ETHERLINK");
  if (mode === "OPBNB") return new EVMAdapter("OPBNB");
  
  return new EVMAdapter("BASE");
}
