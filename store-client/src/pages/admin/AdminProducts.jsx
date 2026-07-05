import { useEffect, useState } from 'react'
import api from '../../api/axios'

function getAdminErrorMessage(requestError, fallbackMessage) {
  const statusCode = requestError?.response?.status

  if (statusCode === 401 || statusCode === 403) {
    return 'Admin işlemleri için giriş yapmanız gerekiyor.'
  }

  return requestError?.response?.data?.message || fallbackMessage
}

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    categoryId: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadProducts = async () => {
    try {
      setError('')
      const response = await api.get('/Products')
      setProducts(response.data || [])
    } catch (requestError) {
      console.error('Admin products request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürünler getirilemedi.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
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
      await api.post('/Products', {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stockQuantity: Number(formData.stockQuantity),
        categoryId: Number(formData.categoryId),
      })

      setSuccessMessage('Ürün başarıyla eklendi.')
      setFormData({
        title: '',
        description: '',
        price: '',
        discountPrice: '',
        stockQuantity: '',
        categoryId: '',
      })
      await loadProducts()
    } catch (requestError) {
      console.error('Product create request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürün eklenemedi.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await api.delete(`/Products/${id}`)
      await loadProducts()
    } catch (requestError) {
      console.error('Product delete request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürün silinemedi.'))
    }
  }

  return (
    <div className="page-section">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Admin Ürünler</h1>
          <p className="section-subtitle">Ürünleri listele, yeni ürün ekle veya sil.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}
      {successMessage && <div className="notice success">{successMessage}</div>}

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="two-column">
          <div className="field">
            <label htmlFor="title">Başlık</label>
            <input id="title" name="title" required value={formData.title} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="categoryId">Kategori ID</label>
            <input
              id="categoryId"
              min="1"
              name="categoryId"
              required
              type="number"
              value={formData.categoryId}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="two-column">
          <div className="field">
            <label htmlFor="price">Fiyat</label>
            <input id="price" min="0" name="price" required type="number" value={formData.price} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="discountPrice">İndirimli Fiyat</label>
            <input
              id="discountPrice"
              min="0"
              name="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="stockQuantity">Stok Miktarı</label>
          <input
            id="stockQuantity"
            min="0"
            name="stockQuantity"
            required
            type="number"
            value={formData.stockQuantity}
            onChange={handleChange}
          />
        </div>

        <button className="button" disabled={submitting} type="submit">
          {submitting ? 'Ekleniyor...' : 'Ürün Ekle'}
        </button>
      </form>

      <div className="table-panel">
        {loading ? (
          <div className="loading">Ürünler yükleniyor...</div>
        ) : error ? (
          <div className="loading">Ürün verileri şu anda gösterilemiyor.</div>
        ) : products.length === 0 ? (
          <div className="loading">Henüz ürün bulunmuyor.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Başlık</th>
                <th>Fiyat</th>
                <th>İndirim</th>
                <th>Stok</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.discountPrice != null ? formatCurrency(product.discountPrice) : '-'}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <button className="button-danger" type="button" onClick={() => handleDelete(product.id)}>
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

export default AdminProducts
