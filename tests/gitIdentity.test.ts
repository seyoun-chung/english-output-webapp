import { it, expect } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

it('checks effective overrides and historical identities without printing private values', () => {
  const dir = mkdtempSync(join(tmpdir(), 'identity-guard-'))
  const script = resolve('scripts/check-git-identity.mjs')
  const approved = '41880904+seyoun-chung@users.noreply.github.com'
  const privateFixture = ['private-user', 'example.test'].join('@')
  const env = { ...process.env, GIT_AUTHOR_NAME: 'Test', GIT_COMMITTER_NAME: 'Test', GIT_AUTHOR_EMAIL: approved, GIT_COMMITTER_EMAIL: approved }
  const git = (args: string[], custom = env) => execFileSync('git', args, { cwd: dir, env: custom, stdio: 'pipe' })
  const check = (args: string[] = [], custom = env) => spawnSync(process.execPath, [script, ...args], { cwd: dir, env: custom, encoding: 'utf8' })
  try {
    git(['init', '-q'])
    expect(check().status).toBe(0)
    for (const key of ['GIT_AUTHOR_EMAIL', 'GIT_COMMITTER_EMAIL']) {
      const result = check([], { ...env, [key]: privateFixture })
      expect(result.status).toBe(1)
      expect(result.stderr).not.toContain(privateFixture)
    }
    git(['-c', 'core.hooksPath=', 'commit', '--allow-empty', '-m', 'fixture'], { ...env, GIT_AUTHOR_EMAIL: privateFixture })
    git(['-c', 'core.hooksPath=', 'commit', '--allow-empty', '-m', 'safe tip'])
    expect(check().status).toBe(0)
    const historical = check(['--history'])
    expect(historical.status).toBe(1)
    expect(historical.stderr).toContain('unapproved-commit-identity')
    expect(historical.stderr).not.toContain(privateFixture)
    expect(check(['--publishable']).status).toBe(1)
    const unsafeSha = git(['rev-parse', 'HEAD']).toString().trim()
    const pushed = spawnSync(process.execPath, [script, '--push'], { cwd: dir, env, encoding: 'utf8', input: `refs/heads/main ${unsafeSha} refs/heads/main ${'0'.repeat(40)}\n` })
    expect(pushed.status).toBe(1)
    expect(pushed.stderr).not.toContain(privateFixture)
    expect(check(['--unknown']).status).toBe(2)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
