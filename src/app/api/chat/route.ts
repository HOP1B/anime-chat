import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const OLLAMA_API_URL = process.env.OLLAMA_API_URL!;

export const POST = async (req: NextRequest) => {
  try {
    const { userId, prompt } = await req.json();
    if (!userId || !prompt) {
      return NextResponse.json(
        { error: "Missing userId or prompt" },
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

    // Fetch all previous messages in this conversation
    const previousMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
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
        model: "gojo",
        prompt: chatHistory,
        stream: false,
      }),
    });

    const ollamaData = await ollamaResponse.json();
    console.log("Ollama Raw Response:", ollamaData);

    const botResponse = ollamaData.response?.trim() || "No response from AI.";

    // Save messages to database
    await prisma.message.create({
      data: { text: prompt, sender: "user", conversationId: conversation.id },
    });
    await prisma.message.create({
      data: {
        text: botResponse,
        sender: "bot",
        conversationId: conversation.id,
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
