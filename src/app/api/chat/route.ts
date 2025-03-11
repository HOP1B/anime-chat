import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const ai = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const POST = async (req: NextRequest) => {
  try {
    const { userId, prompt, modelName } = await req.json();

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not registered. Access denied." },
        { status: 403 }
      );
    }

    // Fetch model
    const model = await prisma.model.findFirst({ where: { name: modelName } });
    if (!model) {
      return NextResponse.json({ error: "Model not found!" }, { status: 404 });
    }

    let conversation;
    let chatSession: ChatSession;

    try {
      conversation = await prisma.conversation.findFirst({
        where: { modelId: model.id, userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!conversation) {
        // Create new conversation
        conversation = await prisma.conversation.create({
          data: {
            userId,
            model: { connect: { id: model.id } },
            messages: { create: [{ role: "model", text: model.basePrompt }] }, // System prompt
          },
          include: { messages: true },
        });

        chatSession = ai.startChat({
          generationConfig: {
            temperature: 0.95,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
          },
          history: [{ role: "user", parts: [{ text: model.basePrompt }] }], // Ensure proper first message
        });
      } else {
        const history = conversation.messages.map((message) => ({
          role: message.role === "model" ? "user" : message.role, // Ensure correct role mapping
          parts: [{ text: message.text }],
        }));

        chatSession = ai.startChat({
          generationConfig: {
            temperature: 0.95,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
          },
          history,
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Save user message
    try {
      await prisma.message.create({
        data: {
          role: "user",
          conversation: { connect: { id: conversation.id } },
          text: prompt,
        },
      });
    } catch (messageError) {
      console.error("Error saving user message:", messageError);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      );
    }

    // Get AI response
    let text = "";
    try {
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      text = await response.text(); // Await properly
    } catch (aiError) {
      console.error("AI error:", aiError);
      return NextResponse.json(
        { error: "AI processing error" },
        { status: 500 }
      );
    }

    // Save AI response
    try {
      await prisma.message.create({
        data: {
          role: "model", // Correct role for AI responses
          conversation: { connect: { id: conversation.id } },
          text,
        },
      });
    } catch (messageError) {
      console.error("Error saving AI response:", messageError);
      return NextResponse.json(
        { error: "Failed to save AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
