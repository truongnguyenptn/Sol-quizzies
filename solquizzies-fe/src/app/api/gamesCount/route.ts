// pages/api/getGameById.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  res: Response
) {
  try {
    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");
   const games_count = await prisma.game.count({
    where: {
      userId: String(gameId),
    },
  });
    return NextResponse.json(
        {gamesCount: games_count},
        {
          status: 200,
        }
      );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: "games_count not found." },
        {
          status: 500,
        }
      );
  }
}
