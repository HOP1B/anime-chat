import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Ensure request body is valid
    if (!req.body) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.msg) {
      return NextResponse.json(
        { error: "Message (msg) is required" },
        { status: 400 }
      );
    }

    // Store user message in the database
    const message = await prisma.post.create({
      data: { msg: body.msg },
    });

    // Simulated AI response (Replace with actual AI logic)
    const aiResponse = `AI Response to: "${body.msg}"`;

    // Store AI response in the database
    await prisma.post.create({
      data: { msg: aiResponse },
    });

    return NextResponse.json({ userMessage: message, aiResponse });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
