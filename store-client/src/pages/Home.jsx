import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await api.get('/Products')
        setFeaturedProducts((response.data || []).slice(0, 3))
      } catch (requestError) {
        setError('Öne çıkan ürünler yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  return (
    <div className="page-section">
      <section className="hero-panel">
        <div className="hero-grid">
          <div className="page-section">
            <span className="eyebrow">Mini E-Ticaret</span>
            <h1 className="hero-title">Modern alışveriş deneyimi tek bir vitrinde.</h1>
            <p className="hero-text">
              Kampanyalı ürünleri keşfet, hızlı sipariş ver ve admin panelinden tüm
              operasyonu kolayca yönet.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/products">
                Ürünlere Git
              </Link>
              <Link className="button-secondary" to="/register">
                Hemen Üye Ol
              </Link>
            </div>
          </div>

          <div className="hero-preview">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>
              Bugünün Fırsatları
            </span>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>
              İndirimli ürünleri incele, tek tıkla sipariş oluştur.
            </h2>
            <div className="hero-preview-card">
              <strong>Hızlı akış</strong>
              <p style={{ marginTop: 8 }}>
                Ürün detayından miktarı seç, teslimat bilgilerini yaz ve siparişini tamamla.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Öne Çıkan Ürünler</h2>
            <p className="section-subtitle">
              Backend API üzerinden gelen ürünlerden seçilen kısa vitrin.
            </p>
          </div>
          <Link className="button-ghost" to="/products">
            Tümünü Gör
          </Link>
        </div>

        {loading && <div className="loading">Ürünler yükleniyor...</div>}
        {!loading && error && <div className="notice error">{error}</div>}
        {!loading && !error && featuredProducts.length === 0 && (
          <div className="empty-state">Henüz gösterilecek ürün bulunmuyor.</div>
        )}
        {!loading && !error && featuredProducts.length > 0 && (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
