import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
    return (
        <main className="mx-auto max-w-sm py-20">
            <h1 className="text-2xl font-bold mb-6">Log in</h1>
            <LoginForm />
        </main>
    );
}