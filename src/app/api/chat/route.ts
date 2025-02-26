import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OLLAMA_API_URL = process.env.OLLAMA_API_URL!;

export const POST = async (req: NextRequest) => {
  try {
    const { userId, prompt, model } = await req.json();
    if (!userId || !prompt || !model) {
      return NextResponse.json(
        { error: "Missing userId, prompt, or model" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { userId },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { userId } });
    }

    // Fetch all previous messages for the model
    const previousMessages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
        model: model, // Fetch only the chat history for the specified model
      },
      orderBy: { createdAt: "asc" }, // Oldest to newest
      select: { sender: true, text: true },
    });

    // Format the conversation history as a chat log
    let chatHistory = previousMessages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n");
    chatHistory += `\nuser: ${prompt}`; // Append new user message

    // Send history to Ollama
    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        prompt: chatHistory,
        stream: false,
      }),
    });

    const ollamaData = await ollamaResponse.json();
    console.log("Ollama Raw Response:", ollamaData);

    // Check if Ollama returned an error about the model
    if (ollamaData.error && ollamaData.error.includes("model")) {
      return NextResponse.json({ error: ollamaData.error }, { status: 400 });
    }

    const botResponse = ollamaData.response?.trim() || "No response from AI.";

    // ✅ Only create the model entry if we get a valid response from Ollama
    let existingModel = await prisma.model.findUnique({
      where: { name: model },
    });

    if (!existingModel) {
      existingModel = await prisma.model.create({
        data: { name: model },
      });
    }

    // ✅ Save messages only if the model exists (ensures valid model)
    await prisma.message.create({
      data: {
        text: prompt,
        sender: "user",
        conversationId: conversation.id,
        model: model,
        modelName: existingModel.name, // This will never save if model was invalid
      },
    });

    await prisma.message.create({
      data: {
        text: botResponse,
        sender: "bot",
        conversationId: conversation.id,
        model: model,
        modelName: existingModel.name,
      },
    });

    return NextResponse.json({ response: botResponse }, { status: 200 });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
