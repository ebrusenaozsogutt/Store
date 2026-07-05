export function isAdminRole(role) {
  if (role === null || role === undefined) {
    return false
  }

  const normalizedRole = String(role).trim().toLowerCase()

  return normalizedRole === 'admin' || normalizedRole === '1'
}

export function extractRoleValue(payload) {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const directRole = payload.role

  if (directRole !== null && directRole !== undefined && directRole !== '') {
    return String(directRole)
  }

  const nestedRole = payload.user?.role

  if (nestedRole !== null && nestedRole !== undefined && nestedRole !== '') {
    return String(nestedRole)
  }

  return ''
}
