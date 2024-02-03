"use client"
import LoadingQuestions from "@/components/LoadingQuestions";
import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    gameId: string;
    attemptId: string;
  };
};
const getQuestions = async (gameId: string) => {
  try {
    const response = await axios.post(`/api/mcq`, { gameId });
    return response;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return { ok: false, error: "Failed to retrieve data" };
  }
};

const MCQPage =  ({ params: { gameId, attemptId } }: Props) => {
  // const session = await getAuthSession();
  // if (!session?.user) {
  //   return redirect("/");
  // }
  const { data, isLoading } = useQuery([gameId], () => getQuestions(gameId), { enabled: true});
  if ( isLoading ) return <LoadingQuestions finished = {!isLoading}/>;
  return <MCQ game={data?.data?.game} attemptId={attemptId} />;
};

export default MCQPage;
