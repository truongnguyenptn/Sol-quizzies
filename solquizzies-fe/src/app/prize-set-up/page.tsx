"use client"
import React from 'react';
import DetailsDialog from "@/components/DetailsDialog";
import PrizeColumnCard from "@/components/prize-set-up/PrizeColumnCard";
import {MintNFTForm} from "@/components/prize-set-up/mint-nft-form";
import { PlusIcon } from "lucide-react"

let index = 1;
const Page = () => {
    let whatIsThisMessage = "Set up prizes for players";
    return (
        <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Prize Set up</h2>
        <DetailsDialog 
            message= {whatIsThisMessage}
        />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        {/* <QuizMeCard /> */}
        {/* <HistoryCard /> */}
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <HotTopicsCard />
        <RecentActivityCard /> */}
      </div>
      <div>
        <PrizeColumnCard
            rank={index}
        />

        <button
            className="flex items-center justify-center px-8 py-4 mt-8 text-white text-center rounded-xl bg-slate-800"
        >
            Set up prize for next rank <PlusIcon className='ml-1 font-bold'></PlusIcon>
        </button>

      </div>
    </main>
    );
};

export default Page;
