import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, mobile } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate unique registration number
    const regNo = "MR" + Math.floor(100000 + Math.random() * 900000);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (no free tests now)
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobile,
        registrationNo: regNo,
        passwordHash: hashedPassword,
        // testsRemaining → default 0
        // testsUnlocked → default 0
      },
    });

    // JWT for login session
    const token = await signToken({
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile || null,
      isAdmin: user.isAdmin,
      packagePurchased: user.packagePurchased ?? false,
    });

    const res = NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        registrationNo: user.registrationNo,
        testsRemaining: user.testsRemaining,
        isAdmin: user.isAdmin,
      },
    });

    // Set cookie
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
