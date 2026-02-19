'use client';

import Link from 'next/link';
import styles from './legal.module.css';


export default function PrivacyPage() {
    return (
        <div className={styles.page} suppressHydrationWarning>
        <header className={styles.header}>
            <Link href="/" className={styles.backBtn}>← Back to TikPublish</Link>
        </header>

        <div className={styles.content}>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: February 2026</p>

            <div className={styles.body}>
            <h2>1. Overview</h2>
            <p>TikPublish ("we", "the Service") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>

            <h2>2. Data We Do NOT Collect</h2>
            <p>TikPublish does not collect, store, or transmit to any of our servers:</p>
            <ul>
                <li>Your TikTok API tokens or credentials</li>
                <li>Your TikTok account information</li>
                <li>Videos or media files you upload</li>
                <li>Your personal information</li>
                <li>Usage analytics or tracking data</li>
            </ul>

            <h2>3. Local Storage</h2>
            <p>API tokens you enter are stored exclusively in your browser's <code>localStorage</code>. This data never leaves your device except when making direct API calls to TikTok's servers. Clearing your browser data will permanently delete all stored tokens.</p>

            <h2>4. TikTok API Communication</h2>
            <p>When you publish a video, the Service communicates with the following TikTok endpoints:</p>
            <ul>
                <li><code>open.tiktokapis.com</code> — for creator info, publish init, and status polling</li>
                <li><code>open-upload.tiktokapis.com</code> — for direct video file uploads</li>
            </ul>
            <p>These requests include your bearer token and video data. TikTok's own privacy policy governs how they handle this data.</p>

            <h2>5. OAuth Callback</h2>
            <p>When you authorize TikPublish via TikTok's OAuth flow, TikTok redirects to our <code>/callback</code> page with a temporary authorization code. This code is used immediately to obtain an access token and is never stored. The resulting access token is displayed to you and stored only in your browser's localStorage.</p>

            <h2>6. Cookies</h2>
            <p>TikPublish does not use cookies for tracking or analytics purposes.</p>

            <h2>7. Third-Party Services</h2>
            <p>The Service is hosted on Vercel. Vercel may collect standard server logs (IP addresses, request paths) as part of their infrastructure. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel's Privacy Policy</a> for details.</p>

            <h2>8. Children's Privacy</h2>
            <p>The Service is not directed at children under 13. We do not knowingly collect data from children.</p>

            <h2>9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. The "last updated" date at the top will reflect any changes.</p>

            <h2>10. Contact</h2>
            <p>Questions about this privacy policy can be directed to the project maintainer via the GitHub repository.</p>
            </div>
        </div>
        </div>
    );
}