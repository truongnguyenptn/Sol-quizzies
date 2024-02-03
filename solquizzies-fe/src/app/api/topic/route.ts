// pages/api/getGameById.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  res: Response
) {
  try {
    console.log("topic routes called");
    const topics = await prisma.topic_count.findMany({});
    const formattedTopics = topics.map((topic) => {
      return {
        id: topic.id,
        text: topic.topic,
        value: topic.count,
      };
    });

    return NextResponse.json(
        {formattedTopics: formattedTopics},
        {
          status: 200,
        }
      );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: "formattedTopics not found." },
        {
          status: 500,
        }
      );
  }
}
