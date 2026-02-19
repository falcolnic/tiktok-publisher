import { Suspense } from 'react';
import CallbackInner from './CallbackInner';
import styles from './callback.module.css';

export default function CallbackPage() {
    return (
        <Suspense fallback={
        <div className={styles.page}>
            <div className={styles.center}>
            <div className={styles.card}>
                <div className={styles.stateWrap}>
                <div className={styles.spinner} />
                <p className={styles.stateMsg}>Loading…</p>
                </div>
            </div>
            </div>
        </div>
        }>
        <CallbackInner />
        </Suspense>
    );
}