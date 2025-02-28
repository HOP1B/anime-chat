import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.nextUrl);
    const userId = url.searchParams.get("userId");
    const model = url.searchParams.get("model");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: model
          ? { where: { model } } // ✅ Fetch only messages for the given model
          : true, // ✅ Fetch all messages if no model is provided
      },
    });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error("API History Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
