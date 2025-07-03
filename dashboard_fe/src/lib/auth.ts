import { cookies } from 'next/headers';

const COOKIE = 'user';

// read username from cookie
export async function getSession(): Promise<{ user: string } | null> {
    const store = await cookies();
    const user   = store.get(COOKIE)?.value;
    return user ? { user } : null;
}

// clear cookie
export async function logout() {
    const store = await cookies();
    store.delete(COOKIE);
}
