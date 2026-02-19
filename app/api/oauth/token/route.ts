import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { code, client_key, client_secret, redirect_uri } = await req.json();

    if (!code || !client_key || !client_secret || !redirect_uri) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const params = new URLSearchParams({
        client_key,
        client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri,
        });

        const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        });

        const data = await res.json();

        if (data.error) {
        return NextResponse.json(
            { error: data.error_description || data.error || 'Token exchange failed' },
            { status: 400 }
        );
        }

        return NextResponse.json({
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token,
        open_id: data.open_id,
        scope: data.scope,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}