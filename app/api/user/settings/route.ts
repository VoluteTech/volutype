import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { theme: "default", caretStyle: "block", wordCount: 30 },
      { status: 200 }
    );
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    theme: settings?.theme || "default",
    caretStyle: settings?.caretStyle || "block",
    wordCount: settings?.wordCount || 30,
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { theme, caretStyle, wordCount } = body;

  const settings = await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: {
      ...(theme && { theme }),
      ...(caretStyle && { caretStyle }),
      ...(wordCount && { wordCount }),
    },
    create: {
      userId: session.user.id,
      theme: theme || "default",
      caretStyle: caretStyle || "block",
      wordCount: wordCount || 30,
    },
  });

  return NextResponse.json({
    theme: settings.theme,
    caretStyle: settings.caretStyle,
    wordCount: settings.wordCount,
  });
}