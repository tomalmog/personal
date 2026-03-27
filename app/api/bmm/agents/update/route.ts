import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { agentId, config } = await request.json();
    if (!agentId || !config?.systemPrompt) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const userName = session.user.name;
    const userEmail = session.user.email;
    const user = await prisma.user.findFirst({ where: { OR: [...(userEmail ? [{ githubLogin: userEmail }] : []), ...(userName ? [{ githubLogin: userName }] : [])] } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent || agent.userId !== user.id) return NextResponse.json({ error: "Not your agent" }, { status: 403 });

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        config: {
          systemPrompt: config.systemPrompt.trim().slice(0, 10000), examplesText: "",
          temperature: Math.max(0, Math.min(2, Number(config.temperature) || 0.7)),
          topP: Math.max(0.1, Math.min(1, Number(config.topP) || 0.9)),
          maxTokens: Math.max(64, Math.min(512, Math.floor(Number(config.maxTokens) || 256))),
          repetitionPenalty: Math.max(1, Math.min(2, Number(config.repetitionPenalty) || 1.1)),
        },
      },
    });

    return NextResponse.json({ message: "Updated." });
  } catch (err) {
    console.error("[update]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
