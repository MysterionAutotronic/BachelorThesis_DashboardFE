'use client';

import { useState, FormEvent } from 'react';
import {
    ConfigSchema,
    type Config,
} from '@mystiker123/config-schema';

type ConfigDraft = Omit<Config, 'products'> & {
    products: string[];
};

export default function ConfigForm({ endpoint }: { endpoint: string }) {
    const [draft, setDraft] = useState<ConfigDraft>({
        address: {
            country: '',
            zipCode: '',
            city: '',
            street: '',
            streetNumber: '',
        },
        companyName: '',
        proposition: '',
        products: [''],
        about: '',
    });

    const [status, setStatus] = useState<
        'idle' | 'saving' | 'success' | 'error'
    >('idle');

    function patch<K extends keyof ConfigDraft>(
        key: K,
        value: ConfigDraft[K],
    ) {
        setDraft(prev => ({ ...prev, [key]: value }));
    }

    function updateProduct(index: number, value: string) {
        setDraft(prev => {
            const next = [...prev.products];
            next[index] = value;
            if (index === next.length - 1 && value.trim() !== '') next.push('');
            return { ...prev, products: next };
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const cleaned: Config = {
            ...draft,
            products: draft.products
                .filter(p => p.trim() !== '') as [string, ...string[]],
        };

        const parsed = ConfigSchema.safeParse(cleaned);
        if (!parsed.success) {
            console.warn(parsed.error);
            setStatus('error');
            return;
        }

        setStatus('saving');

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
        });

        setStatus(res.ok ? 'success' : 'error');
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <label className='block font-medium'>Company Name</label>
            <input
                value={draft.companyName}
                onChange={(e) => patch('companyName', e.target.value)}
                placeholder="Company name"
                className="w-full border p-2"
            />
            <label className='block font-medium'>Proposition</label>
            <input
                value={draft.proposition}
                onChange={(e) => patch('proposition', e.target.value)}
                placeholder="Proposition"
                className="w-full border p-2"
            />
            <label className='block font-medium'>About</label>
            <input
                value={draft.about}
                onChange={(e) => patch('about', e.target.value)}
                placeholder="About"
                className="w-full border p-2"
            />
            <label className='block font-medium'>Country</label>
            <input
                value={draft.address?.country}
                onChange={(e) => {
                    patch('address', {
                        ...draft.address,
                        country: e.target.value
                    })
                }}
                placeholder="Country"
                className="w-full border p-2"
            />
            <label className='block font-medium'>Zip Code</label>
            <input
                value={draft.address?.zipCode}
                onChange={(e) => {
                    patch('address', {
                        ...draft.address,
                        zipCode: e.target.value
                    })
                }}
                placeholder="Zip Code"
                className="w-full border p-2"
            />
            <label className='block font-medium'>City</label>
            <input
                value={draft.address?.city}
                onChange={(e) => {
                    patch('address', {
                        ...draft.address,
                        city: e.target.value
                    })
                }}
                placeholder="City"
                className="w-full border p-2"
            />
            <label className='block font-medium'>Street</label>
            <input
                value={draft.address?.street}
                onChange={(e) => {
                    patch('address', {
                        ...draft.address,
                        street: e.target.value
                    })
                }}
                placeholder="Street"
                className="w-full border p-2"
            />
            <label className='block font-medium'>Street Number</label>
            <input
                value={draft.address?.streetNumber}
                onChange={(e) => {
                    patch('address', {
                        ...draft.address,
                        streetNumber: e.target.value
                    })
                }}
                placeholder="Street Number"
                className="w-full border p-2"
            />
            <div className="space-y-2">
                <label className="block font-medium">Products</label>

                {draft.products.map((prod, i) => (
                    <input
                    key={i}
                    value={prod}
                    placeholder={`Product ${i + 1}`}
                    onChange={e => updateProduct(i, e.target.value)}
                    className="w-full border p-2"
                    />
                ))}
            </div>
            <button
                type="submit"
                disabled={status === 'saving'}
                className="rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
            >
                {status === 'saving' ? 'Saving…' : 'Save'}
            </button>

            {status === 'success' && (
                <p className="text-green-600">Saved!</p>
            )}
            {status === 'error' && (
                <p className="text-red-600">
                Validation failed or server error.
                </p>
            )}
        </form>
    );
}
