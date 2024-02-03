
// import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"


export default function PlayerRank(props: { pubkey: string, rank: number, score: number, reward: number}) {
  function formatPubkey(pubkey: string) {
    if (pubkey.length < 6) {
      return "Error"; 
    }
    return pubkey.slice(0, 8) + '...' + pubkey.slice(-10);
  }
  return (
    <div className="mt-6 space-y-8 w-full flex flex-col">
    <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-black flex-start">
      <span className="text-black mr-10">{props.rank}</span>
      <span className="text-black items-center justify-center flex-1">{formatPubkey(props.pubkey)}</span>
      
      <span className="flex pl-2 items-center justify-center text-black flex-1 font-semibold">
        {props.score}
        <TrophyIcon className="ml-2 text-yellow-400" />
      </span>
  
      <span className="flex items-center text-black font-semibold">
        {props.reward } SOL
      </span>
    </div>
  </div>
  
  )
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
