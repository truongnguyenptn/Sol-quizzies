import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import WordCloud from "../WordCloud";
import { prisma } from "@/lib/db";

// type Props = {};

const PrizeColumnCard = async (props: {rank: number}) => {
  // const topics = await prisma.topic_count.findMany({});
  // const formattedTopics = topics.map((topic) => {
  //   return {
  //     text: topic.topic,
  //     value: topic.count,
  //   };
  // });
  
  return (
    <Card className="col-span-4 flex items-center justify-between" >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Player Rank {props.rank} </CardTitle>
        {/* <CardDescription>
          Set up prizes for top 1 player
        </CardDescription> */}
      </CardHeader>

      <div className="mr-8">
        <button
            className="px-4 py-2 text-white mr-4 rounded-xl bg-slate-800"
        >
            Create prize
        </button>
      
        <button
            className="px-4 py-2 text-white rounded-xl bg-red-600"
        >
            Cancel set up
        </button>
      </div>      
      
      {/* <MintNFTForm/> */}
    </Card>
  );
};

export default PrizeColumnCard;
