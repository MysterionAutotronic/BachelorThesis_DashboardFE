'use client';

import { useRouter } from 'next/navigation';

export default function DashboardButton() {
    const router = useRouter();

    return (
        <button
        onClick={() => router.push('/dashboard')}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring"
        >
        Go to Dashboard
        </button>
    );
}
