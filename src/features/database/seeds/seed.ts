import { serverEnv } from '@/features/shared/lib/server-env.server';
import { seedDevelopmentData } from './dev-seed';
import { seedProductionData } from './prod-seed';

async function main() {
  const env = serverEnv.NODE_ENV;
  console.log(`🌱 Seeding başlatıldı. Hedef Ortam: [${env}]`);

  console.log('📦 [1/3] Sistem Enumları ve Rolleri (Prod) içeri aktarılıyor...');
  const coreData = await seedProductionData();
  console.log('✅ Prod verileri başarıyla oluşturuldu.');

  if (env === 'development' || env === 'test') {
    console.log('🛠 [2/3] Geliştirme (Dev) verileri ekleniyor...');
    await seedDevelopmentData(coreData);
  }

  console.log('🎉 Tüm Seeding İşlemleri Başarıyla Tamamlandı!');
}

main().catch((e) => {
  console.error('❌ Seeding sırasında ölümcül hata:', e);
  process.exit(1);
});
