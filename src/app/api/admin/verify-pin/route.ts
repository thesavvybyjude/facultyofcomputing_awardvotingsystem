import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pin } = (await req.json()) as { pin: string };

    if (!pin) {
      return NextResponse.json(
        { valid: false, error: "PIN required" },
        { status: 400 }
      );
    }

    const isValid = pin === process.env.ADMIN_PIN;

    return NextResponse.json({ valid: isValid });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
