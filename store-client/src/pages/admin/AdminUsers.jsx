import { useEffect, useState } from 'react'
import api from '../../api/axios'

function getAdminErrorMessage(requestError, fallbackMessage) {
  const statusCode = requestError?.response?.status

  if (statusCode === 401 || statusCode === 403) {
    return 'Admin verileri için giriş yapmanız gerekiyor.'
  }

  return requestError?.response?.data?.message || fallbackMessage
}

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [selectedRoles, setSelectedRoles] = useState({})
  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadUsers = async () => {
    try {
      const response = await api.get('/Users')
      const userList = response.data || []

      setUsers(userList)
      setSelectedRoles(
        userList.reduce((accumulator, user) => {
          accumulator[user.id] = user.role === 'Admin' ? 'Admin' : 'Customer'
          return accumulator
        }, {}),
      )
      setError('')
    } catch (requestError) {
      console.error('Admin users request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Kullanıcılar getirilemedi.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((current) => ({
      ...current,
      [userId]: role,
    }))
  }

  const handleRoleUpdate = async (userId) => {
    try {
      setUpdatingUserId(userId)
      setError('')
      setSuccessMessage('')

      await api.put(`/Users/${userId}/role`, {
        role: selectedRoles[userId],
      })

      setSuccessMessage('Kullanıcı rolü güncellendi.')
      await loadUsers()
    } catch (requestError) {
      console.error('User role update request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Kullanıcı rolü güncellenemedi.'))
    } finally {
      setUpdatingUserId(null)
    }
  }

  return (
    <div className="page-section admin-page admin-users-page">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Admin Kullanıcılar</h1>
          <p className="section-subtitle">Sistemdeki kullanıcı listesi ve rollerini yönetin.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}
      {successMessage && <div className="notice success">{successMessage}</div>}

      <div className="table-panel">
        {loading ? (
          <div className="loading">Kullanıcılar yükleniyor...</div>
        ) : error ? (
          <div className="loading">Kullanıcı verileri şu anda gösterilemiyor.</div>
        ) : users.length === 0 ? (
          <div className="loading">Henüz kullanıcı bulunmuyor.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad Soyad</th>
                <th>Email</th>
                <th>Rol</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={selectedRoles[user.id] || 'Customer'}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="button-secondary"
                      type="button"
                      disabled={updatingUserId === user.id}
                      onClick={() => handleRoleUpdate(user.id)}
                    >
                      {updatingUserId === user.id ? 'Güncelleniyor...' : 'Rolü Güncelle'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
