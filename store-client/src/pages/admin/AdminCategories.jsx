import { useEffect, useState } from 'react'
import api from '../../api/axios'

function getAdminErrorMessage(requestError, fallbackMessage) {
  const statusCode = requestError?.response?.status

  if (statusCode === 401 || statusCode === 403) {
    return 'Admin işlemleri için giriş yapmanız gerekiyor.'
  }

  return requestError?.response?.data?.message || fallbackMessage
}

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    parentCategoryId: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadCategories = async () => {
    try {
      setError('')
      const response = await api.get('/Categories')
      setCategories(response.data || [])
    } catch (requestError) {
      console.error('Admin categories request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Kategoriler getirilemedi.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await api.post('/Categories', {
        name: formData.name,
        parentCategoryId: formData.parentCategoryId ? Number(formData.parentCategoryId) : null,
      })

      setSuccessMessage('Kategori başarıyla eklendi.')
      setFormData({
        name: '',
        parentCategoryId: '',
      })
      await loadCategories()
    } catch (requestError) {
      console.error('Category create request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Kategori eklenemedi.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await api.delete(`/Categories/${id}`)
      await loadCategories()
    } catch (requestError) {
      console.error('Category delete request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Kategori silinemedi.'))
    }
  }

  return (
    <div className="page-section">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Admin Kategoriler</h1>
          <p className="section-subtitle">Kategori ekle, parent ID ver veya sil.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}
      {successMessage && <div className="notice success">{successMessage}</div>}

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="two-column">
          <div className="field">
            <label htmlFor="name">Ad</label>
            <input id="name" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="parentCategoryId">Üst Kategori ID</label>
            <input
              id="parentCategoryId"
              min="1"
              name="parentCategoryId"
              type="number"
              value={formData.parentCategoryId}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="button" disabled={submitting} type="submit">
          {submitting ? 'Ekleniyor...' : 'Kategori Ekle'}
        </button>
      </form>

      <div className="table-panel">
        {loading ? (
          <div className="loading">Kategoriler yükleniyor...</div>
        ) : error ? (
          <div className="loading">Kategori verileri şu anda gösterilemiyor.</div>
        ) : categories.length === 0 ? (
          <div className="loading">Henüz kategori bulunmuyor.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ad</th>
                <th>Üst Kategori ID</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.parentCategoryId ?? '-'}</td>
                  <td>
                    <button className="button-danger" type="button" onClick={() => handleDelete(category.id)}>
                      Sil
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

export default AdminCategories
