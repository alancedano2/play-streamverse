// src/app/api/request-game-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_Re8BEsPK_5VGhktxUBy4ywESNNqx7LL1u");

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "fraelvillegasplay8@gmail.com",
      subject,
      html,
    });

    return NextResponse.json({ success: true, message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}
