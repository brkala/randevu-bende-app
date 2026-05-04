import { S3Client } from '@aws-sdk/client-s3';
import { serverEnv } from '@/features/shared/lib/server-env.server';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${serverEnv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
  },
});
