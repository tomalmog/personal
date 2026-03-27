import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/bmm/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

    const { name, config } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: "Agent name required" }, { status: 400 });
    if (!config?.systemPrompt?.trim()) return NextResponse.json({ error: "System prompt required" }, { status: 400 });

    const validatedConfig = {
      systemPrompt: config.systemPrompt.trim().slice(0, 10000),
      examplesText: typeof config.examplesText === "string" ? config.examplesText.slice(0, 1000000) : "",
      temperature: Math.max(0, Math.min(2, Number(config.temperature) || 0.7)),
      topP: Math.max(0.1, Math.min(1, Number(config.topP) || 0.9)),
      maxTokens: Math.max(64, Math.min(512, Math.floor(Number(config.maxTokens) || 256))),
      repetitionPenalty: Math.max(1, Math.min(2, Number(config.repetitionPenalty) || 1.1)),
    };

    const competition = await prisma.competition.findFirst({ where: { status: { in: ["active", "draft"] } }, orderBy: { createdAt: "desc" } });
    if (!competition) return NextResponse.json({ error: "No active competition." }, { status: 400 });

    const agentCount = await prisma.agent.count({ where: { competitionId: competition.id } });
    if (agentCount >= competition.maxAgents) return NextResponse.json({ error: "Competition full." }, { status: 400 });

    const userName = session.user.name;
    const userEmail = session.user.email;
    let user = await prisma.user.findFirst({ where: { OR: [...(userEmail ? [{ githubLogin: userEmail }] : []), ...(userName ? [{ githubLogin: userName }] : [])] } });
    if (!user) user = await prisma.user.create({ data: { githubId: `auto-${Date.now()}`, githubLogin: userName || userEmail || "unknown" } });

    const existing = await prisma.agent.findFirst({ where: { userId: user.id, competitionId: competition.id } });
    if (existing) return NextResponse.json({ error: "You already have an agent." }, { status: 409 });

    const agent = await prisma.agent.create({ data: { userId: user.id, competitionId: competition.id, name: name.trim(), config: validatedConfig } });
    await prisma.portfolio.create({ data: { agentId: agent.id, competitionId: competition.id, cash: 100000, holdings: {}, totalValue: 100000 } });

    return NextResponse.json({ id: agent.id, name: agent.name, message: "Agent submitted." });
  } catch (err) {
    console.error("[submit]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
