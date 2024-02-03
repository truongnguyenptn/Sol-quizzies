"use client";
import OpenEnded from "@/components/OpenEnded";
import React, { useState } from "react";
import LoadingQuestions from "@/components/LoadingQuestions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import {  Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";

type Props = {
  params: {
    gameId: string;
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
const handleStartGame = async (gameId: string, userId: string, router, onStart: ()=> void) => {
  try {
    onStart();
    const response = await axios.post(`${config.NEXT_PUBLIC_GPTSERVICE_API_URL}/games/start`, { gameId, userId });
    if (response.data) {
        // Redirect to the play page
        router.push(`/game/play/mcq/${gameId}/${response.data.id}`);
    }}
   catch (error) {
    console.error("Error retrieving data:", error);
    return { ok: false, error: "Failed to retrieve data" };
  }
};
const GamePage = ({ params: { gameId } }: Props) => {



  const { data, isLoading } = useQuery([gameId], () => getQuestions(gameId), {
    enabled: true
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if ( isLoading ) return <LoadingQuestions finished = {!isLoading}/>;

  return (
    <div>
    <h1>{data?.game?.type}</h1>
    {/* Display other game details */}
    <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
  
      <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Quizzies game
        </CardTitle>
        <CardDescription>
          Play quizzies and learn
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] flex justify-center">
      <Button
        loading={loading}
        onClick={() => handleStartGame(gameId, "user-test", router, () => setLoading(true))} 
        className={cn(buttonVariants({ size: "lg" }), "px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap")}
      >
             Start Game
      </Button>
      </CardContent>
    </Card>
    </div>
  </div>    
    );
};

export default GamePage;
