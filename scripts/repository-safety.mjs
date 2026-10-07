import { createHash } from 'node:crypto'

// Pure pattern checks. Findings deliberately contain no matched values or source excerpts.
const patterns = [
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g],
  ['api-key', /\b(?:sk-[A-Za-z0-9_-]{20,}|AIza[A-Za-z0-9_-]{30,}|(?:AKIA|ASIA)[A-Z0-9]{16})\b/g],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{15,}\b/g],
  ['private-key', /-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----/g],
  ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g],
  ['credential-url', /[a-z][a-z0-9+.-]*:\/\/[^\s/@]+(?::[^\s/@]*)?@[^\s/]+/gi],
  ['authorization-value', /\b(?:Bearer|Basic)\s+[A-Za-z0-9+/_=-]{12,}/gi],
  ['literal-secret', /["']?\b(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password|passwd)\b["']?\s*[:=]\s*["'][^"'\r\n]{8,}["']/gi],
  ['personal-computer-path', /(?:\/(?:Users|home)\/[^\s/"'<>]+|[A-Z]:\\Users\\[^\s\\"'<>]+)/g],
]

// These assets and user-approved submission deliverables were manually reviewed.
// Pin exact digests so any later byte or metadata change requires a fresh review.
const approvedBinaryAssets = new Map([
  ['public/skins/walnut-cafe.png', 'fb0c4d35c3ce4ba93dbf083294a3543f0914cd6b67d47f8a99277c6e3a361508'],
  ['public/skins/walnut-library.png', '5c06016f9842b0789081f9af7cafa7c02821f7bc6138658f69004efbeae878e1'],
  ['docs/submission/english-output-webapp-project-plan.pdf', '35433a8be0e0b3671ebf540aec38fee8998bb63f087fcbf2e1512411711ba825'],
  ['docs/submission/english-output-webapp-intro.mp4', '0c5afb9e402c713e07e98e30484a2143cf6ecf82aa693c6dd818884c6008e9c2'],
  ['docs/submission/english-output-webapp-intro-thumbnail.jpg', 'f06a120cebd47cb459af927bb0f41c198fb374e8ec0c55d52b6027aca840ceb5'],
])

export function isApprovedBinary(path, bytes) {
  const expected = approvedBinaryAssets.get(path.replaceAll('\\', '/'))
  if (!expected) return false
  return createHash('sha256').update(bytes).digest('hex') === expected
}

export function fileRisk(path) {
  if (/(?:^|\/)(?:node_modules|dist|build|\.next|\.git)(?:\/|$)/i.test(path)) return 'excluded-directory'
  if (/(?:^|\/)(?:\.env(?:\..*)?|\.DS_Store|id_(?:rsa|dsa|ecdsa|ed25519)|credentials(?:\.json)?|\.npmrc|\.netrc)$/i.test(path)) return 'sensitive-filename'
  if (/\.pdf$/i.test(path) && path !== 'docs/submission/english-output-webapp-project-plan.pdf') return 'excluded-file-type'
  if (/\.(?:webm|mp3|mp4|m4a|wav|ogg|aac|flac|log|pem|key|p12|pfx)$/i.test(path) && path !== 'docs/submission/english-output-webapp-intro.mp4') return 'excluded-file-type'
  return null
}

export function scanText(path, text) {
  const findings = []
  for (const [category, pattern] of patterns) {
    pattern.lastIndex = 0
    for (const match of text.matchAll(pattern)) {
      if (category === 'credential-url' && /^ssh:\/\/git@/i.test(match[0])) continue
      findings.push({ path, line: text.slice(0, match.index).split('\n').length, category })
    }
  }
  return findings
}

export function remoteRisk(value) {
  // Conventional SSH git@host:path is a username, not an embedded password.
  if (/^[^\s:@]+@[^\s:]+:[^\s]+$/.test(value)) return null
  try {
    const url = new URL(value)
    if (url.password || (url.username && !(url.protocol === 'ssh:' && url.username === 'git'))) return 'remote-credentials'
    if (url.search || url.hash) return 'remote-query-or-fragment'
  } catch {
    // Local remotes have no URL credentials, but still check known token patterns.
  }
  return scanText('git-remote', value).some(f => f.category !== 'personal-computer-path') ? 'remote-secret-pattern' : null
}
