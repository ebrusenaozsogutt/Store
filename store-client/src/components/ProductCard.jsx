import { Link } from 'react-router-dom'

const PRODUCT_PLACEHOLDER_URL = 'https://placehold.co/400x300?text=%C3%9Cr%C3%BCn+G%C3%B6rseli'

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function ProductCard({ product, imageUrl }) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined
  const finalPrice = hasDiscount ? product.discountPrice : product.price
  const stockClass = product.stockQuantity > 0 ? 'pill success' : 'pill warning'
  const stockText = product.stockQuantity > 0 ? `Stok: ${product.stockQuantity}` : 'Stokta yok'
  const cardImageUrl = imageUrl || PRODUCT_PLACEHOLDER_URL

  return (
    <article className="card">
      <img
        className="product-card-image"
        src={cardImageUrl}
        alt={`${product.title} görseli`}
        onError={(event) => {
          event.currentTarget.src = PRODUCT_PLACEHOLDER_URL
        }}
      />

      <div className="card-top">
        <div>
          <h3 className="card-title">{product.title}</h3>
          <p className="muted-text">{product.description || 'Açıklama yakında eklenecek.'}</p>
        </div>
        <span className={stockClass}>{stockText}</span>
      </div>

      <div className="price-row">
        <span className="price">{formatCurrency(finalPrice)}</span>
        {hasDiscount && <span className="old-price">{formatCurrency(product.price)}</span>}
      </div>

      <div className="stack-actions">
        <Link className="button" to={`/products/${product.id}`}>
          Ürün Detayına Git
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
