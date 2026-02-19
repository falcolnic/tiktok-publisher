'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './guide.module.css';
import DonateWidget from './DonateWidget';

const PROD_URL = 'https://tiktok-uploaderr.vercel.app';

const steps = [
    {
        id: 1,
        tag: 'Step 1',
        title: 'Create a Developer Account',
        time: '~5 min',
        content: (
        <div>
            <p>You need a TikTok for Developers account to create an app and get API access.</p>
            <ol>
            <li>Go to <a href="https://developers.tiktok.com" target="_blank" rel="noreferrer">developers.tiktok.com</a></li>
            <li>Click <strong>Log in</strong> and sign in with your TikTok account</li>
            <li>Accept the Developer Terms of Service</li>
            <li>You'll land on the Developer Portal dashboard</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ</span>
            Your developer account is separate from TikTok accounts you want to post to. You'll authorize those later via OAuth.
            </div>
        </div>
        ),
    },
    {
        id: 2,
        tag: 'Step 2',
        title: 'Register Your App',
        time: '~10 min',
        content: (
        <div>
            <p>Create an app in the Developer Portal — this is what will have permission to publish videos.</p>
            <ol>
            <li>In the portal, go to <strong>My Apps → Create App</strong></li>
            <li>Fill in:
                <ul>
                <li><strong>App Name</strong>: anything you want (e.g. "My Publisher")</li>
                <li><strong>App Category</strong>: pick the closest match</li>
                <li><strong>Platform</strong>: Web</li>
                </ul>
            </li>
            <li>When asked for legal & app URLs, paste these exact values:
                <ul>
                <li><strong>Terms of Service URL:</strong> <code>{PROD_URL}/terms</code></li>
                <li><strong>Privacy Policy URL:</strong> <code>{PROD_URL}/privacy</code></li>
                <li><strong>Website URL:</strong> <code>{PROD_URL}</code></li>
                </ul>
            </li>
            <li>Under <strong>Login Kit → Redirect URI</strong>, add: <code>{PROD_URL}/callback</code></li>
            <li>Click <strong>Create</strong></li>
            </ol>
            <p>After creation, note your <strong>Client Key</strong> and <strong>Client Secret</strong> from the app dashboard — you'll need them in Step 5.</p>
            <div className={styles.note}>
            <span className={styles.noteIcon}>⚠</span>
            Keep your Client Secret private. You'll enter it directly in the browser during the OAuth flow — it's never stored anywhere on our end.
            </div>
        </div>
        ),
    },
    {
        id: 3,
        tag: 'Step 3',
        title: 'Add the Content Posting API',
        time: '~5 min',
        content: (
        <div>
            <p>You need to explicitly add the Content Posting API product to your app and enable Direct Post mode.</p>
            <ol>
            <li>In your app dashboard, click <strong>Add Products</strong></li>
            <li>Find <strong>Content Posting API</strong> and click <strong>Add</strong></li>
            <li>In the Content Posting API settings, enable the <strong>Direct Post</strong> toggle</li>
            <li>Request the <strong><code>video.publish</code></strong> scope</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>⚠</span>
            Until your app passes the audit (Step 7), all posted videos will be <strong>private only</strong>. This is fine for testing.
            </div>
        </div>
        ),
    },
    {
        id: 4,
        tag: 'Step 4',
        title: 'Set Up a Sandbox (for Testing)',
        time: '~5 min',
        content: (
        <div>
            <p>Before your app is approved, use a Sandbox environment to test without restrictions.</p>
            <ol>
            <li>In your app dashboard, click <strong>Add Sandbox</strong></li>
            <li>Create a sandbox app — it gets its own Client Key/Secret</li>
            <li>Add test user accounts that can authorize without going through app review</li>
            <li>The sandbox uses the same API endpoints — just with sandbox tokens</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>💡</span>
            Test everything end-to-end in the sandbox first. Switch to production tokens once everything works.
            </div>
        </div>
        ),
    },
    {
        id: 5,
        tag: 'Step 5',
        title: 'Get a Bearer Token via OAuth',
        time: '~5 min',
        content: (
        <div>
            <p>Each TikTok account that wants to post must authorize your app. This gives you a <strong>Bearer token</strong> to paste into TikPublish. The whole flow happens right here on this site.</p>

            <h4>1. Build the authorization URL</h4>
            <p>Replace <code>YOUR_CLIENT_KEY</code> with the Client Key from your TikTok app dashboard, then open the URL in your browser:</p>
            <CodeBlock code={`https://www.tiktok.com/v2/auth/authorize/?client_key=YOUR_CLIENT_KEY&scope=video.publish&response_type=code&redirect_uri=${PROD_URL}/callback&state=tikpublish`} />

            <h4>2. Authorize in TikTok</h4>
            <p>The TikTok account that wants to post logs in and clicks <strong>Authorize</strong>. TikTok will then redirect them back to this site automatically.</p>

            <h4>3. Exchange for a token</h4>
            <p>You'll land on the <strong>/callback</strong> page on this site. It will ask for your Client Key and Client Secret — enter them, click exchange, and your Bearer token appears ready to copy.</p>

            <div className={styles.note}>
            <span className={styles.noteIcon}>💡</span>
            The Client Secret is sent directly from your browser to TikTok's API. It's never stored on any server.
            </div>
            <div className={styles.note}>
            <span className={styles.noteIcon}>⚠</span>
            Tokens expire after <strong>24 hours</strong>. Repeat this step to get a fresh token when it expires.
            </div>
        </div>
        ),
    },
    {
        id: 6,
        tag: 'Step 6',
        title: 'Paste Token into TikPublish',
        time: '~1 min',
        content: (
        <div>
            <p>Once you have a Bearer token from the callback page, add it to TikPublish.</p>
            <ol>
            <li>Go to the <strong>Accounts</strong> tab</li>
            <li>Click <strong>+ Add Account</strong></li>
            <li>Give it a label (e.g. "Brand Account")</li>
            <li>Paste the token — it starts with <code>act.</code></li>
            <li>Click <strong>✓ Verify Token</strong> to confirm it works</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>🔒</span>
            Tokens are stored only in your browser's localStorage and are only ever sent to TikTok's API endpoints.
            </div>
        </div>
        ),
    },
    {
        id: 7,
        tag: 'Step 7',
        title: 'Submit for App Audit (Production)',
        time: 'Days / weeks',
        content: (
        <div>
            <p>While testing, all videos post as <strong>private</strong>. To post publicly, your app needs to pass TikTok's audit.</p>
            <ol>
            <li>In your app dashboard, navigate to <strong>Audit</strong></li>
            <li>Fill in your app description, use case, and privacy policy URL</li>
            <li>Submit a demo video showing how your app uses the API</li>
            <li>Wait for TikTok's review (typically 1–2 weeks)</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ</span>
            The audit verifies compliance with TikTok's <a href="https://www.tiktok.com/legal/tik-tok-developer-terms-of-service" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="https://developers.tiktok.com/doc/content-sharing-guidelines" target="_blank" rel="noreferrer">Content Sharing Guidelines</a>.
            </div>
        </div>
        ),
    },
    ];

    function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className={styles.codeBlock}>
        <button className={styles.copyBtn} onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        <pre><code>{code}</code></pre>
        </div>
    );
    }

    export default function GuidePage() {
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const toggle = (id: number) => setActiveStep(prev => prev === id ? null : id);

    return (
        <div className={styles.page}>
        <header className={styles.header}>
            <div className={styles.headerInner}>
            <Link href="/" className={styles.backBtn}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Publisher
            </Link>
            <div className={styles.headerTitle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.68a8.28 8.28 0 004.84 1.55V6.79a4.86 4.86 0 01-1.07-.1z" fill="var(--accent)"/>
                </svg>
                TikTok API Setup Guide
            </div>
            </div>
        </header>

        <div className={styles.hero}>
            <div className={styles.heroInner}>
            <p className={styles.heroEyebrow}>Getting Started</p>
            <h1 className={styles.heroTitle}>From zero to posting<br />in 7 steps</h1>
            <p className={styles.heroSub}>Everything you need to set up TikTok API access and start publishing videos across multiple accounts. No coding required.</p>
            <div className={styles.heroBadges}>
                <span className={styles.heroBadge}>No coding required</span>
                <span className={styles.heroBadge}>~40 min total</span>
                <span className={styles.heroBadge}>Free TikTok Dev account</span>
            </div>
            </div>
        </div>

        <div className={styles.timeline}>
            {steps.map((step) => {
            const isOpen = activeStep === step.id;
            const isDone = activeStep !== null && step.id < activeStep;
            return (
                <div key={step.id} className={`${styles.stepWrap} ${isOpen ? styles.stepOpen : ''}`}>
                <div className={styles.stepLine}>
                    <div className={`${styles.stepDot} ${isDone ? styles.stepDotDone : ''} ${isOpen ? styles.stepDotActive : ''}`}>
                    {isDone ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    ) : <span>{step.id}</span>}
                    </div>
                    {step.id < steps.length && <div className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`} />}
                </div>
                <div className={styles.stepCard} onClick={() => toggle(step.id)}>
                    <div className={styles.stepCardHeader}>
                    <div className={styles.stepMeta}>
                        <span className={styles.stepTag}>{step.tag}</span>
                        <span className={styles.stepTime}>⏱ {step.time}</span>
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <div className={styles.chevron} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    </div>
                    {isOpen && (
                    <div className={styles.stepContent} onClick={e => e.stopPropagation()}>
                        {step.content}
                    </div>
                    )}
                </div>
                </div>
            );
            })}
        </div>

        <div className={styles.faq}>
            <div className={styles.faqInner}>
            <h2 className={styles.faqTitle}>Common Questions</h2>
            <div className={styles.faqGrid}>
                {[
                { q: 'Do I need a business account?', a: 'No, a regular TikTok account works. The developer account is separate from the posting accounts.' },
                { q: 'How long do tokens last?', a: 'Access tokens expire after 24 hours. Repeat Step 5 to get a fresh one — it only takes a minute once your app is set up.' },
                { q: 'Can I post to accounts I don\'t own?', a: 'Only if that account goes through the OAuth flow (Step 5) and authorizes your app. You can\'t post to accounts that haven\'t explicitly approved your app.' },
                { q: 'Why are my videos private?', a: 'Until your app passes TikTok\'s audit (Step 7), all posted videos default to private. Your integration is working correctly.' },
                { q: 'What video formats are supported?', a: 'MP4 with H.264 encoding is recommended. Max duration is shown after verifying your token in the Accounts tab.' },
                { q: 'Does this work with the sandbox?', a: 'Yes — create a sandbox in the Developer Portal, use sandbox tokens in TikPublish. Everything works the same way.' },
                ].map(({ q, a }) => (
                <div key={q} className={styles.faqItem}>
                    <h4>{q}</h4>
                    <p>{a}</p>
                </div>
                ))}
            </div>
            </div>
        </div>

        <div className={styles.resourcesBar}>
            {[
            { href: 'https://developers.tiktok.com/doc/content-posting-api-get-started', label: '📄 Content Posting API Docs' },
            { href: 'https://developers.tiktok.com/doc/oauth-user-access-token-management', label: '🔑 OAuth Token Docs' },
            { href: 'https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide', label: '🎬 Video Restrictions' },
            { href: 'https://developers.tiktok.com/application/content-posting-api', label: '✅ Submit for Audit' },
            ].map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer" className={styles.resourceLink}>{label}</a>
            ))}
        </div>
            <DonateWidget />
        </div>
    );
}
