'use server'

import { NextRequest, NextResponse } from 'next/server';

if (!process.env.CONFIG_ENDPOINT) console.error('environment variable CONFIG_ENDPOINT not defined');
const endpoint = process.env.NEXT_PUBLIC_CONFIG_ENDPOINT!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const user = req.headers.get('user') || '';

    const backendRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user': user,
        },
        body: JSON.stringify(body),
    });

    const responseBody = await backendRes.json();

    return new NextResponse(responseBody, {
        status: backendRes.status,
        headers: {
            'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
            'Cache-Control': 'no-store',
        }
    });
}