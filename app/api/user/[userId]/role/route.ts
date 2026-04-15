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
    const currentUser = await getCurrentUser();

    if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          error: "You are not authorized to access this page",
        },
        { status: 401 },
      );
    }

    // Prevent users from changing their own role
    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error: "You are not authorized to change your own role",
        },
        { status: 403 },
      );
    }

    const { role } = await request.json();

    // Validate role
    const validateRoles = [Role.MANAGER, Role.USER];
    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role specified or you cannot have more than one admin role",
        },
        { status: 400 },
      );
    }

    // Update user's role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: { team: true },
    });

    return NextResponse.json(
      {
        user: updatedUser,
        message: `User role successfully updated to ${role}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user's role:", error);
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
