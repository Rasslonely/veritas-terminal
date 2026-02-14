import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const etherlinkTestnet = {
  id: 127823,
  name: 'Etherlink Testnet',
  nativeCurrency: { name: 'Tezos', symbol: 'XTZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://node.shadownet.etherlink.com'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://testnet-explorer.etherlink.com' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'Veritas Terminal',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base, baseSepolia, etherlinkTestnet],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [etherlinkTestnet.id]: http(),
  },
  ssr: true,
});
