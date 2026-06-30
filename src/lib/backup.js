function currentUserPrefix() {
  const session = localStorage.getItem('__mc_session__')
  if (!session) return null
  try {
    const { sub } = JSON.parse(session)
    return sub ? `u_${sub}__` : null
  } catch {
    return null
  }
}

export function exportUserData() {
  const prefix = currentUserPrefix()
  if (!prefix) throw new Error('No active session')

  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      data[key.slice(prefix.length)] = localStorage.getItem(key)
    }
  }

  return {
    app: 'mission-control',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function downloadBackup() {
  const backup = exportUserData()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mission-control-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function importUserData(parsed) {
  const prefix = currentUserPrefix()
  if (!prefix) throw new Error('No active session')
  if (!parsed || parsed.app !== 'mission-control' || typeof parsed.data !== 'object') {
    throw new Error('Not a valid Mission Control backup file')
  }

  Object.entries(parsed.data).forEach(([key, value]) => {
    localStorage.setItem(`${prefix}${key}`, value)
  })
}
