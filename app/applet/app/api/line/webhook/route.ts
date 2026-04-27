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
          
          const replyToken = event.replyToken;
          const userMessage = event.message.text;

          // 若有設定 Token 則回覆訊息
          if (process.env.LINE_CHANNEL_ACCESS_TOKEN) {
            await fetch('https://api.line.me/v2/bot/message/reply', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
              },
              body: JSON.stringify({
                replyToken: replyToken,
                messages: [{
                  type: 'text',
                  text: `這是機器人自動回覆：我收到「${userMessage}」了！`
                }]
              })
            }).catch(e => console.error('Reply failed:', e));
          }
        }
      }
    }

    // Webhook 必須回應 200 OK 才會通過驗證
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('LINE Webhook Error:', error);
    // 即使發生錯誤，仍回傳 200，避免 LINE 持續重試發送
    return new NextResponse('OK', { status: 200 });
  }
}
