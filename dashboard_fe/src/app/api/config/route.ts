'use server'

import { NextRequest, NextResponse } from 'next/server';

if (!process.env.CONFIG_ENDPOINT) console.error('environment variable CONFIG_ENDPOINT not defined');
const endpoint = process.env.CONFIG_ENDPOINT!;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const user = req.headers.get('user') || '';

    try {
        const backendRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user': user,
            },
            body: JSON.stringify(body),
        });
        const contentType = backendRes.headers.get('content-type') || '';
        const raw = await backendRes.text();
        const isJson = contentType.includes('application/json');
        const responseBody = isJson ? JSON.parse(raw) : raw;


        return new NextResponse(responseBody, {
            status: backendRes.status,
            headers: {
                'Content-Type': contentType || 'text/plain',
                'Cache-Control': 'no-store',
            }
        });
    } catch (error) {
        console.error('Proxy request failed:', error);
        return new NextResponse('Internal Server Error trying to reach ' + endpoint, { status: 500 });
    }
}