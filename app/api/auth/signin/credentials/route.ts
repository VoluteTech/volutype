import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = (formData.get("email") || "").toString();
    const password = (formData.get("password") || "").toString();

    console.log("Sign in attempt for:", email);

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log("User found:", user?.id);

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    console.log("Creating session for user:", user.id);

    // Save to database
    const session = await prisma.userSession.create({
      data: {
        sessionToken: token,
        userId: user.id,
        expires,
      },
    });

    console.log("Session created:", session.id);

    // Create response with cookie
    const response = NextResponse.json({ success: true, userId: user.id });
    response.cookies.set("volutype_session", token, {
      expires,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Sign in error:", error.message || error);
    console.error("Stack:", error.stack);
    return NextResponse.json({ error: "Internal error: " + error.message }, { status: 500 });
  }
}