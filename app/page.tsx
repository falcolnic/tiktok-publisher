'use client';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { TikTokAccount, PostJob, UploadSource, CreatorInfo } from '@/lib/types';
import styles from './page.module.css';
import DonateWidget from './guide/DonateWidget';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Account Card ────────────────────────────────────────────────────────────
function AccountCard({
  account,
  onUpdate,
  onDelete,
  onFetchInfo,
}: {
  account: TikTokAccount;
  onUpdate: (a: TikTokAccount) => void;
  onDelete: () => void;
  onFetchInfo: (id: string) => Promise<void>;
}) {
  const [fetching, setFetching] = useState(false);
  const [err, setErr] = useState('');

  const handleFetch = async () => {
    setFetching(true);
    setErr('');
    try {
      await onFetchInfo(account.id);
    } catch (e: any) {
      setErr(e.message);
    }
    setFetching(false);
  };

  return (
    <div className={styles.accountCard}>
      <div className={styles.accountCardHeader}>
        <div className={styles.accountAvatarWrap}>
          {account.creatorInfo?.creator_avatar_url ? (
            <img src={account.creatorInfo.creator_avatar_url} alt="" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" fill="currentColor" opacity=".5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" />
              </svg>
            </div>
          )}
          {account.creatorInfo && (
            <div className={styles.accountMeta}>
              <span className={styles.nickname}>{account.creatorInfo.creator_nickname}</span>
              <span className={styles.username}>@{account.creatorInfo.creator_username}</span>
            </div>
          )}
          {!account.creatorInfo && (
            <span className={styles.unverified}>Not verified</span>
          )}
        </div>
        <button className={styles.deleteBtn} onClick={onDelete} title="Remove account">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.fieldGroup}>
        <label>Account Label</label>
        <input
          value={account.label}
          onChange={e => onUpdate({ ...account, label: e.target.value })}
          placeholder="My main account"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label>Bearer Token</label>
        <input
          type="password"
          value={account.token}
          onChange={e => onUpdate({ ...account, token: e.target.value, creatorInfo: undefined })}
          placeholder="act.example12345..."
          className={styles.tokenInput}
        />
      </div>

      {err && <p className={styles.errorSmall}>{err}</p>}

      <button
        className={styles.verifyBtn}
        onClick={handleFetch}
        disabled={!account.token || fetching}
      >
        {fetching ? (
          <><span className={styles.spinner} /> Verifying…</>
        ) : account.creatorInfo ? (
          '↻ Re-verify'
        ) : (
          '✓ Verify Token'
        )}
      </button>

      {account.creatorInfo && (
        <div className={styles.privacyBadges}>
          {account.creatorInfo.privacy_level_options.map(p => (
            <span key={p} className={styles.badge}>{p.replace(/_/g, ' ')}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({
  job,
  accounts,
  onUpdate,
  onDelete,
  onPublish,
}: {
  job: PostJob;
  accounts: TikTokAccount[];
  onUpdate: (j: PostJob) => void;
  onDelete: () => void;
  onPublish: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const account = accounts.find(a => a.id === job.accountId);
  const privacyOptions = account?.creatorInfo?.privacy_level_options ?? ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'];

  const statusColor = {
    idle: '#666',
    querying: '#ffd600',
    uploading: '#ff6b35',
    processing: '#ff6b35',
    done: '#00e676',
    error: '#ff1744',
  }[job.status];

  return (
    <div className={`${styles.jobCard} ${job.status === 'done' ? styles.jobDone : ''} ${job.status === 'error' ? styles.jobError : ''}`}>
      <div className={styles.jobHeader}>
        <div className={styles.jobStatus} style={{ '--status-color': statusColor } as any}>
          <span className={styles.statusDot} />
          <span className={styles.statusLabel}>{job.status.toUpperCase()}</span>
        </div>
        {job.status === 'idle' && (
          <button className={styles.deleteBtn} onClick={onDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label>Target Account</label>
        <select
          value={job.accountId}
          onChange={e => onUpdate({ ...job, accountId: e.target.value })}
          disabled={job.status !== 'idle'}
        >
          <option value="">— Select account —</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>
              {a.label || a.creatorInfo?.creator_username || a.id}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label>Title / Caption</label>
        <textarea
          value={job.title}
          onChange={e => onUpdate({ ...job, title: e.target.value })}
          placeholder="this will be a funny #cat video on your @tiktok #fyp"
          rows={2}
          disabled={job.status !== 'idle'}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.fieldGroup} style={{ flex: 1 }}>
          <label>Privacy Level</label>
          <select
            value={job.privacyLevel}
            onChange={e => onUpdate({ ...job, privacyLevel: e.target.value })}
            disabled={job.status !== 'idle'}
          >
            {privacyOptions.map(p => (
              <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup} style={{ flex: 1 }}>
          <label>Cover Timestamp (ms)</label>
          <input
            type="number"
            value={job.videoCoverTimestampMs}
            onChange={e => onUpdate({ ...job, videoCoverTimestampMs: Number(e.target.value) })}
            disabled={job.status !== 'idle'}
          />
        </div>
      </div>

      <div className={styles.toggleRow}>
        {[
          { key: 'disableComment', label: 'Disable Comments' },
          { key: 'disableDuet', label: 'Disable Duet' },
          { key: 'disableStitch', label: 'Disable Stitch' },
        ].map(({ key, label }) => (
          <label key={key} className={styles.toggle}>
            <input
              type="checkbox"
              checked={job[key as keyof PostJob] as boolean}
              onChange={e => onUpdate({ ...job, [key]: e.target.checked })}
              disabled={job.status !== 'idle'}
            />
            <span className={styles.toggleTrack} />
            <span className={styles.toggleLabel}>{label}</span>
          </label>
        ))}
      </div>

      <div className={styles.sourceToggle}>
        <button
          className={`${styles.sourceBtn} ${job.source === 'FILE_UPLOAD' ? styles.sourceBtnActive : ''}`}
          onClick={() => onUpdate({ ...job, source: 'FILE_UPLOAD', videoUrl: undefined })}
          disabled={job.status !== 'idle'}
        >
          📁 File Upload
        </button>
        <button
          className={`${styles.sourceBtn} ${job.source === 'PULL_FROM_URL' ? styles.sourceBtnActive : ''}`}
          onClick={() => onUpdate({ ...job, source: 'PULL_FROM_URL', file: undefined })}
          disabled={job.status !== 'idle'}
        >
          🔗 Pull from URL
        </button>
      </div>

      {job.source === 'FILE_UPLOAD' && (
        <div
          className={styles.dropZone}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) onUpdate({ ...job, file: f });
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) onUpdate({ ...job, file: f });
            }}
          />
          {job.file ? (
            <div className={styles.fileInfo}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 10l4.553-2.07A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14" strokeLinecap="round"/>
                <rect x="3" y="6" width="12" height="12" rx="2" strokeLinecap="round"/>
              </svg>
              <span>{job.file.name}</span>
              <span className={styles.fileSize}>({(job.file.size / 1024 / 1024).toFixed(1)} MB)</span>
            </div>
          ) : (
            <div className={styles.dropPrompt}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Drop video here or click to browse</p>
            </div>
          )}
        </div>
      )}

      {job.source === 'PULL_FROM_URL' && (
        <div className={styles.fieldGroup}>
          <label>Video URL</label>
          <input
            value={job.videoUrl ?? ''}
            onChange={e => onUpdate({ ...job, videoUrl: e.target.value })}
            placeholder="https://example.com/video.mp4"
            disabled={job.status !== 'idle'}
          />
        </div>
      )}

      {job.status !== 'idle' && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${job.progress}%` }} />
          </div>
          <span className={styles.progressLabel}>{job.statusMessage || `${job.progress}%`}</span>
        </div>
      )}

      {job.error && <p className={styles.errorSmall}>{job.error}</p>}

      {job.status === 'idle' && (
        <button
          className={styles.publishBtn}
          onClick={() => onPublish(job.id)}
          disabled={!job.accountId || !job.title || (job.source === 'FILE_UPLOAD' ? !job.file : !job.videoUrl)}
        >
          Publish to TikTok →
        </button>
      )}

      {job.status === 'done' && (
        <div className={styles.doneMsg}>
          ✓ Published! Publish ID: <code>{job.publishId}</code>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [accounts, setAccounts, accountsLoaded] = useLocalStorage<TikTokAccount[]>('tt_accounts', []);
  const [jobs, setJobs] = useState<PostJob[]>([]);
  const [activeTab, setActiveTab] = useState<'accounts' | 'publish'>('accounts');

  const addAccount = () => {
    setAccounts(prev => [...prev, { id: generateId(), label: '', token: '' }]);
  };

  const updateAccount = (updated: TikTokAccount) => {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const fetchCreatorInfo = async (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    const res = await fetch('/api/creator-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: account.token }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to verify');

    setAccounts(prev => prev.map(a =>
      a.id === id ? { ...a, creatorInfo: json.data, fetchedAt: Date.now() } : a
    ));
  };

  const addJob = () => {
    setJobs(prev => [...prev, {
      id: generateId(),
      accountId: accounts[0]?.id ?? '',
      title: '',
      privacyLevel: accounts[0]?.creatorInfo?.privacy_level_options[0] ?? 'PUBLIC_TO_EVERYONE',
      disableComment: false,
      disableDuet: false,
      disableStitch: false,
      videoCoverTimestampMs: 1000,
      source: 'FILE_UPLOAD',
      status: 'idle',
      progress: 0,
    }]);
    setActiveTab('publish');
  };

  const updateJob = (updated: PostJob) => {
    setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const patchJob = useCallback((id: string, patch: Partial<PostJob>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j));
  }, []);

  const publishJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    const account = accounts.find(a => a.id === job?.accountId);
    if (!job || !account) return;

    // Step 1: ensure creator info
    patchJob(id, { status: 'querying', progress: 5, statusMessage: 'Querying creator info…' });

    let creatorInfo = account.creatorInfo;
    if (!creatorInfo) {
      try {
        await fetchCreatorInfo(account.id);
        creatorInfo = accounts.find(a => a.id === account.id)?.creatorInfo;
        if (!creatorInfo) throw new Error('Could not fetch creator info');
      } catch (e: any) {
        patchJob(id, { status: 'error', error: e.message });
        return;
      }
    }

    // Step 2: init publish
    patchJob(id, { status: 'uploading', progress: 15, statusMessage: 'Initialising upload…' });

    const postInfo = {
      title: job.title,
      privacy_level: job.privacyLevel,
      disable_duet: job.disableDuet,
      disable_comment: job.disableComment,
      disable_stitch: job.disableStitch,
      video_cover_timestamp_ms: job.videoCoverTimestampMs,
    };

    let sourceInfo: any;
    let chunkSize = 0;
    let totalChunks = 0;

    if (job.source === 'PULL_FROM_URL') {
      sourceInfo = { source: 'PULL_FROM_URL', video_url: job.videoUrl };
    } else {
      const file = job.file!;

      const MAX_FILE = 4 * 1024 * 1024 * 1024; // 4GB
      if (file.size > MAX_FILE) {
        patchJob(id, {
          status: 'error',
          error: `File too large. Maximum is 4GB, your file is ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB.`,
        });
        return;
      }

      if (file.size < 1024 * 10) {
        patchJob(id, {
          status: 'error',
          error: `File too small (${(file.size / 1024).toFixed(1)}KB). Please use a valid video file.`,
        });
        return;
      }

      const chunkSize = file.size < 10 * 1024 * 1024 ? file.size : 10 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);

      const sourceInfo = {
        source: 'FILE_UPLOAD',
        video_size: file.size,
        chunk_size: chunkSize,
        total_chunk_count: totalChunks,
      };
    }

    try {
      const initRes = await fetch('/api/publish-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: account.token, post_info: postInfo, source_info: sourceInfo }),
      });
      const initJson = await initRes.json();
      if (!initRes.ok) throw new Error(initJson.error || 'Publish init failed');

      const { publish_id, upload_url } = initJson.data;
      patchJob(id, { publishId: publish_id, progress: 30, statusMessage: 'Upload initialised…' });

      // Step 3: if FILE_UPLOAD, PUT directly from browser to TikTok upload URL
      if (job.source === 'FILE_UPLOAD' && upload_url && job.file) {
        const file = job.file;
        const CHUNK = chunkSize;

        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK;
          const end = Math.min(start + CHUNK, file.size) - 1;
          const chunk = file.slice(start, end + 1);

          await fetch(upload_url, {
            method: 'PUT',
            headers: {
              'Content-Range': `bytes ${start}-${end}/${file.size}`,
              'Content-Type': 'video/mp4',
            },
            body: chunk,
          });

          const prog = 30 + Math.round(((i + 1) / totalChunks) * 50);
          patchJob(id, { progress: prog, statusMessage: `Uploading chunk ${i + 1}/${totalChunks}…` });
        }
      }

      // Step 4: poll status
      patchJob(id, { status: 'processing', progress: 85, statusMessage: 'Processing on TikTok…' });

      let attempts = 0;
      const maxAttempts = 30;
      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000));
        attempts++;

        const statusRes = await fetch('/api/publish-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: account.token, publish_id }),
        });
        const statusJson = await statusRes.json();

        if (!statusRes.ok) break;

        const s = statusJson.data?.status;
        if (s === 'PUBLISH_COMPLETE') {
          patchJob(id, { status: 'done', progress: 100, statusMessage: 'Published!' });
          return;
        } else if (s === 'FAILED') {
          throw new Error(`TikTok processing failed: ${statusJson.data?.fail_reason || 'unknown'}`);
        }

        const prog = Math.min(85 + attempts, 99);
        patchJob(id, { progress: prog, statusMessage: `Processing… (${s ?? 'waiting'})` });
      }

      // If we hit max attempts, still show done optimistically
      patchJob(id, { status: 'done', progress: 100, statusMessage: 'Submitted! Check TikTok for status.' });

    } catch (e: any) {
      patchJob(id, { status: 'error', error: e.message, statusMessage: '' });
    }
  };

  const verifiedCount = accounts.filter(a => a.creatorInfo).length;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.68a8.28 8.28 0 004.84 1.55V6.79a4.86 4.86 0 01-1.07-.1z" fill="var(--accent)" />
          </svg>
          <span>TikPublish</span>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${activeTab === 'accounts' ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
            <span className={styles.navCount}>{accounts.length}</span>
          </button>
          <button
            className={`${styles.navBtn} ${activeTab === 'publish' ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab('publish')}
          >
            Publish Queue
            <span className={styles.navCount}>{jobs.length}</span>
          </button>
        </nav>

        <div className={styles.headerMeta}>
          <span className={styles.metaItem}>
            <span className={styles.dot} style={{ background: verifiedCount > 0 ? '#00e676' : '#666' }} />
            {verifiedCount}/{accounts.length} verified
          </span>
            <Link href="/guide" className={styles.guideLink}>
              Setup Guide →
            </Link>
        </div>
      </header>

      <main className={styles.main}>
        {activeTab === 'accounts' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Connected Accounts</h2>
                <p className={styles.sectionSub}>Add your TikTok API bearer tokens. Keys are stored locally in your browser.</p>
              </div>
              <button className={styles.addBtn} onClick={addAccount}>+ Add Account</button>
            </div>

            {!accountsLoaded ? (
              <div className={styles.empty}>Loading…</div>
            ) : accounts.length === 0 ? (
              <div className={styles.empty}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth=".8" opacity=".3">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round"/>
                </svg>
                <p>No accounts yet. Add your first TikTok API token above.</p>
              </div>
            ) : (
              <div className={styles.accountGrid}>
                {accounts.map(account => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onUpdate={updateAccount}
                    onDelete={() => deleteAccount(account.id)}
                    onFetchInfo={fetchCreatorInfo}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'publish' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Publish Queue</h2>
                <p className={styles.sectionSub}>Configure and publish videos to your TikTok accounts.</p>
              </div>
              <button className={styles.addBtn} onClick={addJob} disabled={accounts.length === 0}>
                + New Video Job
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className={styles.empty}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth=".8" opacity=".3">
                  <path d="M15 10l4.553-2.07A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14" strokeLinecap="round"/>
                  <rect x="3" y="6" width="12" height="12" rx="2" strokeLinecap="round"/>
                </svg>
                <p>No video jobs yet.{accounts.length === 0 ? ' Add an account first.' : ' Click "+ New Video Job" to get started.'}</p>
              </div>
            ) : (
              <div className={styles.jobGrid}>
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    accounts={accounts}
                    onUpdate={updateJob}
                    onDelete={() => deleteJob(job.id)}
                    onPublish={publishJob}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerNote}>API keys stored locally · Never sent to any server except TikTok</span>
        <div className={styles.footerLinks}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </footer>
      <DonateWidget />
    </div>
  );
}
