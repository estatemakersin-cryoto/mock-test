// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    // Validate mobile number
    if (!mobile || mobile.length !== 10) {
      return NextResponse.json(
        { error: "Enter valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    // Find user by mobile
    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Mobile number not registered" },
        { status: 404 }
      );
    }

    // Create token (NO password verification)
    const token = await signToken({
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile,
      email: user.email,
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

    // Cookie configuration
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