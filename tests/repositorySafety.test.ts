import { describe, expect, it } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileRisk, isApprovedBinary, remoteRisk, scanText } from '../scripts/repository-safety.mjs'

describe('repository safety patterns', () => {
  it.each(['english-output-webapp-intro.mp4', 'english-output-webapp-intro-thumbnail.jpg'])('pins approved submission media %s to exact bytes', filename => {
    const path = `docs/submission/${filename}`
    const bytes = readFileSync(resolve(path))
    expect(fileRisk(path)).toBeNull()
    expect(isApprovedBinary(path, bytes)).toBe(true)
    const changed = Buffer.from(bytes)
    changed[changed.length - 1] ^= 1
    expect(isApprovedBinary(path, changed)).toBe(false)
    expect(isApprovedBinary(path, Buffer.from('plain-text replacement'))).toBe(false)
    expect(isApprovedBinary(`docs/submission/other-${filename}`, bytes)).toBe(false)
    expect(fileRisk('docs/submission/other.mp4')).toBe('excluded-file-type')
  })
  it.each(['.env', '.env.example', 'src/.env.production', 'docs/sources/book.pdf', 'audio.webm', 'voice.mp3', 'node_modules/a.js', 'dist/index.js', 'build/a.js', '.next/a.js', '.DS_Store', 'debug.log', 'id_ed25519', 'secret.pem'])('rejects risky candidate %s', path => {
    expect(fileRisk(path)).not.toBeNull()
  })
  it.each(['src/App.tsx', 'docs/verification.md', 'package-lock.json', '.gitignore'])('permits ordinary text filename %s', path => {
    expect(fileRisk(path)).toBeNull()
  })
  it('finds token categories and lines without exposing matched text', () => {
    const fake = ['gh', 'p_', 'x'.repeat(36)].join('')
    const findings = scanText('fixture.txt', `safe\n${fake}`)
    expect(findings).toEqual([{ path: 'fixture.txt', line: 2, category: 'github-token' }])
    expect(JSON.stringify(findings)).not.toContain(fake)
  })
  it.each([
    ['api-key', ['sk', '-', 'q'.repeat(35)].join('')],
    ['private-key', ['-----BEGIN ', 'PRIVATE KEY-----'].join('')],
    ['authorization-value', ['Bearer', 'z'.repeat(20)].join(' ')],
    ['literal-secret', ['password', '=', JSON.stringify('sample-value')].join('')],
    ['personal-computer-path', ['', 'Users', 'sample-user', 'project'].join('/')],
    ['credential-url', ['https://', 'sample-user', ':', 'sample-pass', '@example.com'].join('')],
  ])('detects %s', (category, input) => {
    expect(scanText('fixture.txt', input).some(finding => finding.category === category)).toBe(true)
  })
  it('accepts normal remotes but rejects embedded credentials or query secrets', () => {
    expect(remoteRisk('https://github.com/example/project.git')).toBeNull()
    expect(remoteRisk('git@github.com:example/project.git')).toBeNull()
    expect(remoteRisk('ssh://git@github.com/example/project.git')).toBeNull()
    expect(remoteRisk(['https://', 'sample-user', '@github.com/example/project.git'].join(''))).toBe('remote-credentials')
    expect(remoteRisk('https://github.com/example/project.git?access=example')).toBe('remote-query-or-fragment')
  })
  it.each(['walnut-cafe.png', 'walnut-library.png'])('pins the manually reviewed binary asset %s by digest', filename => {
    const path = `public/skins/${filename}`
    const bytes = readFileSync(resolve(path))
    expect(isApprovedBinary(path, bytes)).toBe(true)
    const changed = Buffer.from(bytes)
    changed[changed.length - 1] ^= 1
    expect(isApprovedBinary(path, changed)).toBe(false)
  })
  it('allows only the exact reviewed submission PDF path and bytes', () => {
    const path = 'docs/submission/english-output-webapp-project-plan.pdf'
    const bytes = readFileSync(resolve(path))
    expect(fileRisk(path)).toBeNull()
    expect(isApprovedBinary(path, bytes)).toBe(true)
    expect(isApprovedBinary('docs/submission/other.pdf', bytes)).toBe(false)
    expect(fileRisk('docs/submission/other.pdf')).toBe('excluded-file-type')
    expect(fileRisk('docs/sources/english-output-webapp-project-plan.pdf')).toBe('excluded-file-type')
    const changed = Buffer.from(bytes)
    changed[changed.length - 1] ^= 1
    expect(isApprovedBinary(path, changed)).toBe(false)
  })
})

