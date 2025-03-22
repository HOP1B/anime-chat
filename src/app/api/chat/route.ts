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
    const { userId, prompt, modelName, conversationId } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not registered." },
        { status: 403 }
      );
    }

    let conversation;

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found!" },
          { status: 404 }
        );
      }
    } else {
      const model = await prisma.model.findUnique({
        where: { name: modelName },
      });
      if (!model) {
        return NextResponse.json(
          { error: "Model not found!" },
          { status: 404 }
        );
      }

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
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chatSession = ai.startChat({ generationConfig, history });

    await prisma.message.create({
      data: {
        role: "user",
        conversation: { connect: { id: conversation.id } },
        model: { connect: { id: conversation.modelId } },
        text: prompt,
      },
    });

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
        model: { connect: { id: conversation.modelId } },
        text,
      },
    });

    return NextResponse.json({ text, conversationId: conversation.id });
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
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId");
    const modelName = searchParams.get("modelName");

    // If conversationId is provided, return that specific conversation
    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } }, model: true },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found!" },
          { status: 404 }
        );
      }

      return NextResponse.json({ conversation });
    }

    // If userId and modelName are provided but no conversationId
    if (userId && modelName) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json(
          { error: "User not registered." },
          { status: 403 }
        );
      }

      const model = await prisma.model.findUnique({
        where: { name: modelName },
      });
      if (!model) {
        return NextResponse.json(
          { error: "Model not found!" },
          { status: 404 }
        );
      }

      // Check if there are any existing conversations for this user/model
      const existingConversations = await prisma.conversation.findMany({
        where: { userId, modelId: model.id },
        orderBy: { createdAt: "desc" },
        take: 1,
      });

      let conversation;

      if (existingConversations.length > 0) {
        // Use the most recent conversation if it exists
        conversation = await prisma.conversation.findUnique({
          where: { id: existingConversations[0].id },
          include: { messages: { orderBy: { createdAt: "asc" } }, model: true },
        });
      } else {
        // Create a new conversation only if none exist
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
          include: { messages: { orderBy: { createdAt: "asc" } }, model: true },
        });
      }

      return NextResponse.json({
        history: conversation?.messages,
        conversationId: conversation?.id,
        model,
      });
    }

    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
