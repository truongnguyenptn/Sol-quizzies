// pages/api/getGameById.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  res: Response
) {
  try {

    const request = await req.json();
    const limit = request.limit;
    const userId = request.userId;
    if (!limit) {
        return NextResponse.json(
            { error: "You must provide a game Id" },
            {
              status: 400,
            }
          );
    }

      const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: "desc",
    },
  });
    if (!games) {
        return NextResponse.json(
            { error: "Game not found." },
            {
              status: 400,
            }
          );
    }

    return NextResponse.json(
        {game: games},
        {
          status: 200,
        }
      );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: "Game not found." },
        {
          status: 500,
        }
      );
  }
}
