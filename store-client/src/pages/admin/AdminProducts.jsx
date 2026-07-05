import { useEffect, useState } from 'react'
import api from '../../api/axios'

const ADMIN_PLACEHOLDER_URL = 'https://placehold.co/120x80?text=%C3%9Cr%C3%BCn'

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

function findProductImage(productId, productImages) {
  const relatedImages = productImages.filter((image) => Number(image.productId) === Number(productId))
  const coverImage = relatedImages.find((image) => image.isCover)

  return coverImage || relatedImages[0] || null
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [productImages, setProductImages] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    categoryId: '',
  })
  const [imageForm, setImageForm] = useState({
    productId: '',
    imageUrl: '',
    isCover: true,
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [imageSubmitting, setImageSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadAdminData = async () => {
    try {
      setError('')
      const [productsResponse, productImagesResponse] = await Promise.all([
        api.get('/Products'),
        api.get('/ProductImages'),
      ])

      setProducts(productsResponse.data || [])
      setProductImages(productImagesResponse.data || [])
    } catch (requestError) {
      console.error('Admin products request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürünler getirilemedi.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleImageChange = (event) => {
    const { name, value, type, checked } = event.target

    setImageForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
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
      await loadAdminData()
    } catch (requestError) {
      console.error('Product create request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürün eklenemedi.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageSubmit = async (event) => {
    event.preventDefault()
    setImageSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      await api.post('/ProductImages', {
        productId: Number(imageForm.productId),
        imageUrl: imageForm.imageUrl,
        isCover: Boolean(imageForm.isCover),
      })

      setSuccessMessage('Görsel başarıyla eklendi.')
      setImageForm({
        productId: '',
        imageUrl: '',
        isCover: true,
      })
      await loadAdminData()
    } catch (requestError) {
      console.error('Product image create request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürün görseli eklenemedi.'))
    } finally {
      setImageSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setError('')
      await api.delete(`/Products/${id}`)
      await loadAdminData()
    } catch (requestError) {
      console.error('Product delete request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Ürün silinemedi.'))
    }
  }

  return (
    <div className="page-section admin-page admin-products-page">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Admin Ürünler</h1>
          <p className="section-subtitle">Ürünleri listele, yeni ürün ve ürün görseli ekle.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}
      {successMessage && <div className="notice success">{successMessage}</div>}

      <div className="admin-grid admin-forms-grid">
        <form className="form-panel admin-form-card admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <h2 className="section-title">Ürün Ekle</h2>
            <p className="muted-text">Yeni ürün ekleme formu mevcut akışı korur.</p>
          </div>

          <div className="admin-product-primary-grid">
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

          <div className="admin-product-meta-grid">
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
          </div>

          <div className="admin-actions-row">
            <button className="button" disabled={submitting} type="submit">
              {submitting ? 'Ekleniyor...' : 'Ürün Ekle'}
            </button>
          </div>
        </form>

        <form className="form-panel admin-form-card admin-image-form" onSubmit={handleImageSubmit}>
          <div className="admin-form-head">
            <h2 className="section-title">Ürün Görseli Ekle</h2>
            <p className="muted-text">Ürün ID, görsel URL ve kapak seçeneğiyle manuel görsel ekle.</p>
          </div>

          <div className="field">
            <label htmlFor="productId">Ürün ID</label>
            <input
              id="productId"
              min="1"
              name="productId"
              required
              type="number"
              value={imageForm.productId}
              onChange={handleImageChange}
            />
          </div>

          <div className="field">
            <label htmlFor="productImageUrl">Görsel URL</label>
            <input
              id="productImageUrl"
              name="imageUrl"
              required
              placeholder="https://ornek.com/urun-gorseli.jpg"
              value={imageForm.imageUrl}
              onChange={handleImageChange}
            />
          </div>

          <label className="checkbox-row" htmlFor="isCover">
            <input
              id="isCover"
              name="isCover"
              type="checkbox"
              checked={imageForm.isCover}
              onChange={handleImageChange}
            />
            <span>Kapak görseli</span>
          </label>

          <div className="admin-actions-row">
            <button className="button-secondary" disabled={imageSubmitting} type="submit">
              {imageSubmitting ? 'Kaydediliyor...' : 'Görsel Ekle'}
            </button>
          </div>
        </form>
      </div>

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
                <th>Görsel</th>
                <th>ID</th>
                <th>Başlık</th>
                <th>Fiyat</th>
                <th>İndirim</th>
                <th>Stok</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const selectedImage = findProductImage(product.id, productImages)
                const imageUrl = selectedImage?.imageUrl || ADMIN_PLACEHOLDER_URL

                return (
                  <tr key={product.id}>
                    <td>
                      <img
                        className="admin-thumb"
                        src={imageUrl}
                        alt={`${product.title} küçük görseli`}
                        onError={(event) => {
                          event.currentTarget.src = ADMIN_PLACEHOLDER_URL
                        }}
                      />
                    </td>
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
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
