import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatId, message } = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ success: false, error: '系統未設定 TELEGRAM_BOT_TOKEN 環境變數' }, { status: 400 });
    }

    if (!chatId || !message) {
      return NextResponse.json({ success: false, error: '缺少必填參數' }, { status: 400 });
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ success: false, error: data.description || '發送失敗' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("TG Notify Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
