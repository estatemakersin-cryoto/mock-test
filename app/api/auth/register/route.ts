import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, mobile } = await req.json();

    // ----------------------------------
    // 1️⃣ Validate name/email/password
    // ----------------------------------
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // ----------------------------------
    // 2️⃣ MOBILE NUMBER SANITIZATION
    // ----------------------------------

    let cleanMobile = "";
    if (mobile) {
      cleanMobile = mobile.replace(/[^0-9]/g, ""); // remove spaces, +, -

      // Remove 91 prefix if user typed +91 or 091 or 0091
      if (cleanMobile.length > 10) {
        cleanMobile = cleanMobile.slice(-10);
      }

      // Must be exactly 10 digits
      if (cleanMobile.length !== 10) {
        return NextResponse.json(
          { error: "Enter a valid 10-digit mobile number" },
          { status: 400 }
        );
      }
    }

    // ----------------------------------
    // 3️⃣ Check existing user
    // ----------------------------------
    const existing = await prisma.user.findFirst({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // ----------------------------------
    // 4️⃣ Generate registration number
    // ----------------------------------
    const regNo = "MR" + Math.floor(100000 + Math.random() * 900000);

    // ----------------------------------
    // 5️⃣ Hash password
    // ----------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ----------------------------------
    // 6️⃣ Create user (NO FREE TESTS)
    // ----------------------------------
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        mobile: cleanMobile,
        registrationNo: regNo,
        passwordHash: hashedPassword,
      },
    });

    // ----------------------------------
    // 7️⃣ Create session token
    // ----------------------------------
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

    // ----------------------------------
    // 8️⃣ Set cookie
    // ----------------------------------
    res.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
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
