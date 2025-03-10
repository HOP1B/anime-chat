import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { name, prompt } = await req.json();
  const model = await prisma.model.create({
    data: {
      basePrompt: prompt,
      name,
    },
  });
  return NextResponse.json(model);
};
