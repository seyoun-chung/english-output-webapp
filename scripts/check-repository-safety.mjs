import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileRisk, isApprovedBinary, remoteRisk, scanText } from './repository-safety.mjs'

const args = process.argv.slice(2)
if (args.some(arg => arg !== '--staged')) {
  console.error('Usage: npm run check:safety -- [--staged]')
  process.exit(2)
}
const staged = args.includes('--staged')
const git = (...args) => execFileSync('git', args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 })
const splitNull = buffer => buffer.toString('utf8').split('\0').filter(Boolean)
const normalizeText = buffer => buffer.toString('utf8').replace(/\r\n/g, '\n')
const findings = []
const add = (path, category) => findings.push({ path, category })

try {
  const root = git('rev-parse', '--show-toplevel').toString().trim()
  process.chdir(root)
  // --cached deliberately includes already tracked files even when now ignored.
  const entries = splitNull(git('ls-files', '--stage', '-z')).map(entry => {
    const [meta, ...path] = entry.split('\t')
    const [mode, hash, stage] = meta.split(' ')
    return { path: path.join('\t'), mode, hash, stage }
  })
  const tracked = new Map(entries.map(entry => [entry.path, entry]))
  const candidates = staged ? [...tracked.keys()] : [...new Set([...tracked.keys(), ...splitNull(git('ls-files', '--others', '--exclude-standard', '-z'))])]
  let scanned = 0
  for (const path of candidates) {
    const risk = fileRisk(path)
    if (risk) { add(path, risk); continue }
    let bytes
    try {
      if (staged) {
        const entry = tracked.get(path)
        if (entry.stage !== '0') { add(path, 'unmerged-index-entry'); continue }
        if (!['100644', '100755'].includes(entry.mode)) { add(path, 'unsupported-index-type'); continue }
        bytes = git('cat-file', 'blob', entry.hash)
      } else {
        const info = lstatSync(resolve(root, path))
        if (!info.isFile()) { add(path, 'non-regular-file'); continue }
        bytes = readFileSync(resolve(root, path))
      }
    } catch (error) {
      // Deleted tracked worktree files have no candidate content; index mode still checks them.
      if (!staged && error.code === 'ENOENT') continue
      add(path, 'unreadable-file'); continue
    }
    if (bytes.includes(0)) {
      if (!isApprovedBinary(path, bytes)) add(path, 'binary-needs-manual-review')
      continue
    }
    findings.push(...scanText(path, bytes.toString('utf8')))
    scanned++
  }
  const ignoreProbes = ['docs/sources/safety-probe.pdf', 'node_modules/safety-probe.js', '.env', '.env.local', '.env.test.local', '.DS_Store', 'build/safety-probe.js', 'dist/safety-probe.js', '.next/safety-probe.js', 'safety-probe.log']
  for (const probe of ignoreProbes) {
    try { git('check-ignore', '--no-index', '-q', '--', probe) }
    catch { add(probe, 'missing-required-ignore') }
  }
  if (staged) {
    // Ignore probes use the worktree. Reject mismatches so a different staged policy cannot pass.
    for (const path of [...new Set([...candidates, ...splitNull(git('ls-files', '--others', '--exclude-standard', '-z'))])].filter(p => /(?:^|\/)\.gitignore$/.test(p))) {
      try {
        if (!tracked.has(path) || normalizeText(readFileSync(path)) !== normalizeText(git('cat-file', 'blob', tracked.get(path).hash))) add(path, 'ignore-policy-not-staged')
      } catch { add(path, 'ignore-policy-unavailable') }
    }
  }
  for (const remote of git('remote').toString().trim().split('\n').filter(Boolean)) {
    for (const direction of [[], ['--push']]) {
      const urls = git('remote', 'get-url', '--all', ...direction, remote).toString().trim().split('\n')
      for (const value of urls) {
        const risk = remoteRisk(value)
        if (risk) add('git-remote', risk)
      }
    }
  }
  console.log(`Safety check (${staged ? 'entire staged index' : 'tracked + nonignored untracked worktree'}): ${scanned} text files scanned.`)
  for (const finding of findings) console.error(JSON.stringify(finding))
  console.log('Pattern checks only; no guarantee of absence of secrets. No credential stores read. Review actual staged diff before an approved commit/push.')
  process.exitCode = findings.length ? 1 : 0
} catch {
  // Git errors can contain remote URLs or personal paths. Never echo raw error output.
  console.error('Safety check could not complete. Verify repository access and Git availability; no raw command output was printed.')
  process.exitCode = 2
}
