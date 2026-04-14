import { Prisma } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You are not authorized to access this page",
        },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    // Build where clause based on user role
    const where: Prisma.UserWhereInput = {};
    if (user.role === "ADMIN") {
      // Admin can see all users
    } else if (user.role === "MANAGER") {
      // Manager can see users in their team, or cross team users but not accross managers
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      // Regular users can only see their team members
      where.teamId = user.teamId;
      where.role = { not: Role.ADMIN };
    }

    // Additional filters
    if (teamId) {
      where.teamId = teamId;
    }
    if (role) {
      where.role = role as Role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while fetching users",
      },
      { status: 500 },
    );
  }
}
