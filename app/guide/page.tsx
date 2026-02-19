'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './guide.module.css';
import DonateWidget from './DonateWidget';

const PROD_URL = 'https://tiktok-publisher-alpha.vercel.app';

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
            <li>Click <strong>Log in</strong> and sign in with any TikTok account</li>
            <li>Accept the Developer Terms of Service</li>
            <li>You'll land on the Developer Portal dashboard</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ</span>
            Your developer account is just for managing apps — it's separate from the TikTok accounts you'll post to.
            </div>
        </div>
        ),
    },
    {
        id: 2,
        tag: 'Step 2',
        title: 'Create an App',
        time: '~5 min',
        content: (
        <div>
            <p>Create an app in the Developer Portal — this is what gets permission to publish videos on behalf of TikTok accounts.</p>
            <ol>
            <li>In the portal, click <strong>Manage Apps → Create an app</strong></li>
            <li>Fill in a name (e.g. "My TikTok Publisher"), click Confirm</li>
            <li>Fill in App icon, Category (e.g. "Photo & Video") and Description (e.g. "Website to publish videos to TikTok")</li>
            <li>For the required URLs, use these:
                <ul>
                <li><strong>Terms of Service URL:</strong> <code>{PROD_URL}/terms</code></li>
                <li><strong>Privacy Policy URL:</strong> <code>{PROD_URL}/privacy</code></li>
                </ul>
            </li>
            <li>Choose <strong>Web</strong> as the Platforms. For the required URL, use <code>{PROD_URL}</code></li>
            <li>Click <strong>Confirm</strong> to create the app</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ</span>
            Don't worry about domain verification — for sandbox testing it's not required.
            </div>
        </div>
        ),
    },
    {
        id: 3,
        tag: 'Step 3',
        title: 'Create a Sandbox & Add Test Users',
        time: '~10 min',
        content: (
        <div>
            <p>The sandbox lets you test everything for free without domain verification or app audit. All videos post privately to test accounts.</p>

            <h4>1. Create the Sandbox app</h4>
            <ol>
            <li>In your app dashboard, in top bar (next to Production), select <strong>Sandbox</strong></li>
            <li>Give it a name (e.g. "Publisher Sandbox")</li>
            <li>Click <strong>Confirm</strong></li>
            <li>Open the sandbox app — it has its own <strong>Client Key</strong> and <strong>Client Secret</strong>. Save these.</li>
            </ol>

            <h4>2. Add Test Users</h4>
            <ol>
            <li>Inside the sandbox app, go to <strong>Test Users</strong></li>
            <li>Click <strong>Add Test User</strong></li>
            <li>Enter the TikTok username of the account you want to post from</li>
            <li>That account gets an invite notification in TikTok — accept it</li>
            </ol>

            <div className={styles.note}>
            <span className={styles.noteIcon}>💡</span>
            You can add up to 10 test users. Each one needs to accept the invite before they can authorize your app.
            </div>
            <div className={styles.note}>
            <span className={styles.noteIcon}>⚠</span>
            Use the <strong>sandbox</strong> Client Key and Secret from now on — not the ones from your main app.
            </div>
        </div>
        ),
    },
    {
        id: 4,
        tag: 'Step 4',
        title: 'Add Login Kit to Sandbox',
        time: '~5 min',
        content: (
        <div>
            <p>Login Kit handles the OAuth flow that generates bearer tokens. You need to add it to your sandbox app and whitelist the redirect URL.</p>
            <ol>
            <li>Inside the <strong>sandbox</strong> app dashboard, click <strong>Add products</strong></li>
            <li>Find <strong>Login Kit</strong> and click <strong>Add</strong></li>
            <li>Under Login Kit settings, add this exact <strong>Redirect URI</strong>:
                <CodeBlock code={`${PROD_URL}/callback`} />
            </li>
            <li>Save</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>⚠</span>
            The Redirect URI must match exactly — no trailing slash, no typos.
            </div>
        </div>
        ),
    },
    {
        id: 5,
        tag: 'Step 5',
        title: 'Add Content Posting API to Sandbox',
        time: '~5 min',
        content: (
        <div>
            <p>This is what actually allows your sandbox app to publish videos.</p>
            <ol>
            <li>Inside the <strong>sandbox</strong> app dashboard, click <strong>Add products</strong></li>
            <li>Find <strong>Content Posting API</strong> and click <strong>Add</strong></li>
            <li>Enable the <strong>Direct Post</strong> toggle</li>
            <li>Save</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ</span>
            In sandbox mode the <code>video.publish</code> scope is pre-approved — no audit needed.
            </div>
        </div>
        ),
    },
    {
        id: 6,
        tag: 'Step 6',
        title: 'Get a Bearer Token',
        time: '~5 min',
        content: (
        <div>
            <p>Each TikTok account you want to post to needs to authorize your sandbox app. This gives you a bearer token to paste into TikPublish.</p>

            <h4>1. Open this URL in your browser</h4>
            <p>Replace <code>YOUR_SANDBOX_CLIENT_KEY</code> with the Client Key from your sandbox app:</p>
            <CodeBlock code={`https://www.tiktok.com/v2/auth/authorize/?client_key=YOUR_SANDBOX_CLIENT_KEY&scope=video.publish&response_type=code&redirect_uri=${PROD_URL}/callback&state=tikpublish`} />

            <h4>2. Log in with a test user account</h4>
            <p>Use one of the TikTok accounts you added as a test user in Step 3. Click <strong>Continue</strong>.</p>

            <h4>3. Complete the exchange on the callback page</h4>
            <p>TikTok redirects you to our website <code>https://tiktok-publisher-alpha.vercel.app/callback</code> automatically. On that page:</p>
            <ol>
            <li>Enter your sandbox <strong>Client Key</strong></li>
            <li>Enter your sandbox <strong>Client Secret</strong></li>
            <li>Click <strong>Exchange for Bearer Token</strong></li>
            <li>Your token appears — copy it</li>
            </ol>

            <div className={styles.note}>
            <span className={styles.noteIcon}>⚠</span>
            Tokens expire after <strong>24 hours</strong>. Just repeat this step to get a fresh one — takes about a minute once your app is set up.
            </div>
            <div className={styles.note}>
            <span className={styles.noteIcon}>💡</span>
            Your Client Secret is sent directly to TikTok and never stored anywhere on our servers.
            </div>
        </div>
        ),
    },
    {
        id: 7,
        tag: 'Step 7',
        title: 'Add Account to TikPublish',
        time: '~1 min',
        content: (
        <div>
            <p>Now paste your bearer token into TikPublish to start publishing.</p>
            <ol>
            <li>Go to the <strong>Accounts</strong> tab</li>
            <li>Click <strong>+ Add Account</strong></li>
            <li>Give it a label (e.g. "My Test Account")</li>
            <li>Paste the token — it starts with <code>act.</code></li>
            <li>Click <strong>✓ Verify Token</strong> — you should see your TikTok avatar and username appear</li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>🔒</span>
            Tokens are stored only in your browser's localStorage and are only ever sent to TikTok's API.
            </div>
        </div>
        ),
    },
    {
        id: 8,
        tag: 'Step 8',
        title: 'Publish Your First Video',
        time: '~2 min',
        content: (
        <div>
            <p>You're ready to publish!</p>
            <ol>
            <li>Go to the <strong>Publish Queue</strong> tab</li>
            <li>Click <strong>+ New Video Job</strong></li>
            <li>Select your account from the dropdown</li>
            <li>Write a caption with hashtags</li>
            <li>Choose <strong>File Upload</strong> and drag in your video</li>
            <li>Click <strong>Publish to TikTok</strong></li>
            </ol>
            <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ</span>
            In sandbox mode, all videos are posted as <strong>private</strong>. This is expected — check your TikTok app's private videos to confirm it worked.
            </div>
            <div className={styles.note}>
            <span className={styles.noteIcon}>💡</span>
            To post publicly with real accounts, your main app needs to pass TikTok's audit. Go to your <strong>main app</strong> dashboard (not sandbox) and click <strong>Apply for audit</strong>.
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
            <p className={styles.heroSub}>Set up TikTok API sandbox access and start publishing videos. No domain purchase or app audit required to get started.</p>
            <div className={styles.heroBadges}>
                <span className={styles.heroBadge}>Free sandbox</span>
                <span className={styles.heroBadge}>No domain needed</span>
                <span className={styles.heroBadge}>~30 min total</span>
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
                { q: 'Do I need to buy a domain?', a: 'No! For sandbox testing everything works on the deployed Vercel URL. You only need a custom domain if you want to go fully public and pass TikTok\'s audit.' },
                { q: 'Why are my videos private?', a: 'Sandbox mode always posts videos as private. This is expected and means everything is working correctly. To post publicly you need TikTok\'s app audit approval.' },
                { q: 'How long do tokens last?', a: 'Access tokens expire after 24 hours. Just repeat Step 5 — once your app is set up it only takes about a minute to get a fresh token.' },
                { q: 'Can I add multiple accounts?', a: 'Yes! Repeat Step 5 for each TikTok test user you added. Each gets their own token. Add them all in the Accounts tab.' },
                { q: 'What video formats work?', a: 'MP4 with H.264 encoding is recommended. The max duration is shown after verifying your token — it depends on the account settings.' },
                { q: 'Can I post to accounts I don\'t own?', a: 'Only if that account was added as a test user in your sandbox (Step 4) and accepted the invite. They also need to complete the OAuth flow in Step 5.' },
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