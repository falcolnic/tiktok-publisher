import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, post_info, source_info } = body;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    const res = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ post_info, source_info }),
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
