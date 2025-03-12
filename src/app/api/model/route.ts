import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const { name, prompt } = await req.json();

    if (!name || !prompt) {
      return NextResponse.json(
        { error: "Missing name or prompt" },
        { status: 400 }
      );
    }

    const model = await prisma.model.create({
      data: {
        basePrompt: prompt,
        name,
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
