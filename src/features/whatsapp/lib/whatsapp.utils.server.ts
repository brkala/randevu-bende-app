import { serverEnv } from '@/features/shared/lib/server-env.server';

export function isWhatsAppMagicCode(code: string) {
  const magic = serverEnv.WHATSAPP_MAGIC_CODE;
  return serverEnv.NODE_ENV !== 'production' && !!magic && code === magic;
}
