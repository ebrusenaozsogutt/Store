import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

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
      const { token, role, email } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('role', role || '')
      localStorage.setItem('email', email || formData.email)

      navigate('/admin')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Giriş başarısız oldu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout">
      <form className="form-panel auth-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Giriş</span>
          <h1 className="page-title">Hesabına Giriş Yap</h1>
          <p className="muted-text">
            Token ve rol bilgisi localStorage'a kaydedilir.
          </p>
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

        <button className="button" disabled={submitting} type="submit">
          {submitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>

        <p className="muted-text">
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
