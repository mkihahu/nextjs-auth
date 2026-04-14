import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        message: "Logged out successfully.",
      },
      {
        status: 200,
      },
    );

    // Clear the authentication cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while logging out.",
      },
      {
        status: 500,
      },
    );
  }
}
