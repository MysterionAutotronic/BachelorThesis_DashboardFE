'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(_: unknown, formData: FormData) {
    const username = formData.get('username')?.toString().trim();

    if (!username) {
        return { error: 'Username required' };
    }

    const store = await cookies();
    store.set('user', username, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24h
    });

    redirect('/');
}
