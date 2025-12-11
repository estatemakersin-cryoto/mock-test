import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { mobile, password } = await req.json();

    // Validate fields
    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { error: "Enter valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { mobile },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Mobile number not registered" },
        { status: 404 }
      );
    }

    // Password check
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create token
    const token = await signToken({
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      packagePurchased: user.packagePurchased,
    });

    // Redirect based on role
    const redirect = user.isAdmin ? "/admin" : "/dashboard";

    // Create response
    const res = NextResponse.json({
      message: "Login successful",
      redirect,
    });

    // Cookie configuration for Vercel
    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
