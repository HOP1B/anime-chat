import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const ai = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 0.95,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId, prompt, modelName } = await req.json();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not registered. Access denied." },
        { status: 403 }
      );
    }

    const model = await prisma.model.findUnique({ where: { name: modelName } });
    if (!model) {
      return NextResponse.json({ error: "Model not found!" }, { status: 404 });
    }

    let conversation = await prisma.conversation.findFirst({
      where: { modelId: model.id, userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user: { connect: { id: userId } },
          model: { connect: { id: model.id } },
          messages: {
            create: [
              { role: "user", text: model.basePrompt, modelId: model.id },
            ],
          },
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    const history = conversation.messages.map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    if (history.length === 0 || history[0].role !== "user") {
      history.unshift({ role: "user", parts: [{ text: model.basePrompt }] });
    }

    const chatSession = ai.startChat({
      generationConfig,
      history,
    });

    await prisma.message.create({
      data: {
        role: "user",
        conversation: { connect: { id: conversation.id } },
        model: { connect: { id: model.id } },
        text: prompt,
      },
    });

    // Get AI response
    let text = "";
    try {
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      text = await response.text();
    } catch (aiError) {
      console.error("AI error:", aiError);
      return NextResponse.json(
        { error: "AI processing error" },
        { status: 500 }
      );
    }

    await prisma.message.create({
      data: {
        role: "model",
        conversation: { connect: { id: conversation.id } },
        model: { connect: { id: model.id } },
        text,
      },
    });

    return NextResponse.json({ text, history });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const userId = searchParams.get("userId")!;
    const modelName = searchParams.get("modelName")!;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not registered. Access denied." },
        { status: 403 }
      );
    }

    const model = await prisma.model.findUnique({ where: { name: modelName } });
    if (!model) {
      return NextResponse.json({ error: "Model not found!" }, { status: 404 });
    }

    let conversation = await prisma.conversation.findFirst({
      where: { modelId: model.id, userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user: { connect: { id: userId } },
          model: { connect: { id: model.id } },
          messages: {
            create: [
              { role: "user", text: model.basePrompt, modelId: model.id },
            ],
          },
        },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
    }

    const history = conversation.messages.map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    if (history.length === 0 || history[0].role !== "user") {
      history.unshift({ role: "user", parts: [{ text: model.basePrompt }] });
    }

    return NextResponse.json({ history, conversationId: conversation.id });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
