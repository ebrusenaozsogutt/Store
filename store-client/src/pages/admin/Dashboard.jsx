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

function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    productCount: 0,
    orderCount: 0,
    userCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsResult, ordersResult, usersResult, revenueResult] = await Promise.allSettled([
          api.get('/Products'),
          api.get('/Orders'),
          api.get('/Users'),
          api.get('/Orders/revenue'),
        ])

        const nextStats = {
          revenue: revenueResult.status === 'fulfilled' ? revenueResult.value.data || 0 : 0,
          productCount: productsResult.status === 'fulfilled' ? productsResult.value.data?.length || 0 : 0,
          orderCount: ordersResult.status === 'fulfilled' ? ordersResult.value.data?.length || 0 : 0,
          userCount: usersResult.status === 'fulfilled' ? usersResult.value.data?.length || 0 : 0,
        }

        const failedResults = [productsResult, ordersResult, usersResult, revenueResult].filter(
          (result) => result.status === 'rejected',
        )

        failedResults.forEach((result) => {
          console.error('Dashboard request failed:', result.reason)
        })

        if (failedResults.length > 0) {
          const authFailure = failedResults.find((result) => {
            const statusCode = result.reason?.response?.status
            return statusCode === 401 || statusCode === 403
          })

          if (authFailure) {
            setError('Admin verileri için giriş yapmanız gerekiyor.')
          } else {
            setError('Dashboard verileri getirilemedi.')
          }
        } else {
          setError('')
          setStats(nextStats)
        }
      } catch (requestError) {
        console.error('Dashboard load failed:', requestError)
        setError(getAdminErrorMessage(requestError, 'Dashboard verileri getirilemedi.'))
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="page-section admin-page dashboard-page">
      <div className="admin-panel-header">
        <div>
          <h1 className="page-title">Gösterge Paneli</h1>
          <p className="section-subtitle">Sistem özetlerini tek ekranda takip edin.</p>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}
      {loading ? (
        <div className="loading">Dashboard yükleniyor...</div>
      ) : error ? (
        <div className="loading">Dashboard verileri şu anda gösterilemiyor.</div>
      ) : (
        <div className="stats-grid dashboard-stats-grid">
          <article className="stat-card dashboard-stat-card">
            <span className="stat-label">Toplam Gelir</span>
            <strong className="stat-value">{formatCurrency(stats.revenue)}</strong>
          </article>
          <article className="stat-card dashboard-stat-card">
            <span className="stat-label">Toplam Ürün</span>
            <strong className="stat-value">{stats.productCount}</strong>
          </article>
          <article className="stat-card dashboard-stat-card">
            <span className="stat-label">Toplam Sipariş</span>
            <strong className="stat-value">{stats.orderCount}</strong>
          </article>
          <article className="stat-card dashboard-stat-card">
            <span className="stat-label">Toplam Kullanıcı</span>
            <strong className="stat-value">{stats.userCount}</strong>
          </article>
        </div>
      )}
    </div>
  )
}

export default Dashboard
