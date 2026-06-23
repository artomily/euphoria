// ─── wagmi configuration ─────────────────────────────────────────────────────
// Client-side wallet connection for Euphoria. Targets BNB Smart Chain (mainnet +
// testnet). Browser wallets are auto-discovered via EIP-6963, so `injected()`
// alone surfaces MetaMask/Rabby/etc.; WalletConnect adds mobile QR sign-in.
//
// SSR is enabled with cookie storage so the connection survives a server render
// (see app/layout.tsx → cookieToInitialState).

import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Free project id from https://cloud.walletconnect.com. WalletConnect is simply
// omitted when it's blank — injected wallets keep working.
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function getConfig() {
  return createConfig({
    chains: [bsc, bscTestnet],
    connectors: [
      injected(),
      ...(walletConnectProjectId
        ? [walletConnect({ projectId: walletConnectProjectId })]
        : []),
    ],
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    transports: {
      [bsc.id]: http(),
      [bscTestnet.id]: http(),
    },
  });
}

// Wagmi's register augmentation gives full type inference for the configured chains.
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
