import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function Checkout() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialQuantity = Math.max(1, Number(searchParams.get('quantity')) || 1)
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(`/Products/${id}`)
        setProduct(response.data)
      } catch (requestError) {
        setError('Sipariş için ürün bilgisi getirilemedi.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const finalPrice = useMemo(() => {
    if (!product) {
      return 0
    }

    return product.discountPrice ?? product.price
  }, [product])

  const totalPrice = finalPrice * quantity

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
      await api.post('/Orders', {
        productId: Number(id),
        quantity,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
      })

      setSuccessMessage('Siparişiniz başarıyla oluşturuldu.')
      setFormData({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
      })
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Sipariş oluşturulamadı.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Ödeme verileri yükleniyor...</div>
  }

  if (error && !product) {
    return <div className="notice error">{error}</div>
  }

  return (
    <div className="checkout-layout">
      <form className="form-panel" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Ödeme</span>
          <h1 className="page-title">Teslimat Bilgileri</h1>
          <p className="muted-text">
            Siparişini tamamlamak için gerekli bilgileri doldur.
          </p>
        </div>

        {error && <div className="notice error">{error}</div>}
        {successMessage && <div className="notice success">{successMessage}</div>}

        <div className="field">
          <label htmlFor="customerName">Ad Soyad</label>
          <input
            id="customerName"
            name="customerName"
            required
            value={formData.customerName}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="customerPhone">Telefon</label>
          <input
            id="customerPhone"
            name="customerPhone"
            required
            value={formData.customerPhone}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="customerAddress">Adres</label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            required
            value={formData.customerAddress}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="quantity">Adet</label>
          <input
            id="quantity"
            min="1"
            type="number"
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          />
        </div>

        <button className="button" disabled={submitting} type="submit">
          {submitting ? 'Gönderiliyor...' : 'Siparişi Tamamla'}
        </button>
      </form>

      <aside className="checkout-summary">
        <h2 className="section-title">Sipariş Özeti</h2>
        <p className="muted-text"><strong>Ürün:</strong> {product?.title}</p>
        <p className="muted-text"><strong>Birim Fiyat:</strong> {formatCurrency(finalPrice)}</p>
        <p className="muted-text"><strong>Adet:</strong> {quantity}</p>
        <p className="muted-text"><strong>Toplam:</strong> {formatCurrency(totalPrice)}</p>
      </aside>
    </div>
  )
}

export default Checkout
