'use client';

import { useState } from 'react';
import styles from './donate.module.css';

const wallets = [
    {
        id: 'eth',
        label: 'Ethereum',
        symbol: 'ETH',
        address: '0xBfBe6B893f1262c01d0380573444f77B00f2AEf2',
        color: '#627EEA',
        icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L5 12.5L12 16L19 12.5L12 2Z" fill="currentColor" opacity=".8"/>
            <path d="M12 16L5 12.5L12 22L19 12.5L12 16Z" fill="currentColor" opacity=".5"/>
        </svg>
        ),
    },
    {
        id: 'sol',
        label: 'Solana',
        symbol: 'SOL',
        address: 'F6H91wdsTje9Ru1A4gpbWXAeZNBhCgYVgzqKgEzmZn6t',
        color: '#9945FF',
        icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 17h13.5l2.5-2.5H6.5L4 17Z" fill="currentColor"/>
            <path d="M4 12h13.5l2.5-2.5H6.5L4 12Z" fill="currentColor" opacity=".7"/>
            <path d="M4 7h13.5l2.5-2.5H6.5L4 7Z" fill="currentColor" opacity=".4"/>
        </svg>
        ),
    },
    {
        id: 'btc',
        label: 'Bitcoin',
        symbol: 'BTC',
        address: 'bc1q7k8c0tcm5nnn0p4ex67nykja2pkd0wgr2a7j22',
        color: '#F7931A',
        icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 14.5h-3v-1.5h-.5v1.5H9v-1.5H7.5V13H9v-2H7.5V9.5H9V8h1v1.5h.5V8h1v1.52c1.38.2 2.5.9 2.5 2.23 0 .7-.3 1.3-.8 1.75.7.4 1.3 1.05 1.3 2 0 1.5-1.22 2-2 2z" fill="currentColor"/>
        </svg>
        ),
    },
    {
        id: 'matic',
        label: 'Polygon',
        symbol: 'POL',
        address: '0xBfBe6B893f1262c01d0380573444f77B00f2AEf2',
        color: '#8247E5',
        icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.3l6.5 3.7-6.5 3.7L5.5 8 12 4.3zM4.5 9.7l7 4v7.6l-7-3.9V9.7zm9 11.6v-7.6l7-4v7.7l-7 3.9z" fill="currentColor"/>
        </svg>
        ),
    },
    ];

export default function DonateWidget() {
    const [active, setActive] = useState('eth');
    const [copied, setCopied] = useState(false);

    const wallet = wallets.find(w => w.id === active)!;

    const copy = () => {
        navigator.clipboard.writeText(wallet.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.wrap}>
        <div className={styles.inner}>
            <div className={styles.header}>
            <div className={styles.headerLeft}>
                <span className={styles.emoji}>☕</span>
                <div>
                <h3 className={styles.title}>Buy falcoln a coffee</h3>
                <p className={styles.sub}>If this tool saved you time, a tip is always appreciated</p>
                </div>
            </div>
            </div>

            <div className={styles.tabs}>
            {wallets.map(w => (
                <button
                key={w.id}
                className={`${styles.tab} ${active === w.id ? styles.tabActive : ''}`}
                style={{ '--wallet-color': w.color } as any}
                onClick={() => { setActive(w.id); setCopied(false); }}
                >
                <span className={styles.tabIcon}>{w.icon}</span>
                <span className={styles.tabLabel}>{w.symbol}</span>
                </button>
            ))}
            </div>

            <div className={styles.addressWrap} style={{ '--wallet-color': wallet.color } as any}>
            <div className={styles.addressHeader}>
                <span className={styles.addressIcon} style={{ color: wallet.color }}>{wallet.icon}</span>
                <span className={styles.addressNetwork}>{wallet.label}</span>
            </div>
            <div className={styles.addressRow}>
                <code className={styles.address}>{wallet.address}</code>
                <button className={styles.copyBtn} onClick={copy}>
                {copied ? (
                    <>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Copied
                    </>
                ) : (
                    <>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}