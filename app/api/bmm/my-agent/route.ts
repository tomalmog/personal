import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const userName = session.user.name;
  const userEmail = session.user.email;
  const user = await prisma.user.findFirst({
    where: { OR: [...(userEmail ? [{ githubLogin: userEmail }] : []), ...(userName ? [{ githubLogin: userName }] : [])] },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const competition = await prisma.competition.findFirst({ where: { status: { in: ["active", "completed"] } }, orderBy: { createdAt: "desc" } });
  if (!competition) return NextResponse.json({ error: "No competition" }, { status: 404 });

  const agent = await prisma.agent.findFirst({
    where: { userId: user.id, competitionId: competition.id },
    include: { portfolios: { where: { competitionId: competition.id }, take: 1 } },
  });
  if (!agent) return NextResponse.json({ error: "No agent" }, { status: 404 });

  const portfolio = agent.portfolios[0];
  return NextResponse.json({
    id: agent.id, name: agent.name,
    totalValue: portfolio ? Number(portfolio.totalValue) : 100000,
    cash: portfolio ? Number(portfolio.cash) : 100000,
    pnl: (portfolio ? Number(portfolio.totalValue) : 100000) - 100000,
    holdings: portfolio ? portfolio.holdings : {},
    tradeCount: await prisma.action.count({ where: { agentId: agent.id, actionType: { in: ["buy", "sell"] }, rejected: false } }),
    totalInferences: agent.totalInferences,
  });
}
