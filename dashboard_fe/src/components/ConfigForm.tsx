'use client';

import { useState, FormEvent } from 'react';
import {
    ConfigSchema,
    type Config,
} from '@mystiker123/config-schema';
import styles from './ConfigForm.module.css';

type ConfigDraft = Omit<Config, 'products'> & {
    products: string[];
};

interface ConfigFormProps {
    endpoint: string,
    user: string
}

export default function ConfigForm({ endpoint, user }: ConfigFormProps) {
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
            headers: {
                'Content-Type': 'application/json',
                'user': user,
            },
            body: JSON.stringify(parsed.data),
        });

        setStatus(res.ok ? 'success' : 'error');
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className={styles.row}>
                <label htmlFor='companyName' className={styles.label}>Company Name</label>
                <input
                    id='companyName'
                    value={draft.companyName}
                    onChange={(e) => patch('companyName', e.target.value)}
                    placeholder='Company name'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='proposition' className={styles.label}>Proposition</label>
                <input
                    id='proposition'
                    value={draft.proposition}
                    onChange={(e) => patch('proposition', e.target.value)}
                    placeholder='Proposition'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='about' className={styles.label}>About</label>
                <input
                    id='about'
                    value={draft.about}
                    onChange={(e) => patch('about', e.target.value)}
                    placeholder='About'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label id='country' className={styles.label}>Country</label>
                <input
                    id='country'
                    value={draft.address?.country}
                    onChange={(e) => {
                        patch('address', {
                            ...draft.address,
                            country: e.target.value
                        })
                    }}
                    placeholder='Country'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='zipCode' className={styles.label}>Zip Code</label>
                <input
                    id='zipCode'
                    value={draft.address?.zipCode}
                    onChange={(e) => {
                        patch('address', {
                            ...draft.address,
                            zipCode: e.target.value
                        })
                    }}
                    placeholder='Zip Code'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='city' className={styles.label}>City</label>
                <input
                    id='city'
                    value={draft.address?.city}
                    onChange={(e) => {
                        patch('address', {
                            ...draft.address,
                            city: e.target.value
                        })
                    }}
                    placeholder='City'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='street' className={styles.label}>Street</label>
                <input
                    id='street'
                    value={draft.address?.street}
                    onChange={(e) => {
                        patch('address', {
                            ...draft.address,
                            street: e.target.value
                        })
                    }}
                    placeholder='Street'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='streetNumber' className={styles.label}>Street Number</label>
                <input
                    id='streetNumber'
                    value={draft.address?.streetNumber}
                    onChange={(e) => {
                        patch('address', {
                            ...draft.address,
                            streetNumber: e.target.value
                        })
                    }}
                    placeholder='Street Number'
                    className={styles.input}
                />
            </div>
            <div className={styles.row}>
                <label className={styles.label}>Products</label>
                <div className={styles.productsRow}>

                    {draft.products.map((prod, i) => (
                        <input
                        key={i}
                        value={prod}
                        placeholder={`Product ${i + 1}`}
                        onChange={e => updateProduct(i, e.target.value)}
                        className={styles.input}
                        />
                    ))}
                </div>
            </div>
            <div className={styles.center}>
                <button
                type='submit'
                disabled={status === 'saving'}
                className={styles.button}
            >
                {status === 'saving' ? 'Saving…' : 'Save'}
            </button>
            </div>

            {status === 'success' && (
                <p className='text-green-600'>Saved!</p>
            )}
            {status === 'error' && (
                <p className='text-red-600'>
                Validation failed or server error.
                </p>
            )}
        </form>
    );
}
