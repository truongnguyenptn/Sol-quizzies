"use client";
import OpenEnded from "@/components/OpenEnded";
import { redirect } from "next/navigation";
import React from "react";
import LoadingQuestions from "@/components/LoadingQuestions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  params: {
    gameId: string;
  };
};
const retrievePosts = async (gameId: string) => {
  try {
    const response = await axios.post(`/api/mcq`, { gameId });
    return response;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return { ok: false, error: "Failed to retrieve data" };
  }
};
const OpenEndedPage = ({ params: { gameId } }: Props) => {

  // const game = await prisma.game.findUnique({
  //   where: {
  //     id: gameId,
  //   },
  //   include: {
  //     questions: {
  //       select: {
  //         id: true,
  //         question: true,
  //         answer: true,
  //       },
  //     },
  //   },
  // });

  const { data, isLoading } = useQuery([gameId], () => retrievePosts(gameId), {
    enabled: true
  });

  if ( isLoading ) return <LoadingQuestions finished = {!isLoading}/>;
  if (!data?.data?.game || data?.data?.game.gameType === "mcq") {
    return redirect("/quiz");
  }
  return <OpenEnded game={data?.data?.game} />;
};

export default OpenEndedPage;
