import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { TLog } from "@/types";
import { SolanaSignInInput } from "@solana/wallet-standard-features";

export const createSignInData = async (): Promise<SolanaSignInInput> => {
  const now: Date = new Date();
  const uri = window.location.href
  const currentUrl = new URL(uri);
  const domain = currentUrl.host;

  // Convert the Date object to a string
  const currentDateTime = now.toISOString();
  const signInData: SolanaSignInInput = {
    domain,
    statement: "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
    version: "1",
    nonce: "oBbLoEldZs",
    chainId: "mainnet",
    issuedAt: currentDateTime,
    resources: ["https://example.com", "https://phantom.app/"],
  };

  return signInData;
};

type Props = { text: string };

const SignInButton = ({ text }: Props) => {
  const { wallet, publicKey, connect, disconnect, signMessage, signIn } = useWallet();
  const [logs, setLogs] = useState<TLog[]>([]);
  const createLog = useCallback(
    (log: TLog) => {
      return setLogs((logs) => [...logs, log]);
    },
    [setLogs]
  );
  const handleSignIn = useCallback(async () => {
    const signInData = await createSignInData();
    console.log("ok");
    try {
      const {account, signedMessage, signature} = await signIn?.(signInData);
      console.log(account,signedMessage,signature);
      createLog({
        status: 'success',
        method: 'signIn',
        message: `Message signed: ${JSON.stringify(signedMessage)} by ${account.address} with signature ${JSON.stringify(signature)}`,
      });
    } catch (error) {
      createLog({
        status: 'error',
        method: 'signIn',
        message: error.message,
      });
    }
  }, [createLog, publicKey, signIn, wallet]);
  return (
    <Button
      onClick={() => {
        handleSignIn()
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButton;
