import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const userId = searchParams.get("userId");

    // Get optional ordering parameters
    const orderBy = searchParams.get("orderBy") || "createdAt"; // default to createdAt
    const order =
      searchParams.get("order")?.toLowerCase() === "asc" ? "asc" : "desc"; // default to desc
    const limit = Number(searchParams.get("limit")) || undefined; // optional limit

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Define dynamic orderBy object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderByOption: any = {};
    orderByOption[orderBy] = order;

    const userChatInteractions = await prisma.conversation.findMany({
      where: {
        userId: userId,
      },
      include: {
        model: true,
      },
      orderBy: orderByOption,
      take: limit, // Only include if limit is specified
    });

    return NextResponse.json(userChatInteractions);
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
