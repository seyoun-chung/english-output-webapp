import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

export default defineConfig({
  plugins: [{
    name: 'loopback-only-development-sync',
    apply: 'serve',
    configureServer(server) {
      if (process.env.VITE_LOCAL_SYNC_TEST !== '1') return;
      // A test-only directory can be supplied to an isolated Vite process. No remote calls.
      const directory = process.env.ENGLISH_OUTPUT_TEST_SYNC_DIR || join(process.env.LOCALAPPDATA || homedir(), 'EnglishOutput', 'local-sync', createHash('sha256').update(resolve('.')).digest('hex').slice(0, 16));
      // Load development code through Vite, not the config's native Node loader.
      let services: Promise<{ store: import('./server/localSyncStore').LocalSyncStore; maxBytes: number }> | undefined;
      const getServices = () => services ??= Promise.all([
        server.ssrLoadModule('/server/localSyncStore.ts'), server.ssrLoadModule('/src/progressBackup.ts'),
      ]).then(([storeModule, backupModule]) => ({ store: new storeModule.LocalSyncStore(directory), maxBytes: backupModule.MAX_BACKUP_BYTES }));
      server.middlewares.use('/api/local-sync', async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        const reply = (status: number, value: unknown) => { res.statusCode = status; res.end(JSON.stringify(value)); };
        const host = req.headers.host ?? '';
        const remote = req.socket.remoteAddress;
        if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host) || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote ?? '')) {
          reply(403, { error: 'Local testing only.' }); return;
        }
        if (req.url !== '/' && req.url !== '') { reply(404, { error: 'Not found.' }); return; }
        try {
          const { store, maxBytes } = await getServices();
          if (req.method === 'GET') { reply(200, await store.read()); return; }
          if (req.method !== 'PUT') { reply(405, { error: 'Method not allowed.' }); return; }
          if (req.headers.origin !== `http://${host}` || req.headers['x-english-output-sync'] !== '1'
            || !req.headers['content-type']?.startsWith('application/json')) {
            reply(403, { error: 'Same-origin JSON request required.' }); return;
          }
          let size = 0; const chunks: Buffer[] = [];
          for await (const chunk of req) {
            const bytes = Buffer.from(chunk); size += bytes.length;
            if (size > maxBytes) { reply(413, { error: 'Record too large.' }); return; }
            chunks.push(bytes);
          }
          let body: unknown;
          try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { reply(400, { error: 'Invalid JSON.' }); return; }
          const result = await store.write(body);
          reply(result.status === 'conflict' ? 409 : 200, result);
        } catch { reply(503, { error: 'Local sync could not finish safely. Your browser record is unchanged.' }); }
      });
    },
  }],
});
