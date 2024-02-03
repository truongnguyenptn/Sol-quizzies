"use client";
import { Adapter, WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import dynamic from "next/dynamic";
import { SolanaSignInInput } from '@solana/wallet-standard-features';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
export const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {


 const autoSignIn = useCallback(async (adapter: Adapter) => {
    // If the signIn feature is not available, return true
    if (!("signIn" in adapter)) return true;
  
    // Fetch the signInInput from the backend
    const createResponse = await fetch("/backend/createSignInData");
  
    const input: SolanaSignInInput = await createResponse.json();
  
    // Send the signInInput to the wallet and trigger a sign-in request
    const output = await adapter.signIn(input);
  
    // Verify the sign-in output against the generated input server-side
    let strPayload = JSON.stringify({ input, output });
    const verifyResponse = await fetch("/backend/verifySIWS", {
      method: "POST",
      body: strPayload,
    });
    const success = await verifyResponse.json();
  
    // If verification fails, throw an error
    if (!success) throw new Error("Sign In verification failed!");
  
    return false;
  }, []);
    const network = WalletAdapterNetwork.Devnet;
  
    const endpoint = `https://api.mainnet-beta.solana.com`;
  
    const wallets = useMemo(
      () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new TorusWalletAdapter(),
      ],
      [network]
  
    );
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider
        wallets={wallets}
        autoConnect={autoSignIn}
    >
        {children}
</WalletProvider>
</ConnectionProvider>
    );
};