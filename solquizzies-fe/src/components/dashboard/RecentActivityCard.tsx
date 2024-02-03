"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import HistoryComponent from "../HistoryComponent";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {};

const retrieveTopics = async () => {
  try {
    const response = await axios.get(`/api/topic`);
    return response;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return { ok: false, error: "Failed to retrieve data" };
  }
};

const RecentActivityCard =  (props: Props) => {
  const { wallet, publicKey, connect, disconnect, signMessage, signIn } = useWallet();


  const { data, isLoading } = useQuery([publicKey], () => retrieveTopics());

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          You have played a total of {data?.data?.gamesCount || 0} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent limit={10} userId={String(publicKey?.toString())} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
