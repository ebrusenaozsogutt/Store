import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const PRODUCT_PLACEHOLDER_URL = 'https://placehold.co/400x300?text=%C3%9Cr%C3%BCn+G%C3%B6rseli'

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function findProductImage(productImages) {
  const coverImage = productImages.find((image) => image.isCover)
  return coverImage || productImages[0] || null
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [productImages, setProductImages] = useState([])
  const [selectedImageUrl, setSelectedImageUrl] = useState(PRODUCT_PLACEHOLDER_URL)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [productResponse, productImagesResponse] = await Promise.all([
          api.get(`/Products/${id}`),
          api.get('/ProductImages'),
        ])

        const nextProduct = productResponse.data
        const allImages = productImagesResponse.data || []
        const relatedImages = allImages.filter((image) => Number(image.productId) === Number(id))
        const selectedImage = findProductImage(relatedImages)

        setProduct(nextProduct)
        setProductImages(relatedImages)
        setSelectedImageUrl(selectedImage?.imageUrl || PRODUCT_PLACEHOLDER_URL)
      } catch (requestError) {
        console.error('Product detail request failed:', requestError)
        setError('Ürün detayı getirilemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleBuyNow = () => {
    navigate(`/checkout/${id}?quantity=${quantity}`)
  }

  if (loading) {
    return <div className="loading">Ürün yükleniyor...</div>
  }

  if (error || !product) {
    return <div className="notice error">{error || 'Ürün bulunamadı.'}</div>
  }

  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined
  const finalPrice = hasDiscount ? product.discountPrice : product.price

  return (
    <div className="product-detail-layout">
      <section className="product-detail">
        <div className="product-detail-media">
          <img
            className="product-main-image"
            src={selectedImageUrl}
            alt={`${product.title} görseli`}
            onError={(event) => {
              event.currentTarget.src = PRODUCT_PLACEHOLDER_URL
            }}
          />

          {productImages.length > 0 ? (
            <div className="product-gallery">
              {productImages.map((image) => (
                <button
                  key={image.id}
                  className={`gallery-thumb${selectedImageUrl === image.imageUrl ? ' active' : ''}`}
                  type="button"
                  onClick={() => setSelectedImageUrl(image.imageUrl || PRODUCT_PLACEHOLDER_URL)}
                >
                  <img
                    src={image.imageUrl || PRODUCT_PLACEHOLDER_URL}
                    alt={`${product.title} küçük görseli`}
                    onError={(event) => {
                      event.currentTarget.src = PRODUCT_PLACEHOLDER_URL
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="muted-text">Ürün görseli bulunamadı.</div>
          )}
        </div>

        <span className="eyebrow">Ürün Detayı</span>
        <h1 className="page-title">{product.title}</h1>
        <p className="muted-text">{product.description || 'Bu ürün için açıklama eklenmemiş.'}</p>

        <div className="price-row">
          <span className="price">{formatCurrency(finalPrice)}</span>
          {hasDiscount && <span className="old-price">{formatCurrency(product.price)}</span>}
        </div>

        <div className="inline-actions">
          <span className={product.stockQuantity > 0 ? 'pill success' : 'pill warning'}>
            Stok: {product.stockQuantity}
          </span>
        </div>

        <div className="quantity-box">
          <label htmlFor="quantity">Adet</label>
          <input
            id="quantity"
            min="1"
            max={Math.max(product.stockQuantity, 1)}
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          />
        </div>

        <div className="hero-actions">
          <button
            className="button"
            type="button"
            onClick={handleBuyNow}
            disabled={product.stockQuantity <= 0}
          >
            Satın Al
          </button>
        </div>
      </section>

      <aside className="checkout-summary">
        <h2 className="section-title">Sipariş Özetin</h2>
        <p className="muted-text">
          Seçilen adet: <strong>{quantity}</strong>
        </p>
        <p className="muted-text">
          Birim fiyat: <strong>{formatCurrency(finalPrice)}</strong>
        </p>
        <p className="muted-text">
          Tahmini toplam: <strong>{formatCurrency(finalPrice * quantity)}</strong>
        </p>
      </aside>
    </div>
  )
}

export default ProductDetail
