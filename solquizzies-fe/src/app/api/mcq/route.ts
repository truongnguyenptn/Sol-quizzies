// pages/api/getGameById.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  res: Response
) {
  try {

    const request = await req.json();
    const gameId = request.gameId;
    console.log("apicalled",gameId);
    if (!gameId) {
        return NextResponse.json(
            { error: "You must provide a game Id" },
            {
              status: 400,
            }
          );
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            options: true,
          },
        },
      },
    });
   
  
    if (!game) {
        return NextResponse.json(
            { error: "Game not found." },
            {
              status: 400,
            }
          );
    }

    return NextResponse.json(
        {game: game},
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
