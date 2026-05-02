import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json({ error: "Error signing out" }, { status: 500 });
  }
}