import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const { id, name, email, image } = await req.json();

    if (!id || !email) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    // Upsert: Update if exists, otherwise create
    await prisma.user.upsert({
      where: { id },
      update: { name, email, image },
      create: { id, name, email, image },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
