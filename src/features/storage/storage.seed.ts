import fs from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import '@/features/shared/lib/env-loader.server';
import { serverEnv } from '@/features/shared/lib/server-env.server';
import { r2Client } from './lib/r2-client.server';

const SEED_DIR = path.join(process.cwd(), 'src/features/storage/assets');
const TARGET_PREFIX = 'seed/';

interface LocalFile {
  fullPath: string;
  fileKey: string;
  size: number;
}

async function getLocalFiles(dir: string, baseDir: string, results: LocalFile[] = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await getLocalFiles(fullPath, baseDir, results);
    } else {
      const stats = await fs.stat(fullPath);
      // R2 anahtarı için başına 'assets/' ekliyoruz
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const fileKey = `${TARGET_PREFIX}${relativePath}`;
      results.push({ fullPath, fileKey, size: stats.size });
    }
  }
  return results;
}

function getContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return types[ext] || 'application/octet-stream';
}

async function main() {
  console.log(`🌱 Storage Sync başlatıldı [${serverEnv.NODE_ENV}]...`);

  if (serverEnv.NODE_ENV === 'production') {
    console.error('❌ HATA: Production ortamında sync yapılamaz!');
    process.exit(1);
  }

  // 1. Yerel dosyaları al
  const localFiles = await getLocalFiles(SEED_DIR, SEED_DIR);
  const localKeys = new Set(localFiles.map((f) => f.fileKey));

  // 2. Bucket'taki TÜM dosyaları al
  const listCommand = new ListObjectsV2Command({ Bucket: serverEnv.R2_BUCKET_NAME });
  const listResponse = await r2Client.send(listCommand);
  const remoteFiles = listResponse.Contents || [];

  // 3. Temizlik: Yerelde olmayan HER ŞEYİ sil (root ve seed klasörü dahil)
  const keysToDelete = remoteFiles
    .filter((f) => f.Key && !localKeys.has(f.Key))
    .map((f) => ({ Key: f.Key }));

  if (keysToDelete.length > 0) {
    await r2Client.send(
      new DeleteObjectsCommand({
        Bucket: serverEnv.R2_BUCKET_NAME,
        Delete: { Objects: keysToDelete },
      }),
    );
    console.log(`🧹 ${keysToDelete.length} adet yabancı/eski dosya temizlendi.`);
  }

  // 4. Yükleme: Yeni veya değişmiş olanları gönder
  const remoteMap = new Map(remoteFiles.map((f) => [f.Key, f.Size]));

  for (const local of localFiles) {
    const remoteSize = remoteMap.get(local.fileKey);

    if (remoteSize === local.size) {
      console.log(`➖ Atlandı (Değişmedi): ${local.fileKey}`);
      continue;
    }

    const fileBuffer = await fs.readFile(local.fullPath);
    await r2Client.send(
      new PutObjectCommand({
        Bucket: serverEnv.R2_BUCKET_NAME,
        Key: local.fileKey,
        Body: fileBuffer,
        ContentType: getContentType(local.fileKey),
      }),
    );
    console.log(`🚀 ${remoteSize === undefined ? 'Yeni' : 'Güncellendi'}: ${local.fileKey}`);
  }

  console.log(`🎉 İşlem tamam! Bucket'ta sadece /${TARGET_PREFIX} klasörü senkronize edildi.`);
}

main().catch((err) => {
  console.error('❌ Hata:', err);
  process.exit(1);
});
