import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    const { name, prompt, imageUrl, description, nameOfChar } = JSON.parse(
      rawBody || "{}"
    ); // Handle empty body safely

    if (!name || !prompt || !nameOfChar || !imageUrl || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const model = await prisma.model.create({
      data: {
        name,
        basePrompt: prompt,
        imageUrl,
        description,
        nameOfChar,
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

export const GET = async () => {
  const models = await prisma.model.findMany();
  return NextResponse.json(models);
};
