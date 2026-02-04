import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VeritasVaultABI } from "@/lib/abi/VeritasVaultABI";
import { parseEther } from "viem";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VERITAS_VAULT_ADDRESS as `0x${string}`;

export function useVeritasVault() {
  const { 
    data: hash, 
    writeContract, 
    isPending: isConfirming 
  } = useWriteContract();

  const { 
    isLoading: isProcessing, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash });

  const payoutClaim = (recipient: string, claimId: string) => {
    if (!VAULT_ADDRESS) {
      console.error("Veritas Vault Address not found in env");
      return;
    }

    // Hardcoded 0.001 ETH (~$3) for demo purposes to avoid draining faucet
    // In production, this would be dynamic based on the claim value
    const AMOUNT_TO_PAY = parseEther("0.001"); 

    writeContract({
      address: VAULT_ADDRESS,
      abi: VeritasVaultABI,
      functionName: "payoutClaim",
      args: [recipient as `0x${string}`, claimId],
        value: AMOUNT_TO_PAY
    });
  };

  return {
    payoutClaim,
    hash,
    isConfirming,   // Wallet popup open
    isProcessing,   // Transaction submitted, waiting for block
    isConfirmed     // Transaction successful
  };
}
