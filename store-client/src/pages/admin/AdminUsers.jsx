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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get('/Users')
        setUsers(response.data || [])
        setError('')
      } catch (requestError) {
        console.error('Admin users request failed:', requestError)
        setError(getAdminErrorMessage(requestError, 'Kullanıcılar getirilemedi.'))
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return (
    <div className="page-section">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Admin Kullanıcılar</h1>
          <p className="section-subtitle">Sistemdeki kullanıcı listesi ve rolleri.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}

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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
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
