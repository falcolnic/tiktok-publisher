import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token, publish_id } = await req.json();

  if (!token || !publish_id) {
    return NextResponse.json({ error: 'Missing token or publish_id' }, { status: 400 });
  }

  try {
    const res = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id }),
    });

    const data = await res.json();

    if (data.error?.code !== 'ok') {
      return NextResponse.json({ error: data.error?.message || 'TikTok API error' }, { status: 400 });
    }

    return NextResponse.json({ data: data.data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
