import { Link, NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link className="brand" to="/">
          <span className="brand-badge">S</span>
          <span>Store</span>
        </Link>

        <nav className="nav-links">
          <NavLink className="nav-link" to="/">
            Ana Sayfa
          </NavLink>
          <NavLink className="nav-link" to="/products">
            Ürünler
          </NavLink>
          {token && (
            <NavLink className="nav-link" to="/admin">
              Admin Panel
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {!token ? (
            <>
              <NavLink className="button-ghost" to="/login">
                Giriş
              </NavLink>
              <NavLink className="button" to="/register">
                Kayıt Ol
              </NavLink>
            </>
          ) : (
            <button className="button-secondary" type="button" onClick={handleLogout}>
              Çıkış Yap
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
