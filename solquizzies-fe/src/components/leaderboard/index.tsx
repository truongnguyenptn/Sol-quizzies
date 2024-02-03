import React from 'react';
// import DetailsDialog from "@/components/DetailsDialog";
// import PrizeColumnCard from "@/components/prize-set-up/PrizeColumnCard";
// import {MintNFTForm} from "@/components/prize-set-up/mint-nft-form";

import PlayerRank from "@/components/leaderboard/PlayerRank";
import "./style.css";

interface Props {
rewards?: number[],
playersData?: 
  {
    pubkey: string,
    rank: string,
    score: string
  } []
}
export const Leaderboard = ({ rewards = [0.5, 0.3, 0.2], playersData = [
    {
        pubkey: "DTAUanih9wFGJ3o1jt5aj65AGEq8VG2mg3grRQE78wDs",
        rank: 1,
        score: 100
    },
    {
        pubkey: "DTAUanih9wFGJ3o1jt5aj65AGEq8VG2mg3grRQE78wDs",
        rank: 2,
        score: 90
    },
    {
        pubkey: "DTAUanih9wFGJ3o1jt5aj65AGEq8VG2mg3grRQE78wDs",
        rank: 3,
        score: 80
    },
] }: Props) => {

    return (
        <main className="p-8 mx-auto ">
            <div
                id="#lb"
                className="flex flex-col items-center justify-center gap-16 px-4 py-8"
                >
                <div className='w-1/2'>
                    
                    <section className="bg-black p-4 rounded-2xl w-full border-2 border-black w-full mb-4">
                        <h2 className="outline-text text-4xl font-bold text-center uppercase">Congratulation!🎉🎉</h2>
                    </section>
                
                    <div className="rounded-2xl border-2 border-b-[6px] border-r-[6px] border-black px-4 py-4 text-xl font-bold md:inline-block dark:border-white w-full">
                        <div className="flex items-center space-x-4 p-4 rounded-lg ">
                            <span className="text-black mr-6">Rank</span>
                            <span className="text-black items-center justify-center flex flex-1">Wallet</span>
                            
                            <span className="flex items-center justify-center flex-1 text-black font-semibold">
                                Score
                            </span>

                            <span className="flex items-center text-black font-semibold">
                                Rewards
                            </span>
                            
                        </div>

                        {/* Render player ranks */}
                        {playersData.slice(0, rewards.length).map((player, index) => (
                            <PlayerRank 
                                key={player.pubkey}
                                rank={player.rank}
                                pubkey={player.pubkey}
                                score={player.score}
                                reward={rewards[index]}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
};

