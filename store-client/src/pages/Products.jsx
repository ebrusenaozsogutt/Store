import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/Products')
        setProducts(response.data || [])
      } catch (requestError) {
        setError('Ürünler getirilemedi. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h1 className="page-title">Ürünler</h1>
          <p className="section-subtitle">
            Tanım, fiyat, indirimli fiyat ve stok bilgileriyle tüm ürünleri inceleyin.
          </p>
        </div>
      </div>

      {loading && <div className="loading">Ürünler yükleniyor...</div>}
      {!loading && error && <div className="notice error">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">Listelenecek ürün bulunamadı.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