describe('read-only Git candidate checks', () => {
  it('checks ignored tracked files and staged blobs, not only worktree replacements', () => {
    const directory = mkdtempSync(join(tmpdir(), 'english-safety-test-'))
    const script = resolve('scripts/check-repository-safety.mjs')
    const git = (...args: string[]) => execFileSync('git', args, { cwd: directory, stdio: 'pipe' })
    const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], { cwd: directory, encoding: 'utf8' })
    try {
      git('init', '-q')
      const ignorePolicy = 'docs/sources/*.pdf\nnode_modules/\n.env\n.env.local\n.env.*.local\n.DS_Store\nbuild/\ndist/\n.next/\n*.log\n'
      writeFileSync(join(directory, '.gitignore'), ignorePolicy)
      writeFileSync(join(directory, 'safe.txt'), 'ordinary text')
      git('add', '.gitignore', 'safe.txt')
      expect(run().status).toBe(0)
      expect(run('--staged').status).toBe(0)
      writeFileSync(join(directory, '.gitignore'), ignorePolicy.replace(/\n/g, '\r\n'))
      expect(run('--staged').status).toBe(0)
      const fake = ['gh', 'o_', 'z'.repeat(36)].join('')
      writeFileSync(join(directory, 'untracked.txt'), fake)
      expect(run().stderr).toContain('github-token')
      expect(run('--staged').status).toBe(0)
      writeFileSync(join(directory, 'untracked.txt'), 'ordinary text')
      writeFileSync(join(directory, 'safe.txt'), fake)
      git('add', 'safe.txt')
      writeFileSync(join(directory, 'safe.txt'), 'clean worktree replacement')
      expect(run().status).toBe(0)
      const result = run('--staged')
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('github-token')
      expect(result.stderr).not.toContain(fake)
      writeFileSync(join(directory, '.env'), 'ordinary text')
      git('add', '-f', '.env')
      expect(run().stderr).toContain('sensitive-filename')
      const before = git('status', '--porcelain').toString()
      run('--staged')
      expect(git('status', '--porcelain').toString()).toBe(before)
      writeFileSync(join(directory, '.gitignore'), '*.log\n')
      expect(run().stderr).toContain('missing-required-ignore')
      expect(run('--staged').stderr).toContain('ignore-policy-not-staged')
      writeFileSync(join(directory, '.gitignore'), ignorePolicy)
      mkdirSync(join(directory, 'docs', 'submission'), { recursive: true })
      const pdfPath = 'docs/submission/english-output-webapp-project-plan.pdf'
      writeFileSync(join(directory, pdfPath), readFileSync(resolve(pdfPath)))
      expect(run().status).toBe(1) // Previously staged sensitive .env still blocks.
      expect(run().stderr).not.toContain('binary-needs-manual-review')
      writeFileSync(join(directory, pdfPath), 'plain-text replacement without a null byte')
      expect(run().stderr).toContain('binary-needs-manual-review')
      git('add', pdfPath)
      writeFileSync(join(directory, pdfPath), readFileSync(resolve(pdfPath)))
      expect(run('--staged').stderr).toContain('binary-needs-manual-review')
      git('remote', 'add', 'origin', ['https://', 'sample-user', '@example.com/project.git'].join(''))
      const remoteResult = run()
      expect(remoteResult.stderr).toContain('remote-credentials')
      expect(remoteResult.stderr).not.toContain('sample-user')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  }, 15_000)
})
