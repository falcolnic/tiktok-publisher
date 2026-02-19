'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './callback.module.css';

type State = 'loading' | 'needs_config' | 'exchanging' | 'success' | 'error';

export default function CallbackInner() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const [state, setState] = useState<State>('loading');
    const [token, setToken] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState(false);
    const [clientKey, setClientKey] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (error) {
        setState('error');
        setErrorMsg('TikTok returned an error: ' + error);
        return;
        }
        if (!code) {
        setState('error');
        setErrorMsg("No authorization code found in the URL. Make sure you arrived here via TikTok's OAuth flow.");
        return;
        }
        setState('needs_config');
    }, [code, error]);

    const exchange = async () => {
        if (!clientKey || !clientSecret) return;
        setState('exchanging');
        try {
        const res = await fetch('/api/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            code,
            client_key: clientKey,
            client_secret: clientSecret,
            redirect_uri: window.location.origin + '/callback',
            }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || 'Token exchange failed');
        setToken(json.access_token);
        setState('success');
        } catch (e) {
        setState('error');
        setErrorMsg(e instanceof Error ? e.message : 'Unknown error');
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.page}>
        <header className={styles.header}>
            <Link href="/" className={styles.backBtn}>← Back to TikPublish</Link>
            <span className={styles.headerTitle}>OAuth Callback</span>
        </header>

        <div className={styles.center}>
            <div className={styles.card}>

            {state === 'loading' && (
                <div className={styles.stateWrap}>
                <div className={styles.spinner} />
                <p className={styles.stateMsg}>Reading authorization response…</p>
                </div>
            )}

            {state === 'needs_config' && (
                <>
                <div className={styles.successIcon} style={{ background: 'rgba(255,214,0,0.1)', borderColor: 'rgba(255,214,0,0.3)' }}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ffd600" strokeWidth="1.5">
                    <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className={styles.cardTitle}>Almost there!</h2>
                <p className={styles.cardSub}>TikTok sent an authorization code. Enter your app credentials to exchange it for a bearer token.</p>

                <div className={styles.codePreview}>
                    <span className={styles.codeLabel}>Authorization Code received ✓</span>
                    <code className={styles.codeValue}>{code ? code.slice(0, 28) + '…' : ''}</code>
                </div>

                <div className={styles.fieldGroup}>
                    <label>Client Key</label>
                    <input
                    value={clientKey}
                    onChange={e => setClientKey(e.target.value)}
                    placeholder="From your TikTok app dashboard"
                    autoComplete="off"
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label>Client Secret</label>
                    <input
                    type="password"
                    value={clientSecret}
                    onChange={e => setClientSecret(e.target.value)}
                    placeholder="From your TikTok app dashboard"
                    autoComplete="off"
                    />
                </div>

                <div className={styles.note}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Your Client Secret goes directly to TikTok and is never stored anywhere.
                </div>

                <button
                    className={styles.exchangeBtn}
                    onClick={exchange}
                    disabled={!clientKey || !clientSecret}
                >
                    Exchange for Bearer Token →
                </button>
                </>
            )}

            {state === 'exchanging' && (
                <div className={styles.stateWrap}>
                <div className={styles.spinner} />
                <p className={styles.stateMsg}>Exchanging code with TikTok…</p>
                </div>
            )}

            {state === 'success' && (
                <>
                <div className={styles.successIcon}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#00e676" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className={styles.cardTitle}>Bearer token ready!</h2>
                <p className={styles.cardSub}>Copy this and paste it into TikPublish under Accounts. Expires in 24 hours.</p>

                <div className={styles.tokenBox}>
                    <code className={styles.tokenValue}>{token}</code>
                    <button className={styles.copyBtn} onClick={copy}>
                    {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                </div>

                <div className={styles.note}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Save this now — you cannot retrieve it again from this page.
                </div>

                <Link href="/" className={styles.goHomeBtn}>
                    → Go to TikPublish and paste token
                </Link>
                </>
            )}

            {state === 'error' && (
                <>
                <div className={styles.successIcon} style={{ background: 'rgba(255,23,68,0.1)', borderColor: 'rgba(255,23,68,0.3)' }}>
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ff1744" strokeWidth="1.5">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className={styles.cardTitle}>Something went wrong</h2>
                <p className={styles.errorMsg}>{errorMsg}</p>
                <Link href="/guide" className={styles.goHomeBtn} style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
                    ← Back to Setup Guide
                </Link>
                </>
            )}

            </div>
        </div>
        </div>
    );
}