import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, redirectUri } = await req.json();

    const clientId = process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID;
    const clientSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'LINE credentials missing from server' }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', clientId); 
    params.append('client_secret', clientSecret); 

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
