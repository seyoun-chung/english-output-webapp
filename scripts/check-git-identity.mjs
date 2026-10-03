import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

// Deliberately never print actual identity values, even on failure.
const approved = '41880904+seyoun-chung@users.noreply.github.com'
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 })
const history = process.argv.slice(2)
if (history.length > 1 || history.some(arg => !['--history', '--publishable', '--push'].includes(arg))) process.exit(2)
try {
  let failed = false
  for (const kind of ['AUTHOR', 'COMMITTER']) {
    const email = git('var', `GIT_${kind}_IDENT`).match(/<([^<>]+)>/)?.[1]
    if (email !== approved) {
      console.error(`Blocked: effective ${kind.toLowerCase()} email is not the approved noreply identity.`)
      failed = true
    }
  }
  if (history.length) {
    // Full reachable history, not just recent or unpushed commits. Includes tags and remote refs.
    const refs = history.includes('--history') ? ['--all'] : ['--branches', '--remotes', '--tags']
    if (history.includes('--push')) {
      // Include explicitly pushed old SHAs or non-branch refs, not just named branches.
      for (const line of readFileSync(0, 'utf8').trim().split('\n').filter(Boolean)) {
        const parts = line.trim().split(/\s+/)
        if (parts.length !== 4 || !/^[a-f0-9]{40,64}$/.test(parts[1])) throw new Error('Invalid push input')
        if (!/^0+$/.test(parts[1])) refs.push(parts[1])
      }
    }
    const rows = git('log', ...refs, '--format=%H%x09%ae%x09%ce').trim().split('\n').filter(Boolean)
    for (const row of rows) {
      const [sha, author, committer] = row.split('\t')
      if (author !== approved || ![approved, 'noreply@github.com'].includes(committer)) {
        console.error(JSON.stringify({ commit: sha, category: 'unapproved-commit-identity' }))
        failed = true
      }
    }
    console.log(`Identity history: ${rows.length} reachable commits checked.`)
  }
  if (!failed) console.log('Effective Git identities match the approved noreply policy.')
  process.exitCode = failed ? 1 : 0
} catch {
  console.error('Identity check failed closed; Git identity/history could not be read. Details suppressed.')
  process.exitCode = 2
}
