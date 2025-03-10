import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

const ai = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const POST = async (req: NextRequest) => {
  const { userId, prompt, modelName } = await req.json();

  const model = await prisma.model.findFirst({ where: { name: modelName } });
  if (!model) throw new Error("Model not found!");

  let conversation = await prisma.conversation.findFirst({
    where: {
      modelId: model.id,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  let chatSession: ChatSession | undefined;

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        model: {
          connect: {
            id: model.id,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    chatSession = ai.startChat({
      generationConfig: {
        temperature: 0.95,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [],
    });
  } else {
    const history = conversation.messages.map((message) => ({
      role: message.role,
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

  await prisma.message.create({
    data: {
      conversation: {
        connect: {
          id: conversation.id,
        },
      },
      role: "user",
      text: prompt,
    },
  });
  const result = await chatSession.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  // Add the AI's response to the database
  await prisma.message.create({
    data: {
      conversation: {
        connect: {
          id: conversation.id,
        },
      },
      role: "model",
      text,
    },
  });
  return NextResponse.json({ text });
};
