import DetailsDialog from "@/components/DetailsDialog";
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
  title: "Dashboard | Quizzzy",
  description: "Quiz yourself on anything!",
};

const Dasboard = (props: Props) => {
  // const session = await getAuthSession();
  // if (!session?.user) {
  //   redirect("/");
  // }

  let whatIsThisMessage = "Are you tired of mundane and repetitive quizzes? \n Say goodbye to the ordinary and embrace the extraordinary with Quizmefy\n Our platform is revolutionizing the quiz and trivia experience by harnessing the immense potential of artificial intelligence.";

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
        <DetailsDialog 
          message={whatIsThisMessage}
        />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard /> 
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-1">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  );
};

export default Dasboard;
