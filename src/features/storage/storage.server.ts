import { CopyObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { serverEnv } from '@/features/shared/lib/server-env.server';
import { r2Client } from './lib/r2-client.server';

export async function getPresignedUploadUrl(
  fileKey: string,
  contentType: string,
  contentLength?: number,
) {
  const tempKey = `temp/${fileKey.replace(/^temp\//, '')}`;

  const command = new PutObjectCommand({
    Bucket: serverEnv.R2_BUCKET_NAME,
    Key: tempKey,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

export async function finalizeFile(tempKey: string) {
  if (!tempKey.startsWith('temp/')) return tempKey;

  const permanentKey = tempKey.replace(/^temp\//, '');

  await r2Client.send(
    new CopyObjectCommand({
      Bucket: serverEnv.R2_BUCKET_NAME,
      CopySource: `${serverEnv.R2_BUCKET_NAME}/${tempKey}`,
      Key: permanentKey,
    }),
  );

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: serverEnv.R2_BUCKET_NAME,
      Key: tempKey,
    }),
  );

  return permanentKey;
}

export function getPublicUrl(fileKey: string) {
  const baseUrl = serverEnv.R2_PUBLIC_DOMAIN.replace(/\/$/, '');
  return `${baseUrl}/${fileKey}`;
}

export async function deleteFile(fileKey: string) {
  const command = new DeleteObjectCommand({
    Bucket: serverEnv.R2_BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
}
