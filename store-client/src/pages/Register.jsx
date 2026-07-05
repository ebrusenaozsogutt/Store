import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
      const response = await api.post('/Auth/register', formData)
      setSuccessMessage(response.data?.message || 'Kayıt başarıyla tamamlandı.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Kayıt işlemi başarısız oldu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout auth-page">
      <section className="auth-showcase">
        <span className="eyebrow">Üyelik</span>
        <h1 className="hero-title auth-title">Dakikalar içinde hesabını oluştur.</h1>
        <p className="hero-text auth-text">
          Kayıt ol, ürünleri incele, sipariş oluştur ve mağaza deneyimini kesintisiz
          şekilde kullanmaya başla.
        </p>
        <div className="auth-points">
          <div className="auth-point">
            <strong>Kolay Başlangıç</strong>
            <span>Kısa form ile hesabını oluştur ve doğrudan giriş akışına geç.</span>
          </div>
          <div className="auth-point">
            <strong>Hazır Altyapı</strong>
            <span>Üyelikten siparişe kadar çalışan akışlar tek vitrinde hazır olsun.</span>
          </div>
        </div>
      </section>

      <div className="auth-form-wrap">
        <form className="form-panel auth-card auth-form-card" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">Yeni Üyelik</span>
            <h2 className="page-title">Yeni hesap oluştur</h2>
            <p className="muted-text">
              Dakikalar içinde kayıt ol, ürünleri incele ve sipariş vermeye başla.
            </p>
          </div>

          {error && <div className="notice error">{error}</div>}
          {successMessage && <div className="notice success">{successMessage}</div>}

          <div className="field">
            <label htmlFor="fullName">Ad Soyad</label>
            <input
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

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
            {submitting ? 'Kayıt Oluşturuluyor...' : 'Kayıt Ol'}
          </button>

          <p className="muted-text">
            Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
