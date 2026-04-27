import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let body;
    try {
      body = text ? JSON.parse(text) : {};
    } catch(e) {
      body = {};
    }
    
    // LINE 會發送一個空的 users 來做 Webhook 驗證，只要回應 200 即可。
    if (body.events && body.events.length > 0) {
      for (const event of body.events) {
        if (event.type === 'message' && event.message.type === 'text') {
          console.log(`Received message: ${event.message.text}`);
        }
      }
    }

    // Webhook 必須回應 200 OK 才會通過驗證
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('LINE Webhook Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
