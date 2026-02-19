'use client';

import Link from 'next/link';
import styles from './legal.module.css';


export default function TermsPage() {
    return (
        <div className={styles.page} suppressHydrationWarning>
        <header className={styles.header}>
            <Link href="/" className={styles.backBtn}>← Back to TikPublish</Link>
        </header>

        <div className={styles.content}>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.updated}>Last updated: February 2026</p>

            <div className={styles.body}>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using TikPublish ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

            <h2>2. Description of Service</h2>
            <p>TikPublish is a developer tool that allows users to publish videos to TikTok accounts via the TikTok Content Posting API. The Service requires users to provide their own TikTok API credentials obtained through the TikTok for Developers platform.</p>

            <h2>3. TikTok API Usage</h2>
            <p>Your use of TikTok's API through this Service is subject to TikTok's own Terms of Service and Developer Terms. You are solely responsible for ensuring your content and usage comply with TikTok's policies. TikPublish is not affiliated with, endorsed by, or sponsored by TikTok.</p>

            <h2>4. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul>
                <li>All content you publish through the Service</li>
                <li>Securing your API credentials and bearer tokens</li>
                <li>Complying with TikTok's Community Guidelines and Terms of Service</li>
                <li>Ensuring you have the right to publish any content you upload</li>
            </ul>

            <h2>5. Data Storage</h2>
            <p>TikPublish stores your API tokens locally in your browser's localStorage. Tokens are only transmitted to TikTok's API endpoints. We do not store, log, or have access to your credentials on any server.</p>

            <h2>6. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access, and we are not responsible for any issues arising from TikTok API changes, outages, or policy updates.</p>

            <h2>7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, TikPublish shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Service.</p>

            <h2>8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>

            <h2>9. Contact</h2>
            <p>Questions about these terms can be directed to the project maintainer via the GitHub repository.</p>
            </div>
        </div>
        </div>
    );
}