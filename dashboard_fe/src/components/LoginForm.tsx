'use client';
import { useState, useTransition } from 'react';
import { login } from '@/app/login/actions';

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [pending, start]  = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        start(async () => {
        const res = await login(null, fd); // call action
        if (res?.error) setError(res.error);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            name="username"
            placeholder="username"
            required
            disabled={pending}
            className="border p-2 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
            type="submit"
            disabled={pending}
            className="bg-black text-white px-4 py-2 disabled:opacity-50"
        >
            {pending ? '…' : 'Sign in'}
        </button>
        </form>
    );
}
