import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ConfigForm from '@/components/ConfigForm';

export default async function DashboardPage() {

    const session = await getSession();
    if (!session) redirect('/login');



    return (
        <main>
            <h1>Tenant Configuration for <b>{session.user}</b></h1>

            <ConfigForm />
        </main>
    );
}
