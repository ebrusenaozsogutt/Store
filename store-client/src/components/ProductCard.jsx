import { Link } from 'react-router-dom'

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function ProductCard({ product }) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined
  const finalPrice = hasDiscount ? product.discountPrice : product.price
  const stockClass = product.stockQuantity > 0 ? 'pill success' : 'pill warning'
  const stockText = product.stockQuantity > 0 ? `Stok: ${product.stockQuantity}` : 'Stokta yok'

  return (
    <article className="card">
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

      <div className="inline-actions">
        <span className="pill">Kategori ID: {product.categoryId}</span>
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
