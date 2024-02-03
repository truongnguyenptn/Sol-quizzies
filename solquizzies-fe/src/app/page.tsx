"use client"
import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
import WalletMultiButtonDynamic from "@/components/WalletButton";
import { useState, useCallback } from "react";
import { TLog } from "@/types";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey } = useWallet();
  // const session = await getServerSession();
  if (publicKey) {
    redirect("/dashboard");
  }
 
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>Welcome to Quizzzy 🔥!</CardTitle>
          <CardDescription>
            Quizzzy is a platform for creating quizzes using AI!. Get started by
            loggin in below!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <SignInButton text="Sign in"/> */}
          <Button onClick={() => redirect("/dashboard")}>Go to dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
}
