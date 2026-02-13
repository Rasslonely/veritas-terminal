export const ADMIN_WALLETS = [
  "0x5f80439206742Ac04e031665d1DFEDe11C9730aD", // TODO: REPLACE THIS WITH YOUR WALLET
];

export function isAdmin(address: string | undefined | null): boolean {
  if (!address) return false;
  return ADMIN_WALLETS.some(
    (admin) => admin.toLowerCase() === address.toLowerCase()
  );
}
