import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

function findProductImage(productId, productImages) {
  const relatedImages = productImages.filter((image) => Number(image.productId) === Number(productId))
  const coverImage = relatedImages.find((image) => image.isCover)

  return coverImage || relatedImages[0] || null
}

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [productsResponse, productImagesResponse] = await Promise.all([
          api.get('/Products'),
          api.get('/ProductImages'),
        ])

        const productList = productsResponse.data || []
        const productImages = productImagesResponse.data || []

        const productsWithImages = productList.map((product) => {
          const selectedImage = findProductImage(product.id, productImages)

          return {
            ...product,
            imageUrl: selectedImage?.imageUrl || '',
          }
        })

        setProducts(productsWithImages)
      } catch (requestError) {
        console.error('Products request failed:', requestError)
        setError('Ürünler getirilemedi. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="page-section products-page">
      <div className="section-header products-page-header">
        <div>
          <h1 className="page-title">Ürünler</h1>
          <p className="section-subtitle">
            Tanım, fiyat, indirimli fiyat, görsel ve stok bilgileriyle tüm ürünleri inceleyin.
          </p>
        </div>
      </div>

      {loading && <div className="loading">Ürünler yükleniyor...</div>}
      {!loading && error && <div className="notice error">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">Listelenecek ürün bulunamadı.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid products-page-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              imageUrl={product.imageUrl}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
