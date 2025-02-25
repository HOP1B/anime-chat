/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { userId } = req.query;
//   if (!userId) {
//     return res.status(400).json({ error: "Missing userId" });
//   }

//   try {
//     const conversations = await prisma.conversation.findMany({
//       where: { userId: userId as string },
//       include: { messages: true },
//     });

//     res.json({ conversations });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
