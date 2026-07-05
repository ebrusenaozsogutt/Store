import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { extractRoleValue, isAdminRole } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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

    try {
      const response = await api.post('/Auth/login', formData)
      const payload = response.data || {}
      const token = payload.token || ''
      const role = extractRoleValue(payload)
      const email = payload.email || payload.user?.email || formData.email

      localStorage.setItem('token', token)
      localStorage.setItem('role', String(role))
      localStorage.setItem('email', email || formData.email)

      navigate(isAdminRole(role) ? '/admin' : '/products')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Giriş başarısız oldu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout auth-page">
      <section className="auth-showcase">
        <span className="eyebrow">Giriş</span>
        <h1 className="hero-title auth-title">Store yönetimine hızlı ve güvenli erişin.</h1>
        <p className="hero-text auth-text">
          Hesabınıza giriş yaparak admin paneline geçin, ürünleri yönetin ve sipariş
          akışını tek yerden kontrol edin.
        </p>
        <div className="auth-points">
          <div className="auth-point">
            <strong>Hızlı Erişim</strong>
            <span>Tek girişle yönetim ekranlarına ve verilere doğrudan ulaşın.</span>
          </div>
          <div className="auth-point">
            <strong>Düzenli Akış</strong>
            <span>Ürün, sipariş ve kullanıcı yönetimini tek panelde toplayın.</span>
          </div>
        </div>
      </section>

      <div className="auth-form-wrap">
        <form className="form-panel auth-card auth-form-card" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Hesabına Giriş Yap</span>
            <h2 className="page-title">Yönetim paneline devam et</h2>
            <p className="muted-text">Token ve rol bilgisi localStorage üzerine kaydedilir.</p>
          </div>

          {error && <div className="notice error">{error}</div>}

          <div className="field">
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              name="email"
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              name="password"
              required
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="button auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>

          <p className="muted-text">
            Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
