import { useEffect, useState } from 'react'
import api from '../../api/axios'

function formatCurrency(value) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function getAdminErrorMessage(requestError, fallbackMessage) {
  const statusCode = requestError?.response?.status

  if (statusCode === 401 || statusCode === 403) {
    return 'Admin verileri için giriş yapmanız gerekiyor.'
  }

  return requestError?.response?.data?.message || fallbackMessage
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/Orders')
        setOrders(response.data || [])
        setError('')
    } catch (requestError) {
      console.error('Admin orders request failed:', requestError)
      setError(getAdminErrorMessage(requestError, 'Siparişler getirilemedi.'))
    } finally {
      setLoading(false)
    }
    }

    loadOrders()
  }, [])

  return (
    <div className="page-section">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Admin Siparişler</h1>
          <p className="section-subtitle">Tüm siparişlerin müşteri ve tutar bilgileri.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}

      <div className="table-panel">
        {loading ? (
          <div className="loading">Siparişler yükleniyor...</div>
        ) : error ? (
          <div className="loading">Sipariş verileri şu anda gösterilemiyor.</div>
        ) : orders.length === 0 ? (
          <div className="loading">Henüz sipariş oluşturulmadı.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Müşteri</th>
                <th>Telefon</th>
                <th>Adres</th>
                <th>Adet</th>
                <th>Birim Fiyat</th>
                <th>Toplam Fiyat</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.customerAddress}</td>
                  <td>{order.quantity}</td>
                  <td>{formatCurrency(order.unitPrice)}</td>
                  <td>{formatCurrency(order.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
