import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { Role } from "@/app/types";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const user = await getCurrentUser();

    if (!user || !checkUserPermission(user, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to access this page",
        },
        { status: 401 },
      );
    }

    const { teamId } = await request.json();

    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        return NextResponse.json(
          {
            error: "Team not found",
          },
          { status: 404 },
        );
      }
    }

    // Update user's team assignment
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { teamId: teamId || null },
      include: { team: true },
    });

    return NextResponse.json(
      {
        user: updatedUser,
        message: teamId
          ? "User successfully assigned to team"
          : "User successfully removed from team",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user's team:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found.")
    ) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        error: "An error occurred while updating the user's team",
      },
      { status: 500 },
    );
  }
}
