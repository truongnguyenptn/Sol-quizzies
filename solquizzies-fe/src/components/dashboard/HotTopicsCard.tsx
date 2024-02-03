"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WordCloud from "../WordCloud";
import axios from "axios";
import { config } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";

type Props = {};

const getTopics = async ()=> {
  const data = await axios.get(`${config.NEXT_PUBLIC_GPTSERVICE_API_URL}/games`,);
    const formattedTopics = data?.data?.map((game) => {
    const value = (new Date(game.timeStarted).getTime() % 100)+1;
    return {
      text: game.topic,
      value: value || 1,
      id: game.id,
    };
  });
  return formattedTopics;
}

const HotTopicsCard = (props: Props) => {
  // const topics = await prisma.topic_count.findMany({});
  // const formattedTopics = topics.map((topic) => {
  //   return {
  //     text: topic.topic,
  //     value: topic.count,
  //   };
  // });
  // const formattedTopics = await getTopics();
  // console.log(formattedTopics);
  const { data, isLoading } = useQuery([props], () => getTopics());
  console.log({test:data});
  return (
    <Card className="">
      <CardHeader className="col-span-4 ">
        <CardTitle className="text-2xl font-bold ">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2 col-span-6">
      {data && <WordCloud formattedTopics={data} />}
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
