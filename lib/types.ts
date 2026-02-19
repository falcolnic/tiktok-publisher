export interface TikTokAccount {
  id: string;
  label: string;
  token: string;
  creatorInfo?: CreatorInfo;
  fetchedAt?: number;
}

export interface CreatorInfo {
  creator_username: string;
  creator_nickname: string;
  creator_avatar_url: string;
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
}

export type UploadSource = 'FILE_UPLOAD' | 'PULL_FROM_URL';

export interface PostJob {
  id: string;
  accountId: string;
  title: string;
  privacyLevel: string;
  disableComment: boolean;
  disableDuet: boolean;
  disableStitch: boolean;
  videoCoverTimestampMs: number;
  source: UploadSource;
  // FILE_UPLOAD
  file?: File;
  // PULL_FROM_URL
  videoUrl?: string;
  // Runtime state
  status: 'idle' | 'querying' | 'uploading' | 'processing' | 'done' | 'error';
  progress: number; // 0-100
  publishId?: string;
  error?: string;
  statusMessage?: string;
}
