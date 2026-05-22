import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export async function GET(request: Request) {
  try {
    // 檢查授權，確保是由 Vercel Cron 觸發
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const db = admin.firestore();
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!telegramBotToken) {
      throw new Error("Missing TELEGRAM_BOT_TOKEN");
    }

    // 取得所有使用者
    const usersSnapshot = await db.collection('users').get();
    
    let notifiedCount = 0;
    const now = new Date();
    // 為了排程每天跑一次，我們抓即將在 30 天內（或是特定天數）、甚至是已過期的點數
    // 這裡示範撈取有效日期，或者依據使用者的設定
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // 取得使用者設定 (確定有沒有綁定 TG)
      const profileSnapshot = await db.collection('users').doc(userId).collection('profile').doc('info').get();
      if (!profileSnapshot.exists) continue;
      
      const profileData = profileSnapshot.data();
      if (!profileData?.tgConnected || !profileData?.tgChatId) continue;
      
      const tgChatId = profileData.tgChatId;

      // 取得該使用者的點數
      const pointsSnapshot = await db.collection('users').doc(userId).collection('points').get();
      if (pointsSnapshot.empty) continue;

      let expiringMessages = [];
      
      for (const pointDoc of pointsSnapshot.docs) {
        const point = pointDoc.data();
        if (!point.expireDate) continue;

        const expireDate = new Date(point.expireDate);
        const diffTime = expireDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 假設我們在到期前 7 天、3 天、1 天、或是剛過期時提醒
        if (diffDays === 7 || diffDays === 3 || diffDays === 1 || diffDays === 0) {
           expiringMessages.push(`- [${point.provider}] ${point.type}: ${point.expiring} 點 (還有 ${diffDays} 天)`);
        }
      }

      if (expiringMessages.length > 0) {
        const messageText = `🔔 UniPoints 到期提醒 🔔\n\n您有以下點數即將到期：\n${expiringMessages.join('\n')}\n\n請盡快登入查看與使用！`;
        
        // 發送 Telegram 訊息
        const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: messageText,
          }),
        });

        if (res.ok) {
          notifiedCount++;
          // 可以在 notification 集合建立歷史紀錄
          const noteId = `n-${Date.now()}`;
          await db.collection('users').doc(userId).collection('notifications').doc(noteId).set({
            id: noteId,
            title: '背景自動到期提醒',
            message: `系統已自動為您發送到期提醒至 Telegram。`,
            time: new Date().toISOString(),
            isUnread: true,
            userId: userId
          });
        }
      }
    }

    return NextResponse.json({ success: true, notifiedCount });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
