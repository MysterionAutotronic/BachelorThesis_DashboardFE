import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardButton from '@/components/DashboardButton';

export default async function Home() {
    const session = await getSession();
    if (!session) redirect('/login');

    function handleClick() {
        redirect('/dashboard');
    }

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">Welcome, {session.user}!</h1>
            <DashboardButton />
        </main>
    );
}
