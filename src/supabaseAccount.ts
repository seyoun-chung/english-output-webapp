import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { sameProgress, validateCurrentProgress } from './progressBackup';
import { parseSyncSnapshot, type SyncSnapshot } from './syncProtocol';
import { SyncConflict, type SyncTransport } from './syncClient';
import type { FirstTouch, UsageEvent, UsageTransport } from './usageTracking';

export type AccountConfig = { url: string; key: string };
const boundedFetch: typeof fetch = (input, init) => fetch(input, {
  ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
});
export function accountConfig(env: Record<string, unknown>): AccountConfig | null {
  if (env.VITE_ACCOUNT_SYNC_ENABLED !== '1') return null;
  const url = new URL(String(env.VITE_SUPABASE_URL ?? ''));
  const key = String(env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '');
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) || url.username || url.password
    || url.port || url.pathname !== '/' || url.search || url.hash || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error('Account connection is not configured safely.');
  }
  return { url: url.origin, key };
}
export const makeAccountClient = (config: AccountConfig) => createClient(config.url, config.key, {
  global: { fetch: boundedFetch },
  auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: `english-output-auth:${new URL(config.url).hostname}` },
});

export function supabaseSyncTransport(client: SupabaseClient, config: AccountConfig, userId: string): SyncTransport {
  let cached: SyncSnapshot | null = null;
  const scopedRpc = async (name: string, args?: Record<string, unknown>) => {
    const before = await client.auth.getSession();
    if (before.error || before.data.session?.user.id !== userId) throw new Error('Account changed. Sign in again.');
    // Bind the request to this captured token, not a mutable global auth session.
    const token = before.data.session.access_token;
    const scoped = createClient(config.url, config.key, { accessToken: async () => token, global: { fetch: boundedFetch } });
    const { data, error } = await scoped.rpc(name, args);
    const after = await client.auth.getSession();
    if (after.error || after.data.session?.user.id !== userId) throw new Error('Account changed. Nothing was applied to this browser.');
    if (error) throw new Error('Sync unavailable. Your local record is safe. Try again after signing in.');
    return data;
  };
  return {
    read: async () => {
      // Capture a private copy for this request; callers cannot mutate the cache.
      const known = cached;
      const data = known
        ? await scopedRpc('read_learning_progress_since', { known_revision: known.revision })
        : await scopedRpc('read_learning_progress');
      if (data?.unchanged === true) {
        if (!known || data.revision !== known.revision) throw new Error('Invalid sync revision.');
        return structuredClone(known);
      }
      const snapshot = parseSyncSnapshot(data);
      cached = structuredClone(snapshot);
      return snapshot;
    },
    write: async request => {
      validateCurrentProgress(request.progress);
      const result = await scopedRpc('write_learning_progress', { base_revision: request.baseRevision, operation_id: request.operationId, payload: request.progress });
      const snapshot = parseSyncSnapshot(result?.snapshot);
      if (result?.status === 'conflict') throw new SyncConflict(snapshot);
      if (result?.status !== 'saved' || !sameProgress(snapshot.progress, request.progress)) throw new Error('Sync response did not match your record.');
      return snapshot;
    },
  };
}

export function supabaseUsageTransport(client: SupabaseClient, config: AccountConfig, userId: string): UsageTransport {
  return {
    write: async (firstTouch: FirstTouch, events: UsageEvent[]) => {
      if (!events.length) return;
      const before = await client.auth.getSession();
      if (before.error || before.data.session?.user.id !== userId) throw new Error('Account changed. Usage data was not sent.');
      const token = before.data.session.access_token;
      const scoped = createClient(config.url, config.key, { accessToken: async () => token, global: { fetch: boundedFetch } });
      const { error } = await scoped.rpc('record_usage_events', { first_touch: firstTouch, events });
      const after = await client.auth.getSession();
      if (after.error || after.data.session?.user.id !== userId) throw new Error('Account changed. Usage data was not confirmed.');
      if (error) throw new Error('Usage data is queued for retry.');
    },
  };
}
