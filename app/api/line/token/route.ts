import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, redirectUri } = await req.json();

    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || '2009904980';
    const clientSecret = process.env.LINE_CHANNEL_SECRET || '632cd5648415c0edf90b545718ee788d'; // or '7aa0789dbe6e484cceec8ef80e5b8c81'

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'LINE credentials missing from server' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    // 這裡我們直接使用使用者輸入的 LINE Login Channel ID 和 Secret
    params.append('client_id', '2009904980'); 
    params.append('client_secret', '7aa0789dbe6e484cceec8ef80e5b8c81'); 

    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('LINE token error:', tokenData);
      return NextResponse.json({ error: 'Failed to negotiate with LINE' }, { status: 400 });
    }

    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const profileData = await profileRes.json();
    if (!profileRes.ok) {
      console.error('LINE profile error:', profileData);
      return NextResponse.json({ error: 'Failed to fetch LINE profile' }, { status: 400 });
    }

    return NextResponse.json(profileData);
  } catch (error: any) {
    console.error('LINE integration error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
