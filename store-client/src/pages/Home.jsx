import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function findProductImage(productId, productImages) {
  const relatedImages = productImages.filter((image) => Number(image.productId) === Number(productId))
  const coverImage = relatedImages.find((image) => image.isCover)

  return coverImage || relatedImages[0] || null
}

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const [productsResponse, productImagesResponse] = await Promise.all([
          api.get('/Products'),
          api.get('/ProductImages'),
        ])

        const productList = productsResponse.data || []
        const productImages = productImagesResponse.data || []

        const featuredList = productList.slice(0, 8).map((product) => {
          const selectedImage = findProductImage(product.id, productImages)

          return {
            ...product,
            imageUrl: selectedImage?.imageUrl || '',
          }
        })

        setFeaturedProducts(featuredList)
      } catch (requestError) {
        console.error('Featured products request failed:', requestError)
        setError('Öne çıkan ürünler yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  return (
    <div className="page-section home-page">
      <section className="hero-panel home-hero">
        <div className="hero-grid">
          <div className="hero-copy">
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

            <div className="hero-badges">
              <span className="pill">Güncel ürün vitrini</span>
              <span className="pill">Kolay sipariş akışı</span>
              <span className="pill">Yönetilebilir stok yapısı</span>
            </div>
          </div>

          <div className="hero-preview home-offer-card">
            <span className="eyebrow hero-preview-eyebrow">Bugünün Fırsatları</span>

            <div className="home-offer-content">
              <h2 className="home-offer-title">
                İndirimli ürünleri incele, tek tıkla sipariş oluştur.
              </h2>
              <p className="home-offer-text">
                Görseller, indirimli fiyatlar ve stok bilgileriyle öne çıkan ürünleri
                tek ekranda keşfet.
              </p>
            </div>

            <div className="hero-preview-card home-offer-metric">
              <div>
                <strong>Hızlı akış</strong>
                <p>
                  Ürün detayından miktarı seç, teslimat bilgilerini yaz ve siparişini
                  tamamla.
                </p>
              </div>
              <span className="home-offer-chip">Canlı vitrin</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-highlights">
        <article className="highlight-card">
          <span className="highlight-icon">01</span>
          <h3>Hızlı Sipariş</h3>
          <p>Ürün detayından doğrudan sipariş akışına geçip işlemi kısa sürede tamamlayın.</p>
        </article>

        <article className="highlight-card">
          <span className="highlight-icon">02</span>
          <h3>Güvenli Üyelik</h3>
          <p>Kayıt ve giriş akışıyla kullanıcı deneyimini düzenli ve kesintisiz tutun.</p>
        </article>

        <article className="highlight-card">
          <span className="highlight-icon">03</span>
          <h3>Stok Takibi</h3>
          <p>Sipariş sonrası stok güncellensin, vitrinde yalnızca güncel ürün bilgileri yer alsın.</p>
        </article>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Öne Çıkan Ürünler</h2>
            <p className="section-subtitle">
              Backend API üzerinden gelen ürünlerden seçilen daha dolu bir vitrin.
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
          <div className="product-grid home-featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                imageUrl={product.imageUrl}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
