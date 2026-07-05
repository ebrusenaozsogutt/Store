import { NavLink, Outlet, useNavigate } from 'react-router-dom'

function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="eyebrow">Admin Panel</span>
          <h2 style={{ margin: 0 }}>Store Yönetimi</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)' }}>
            Ürün, kategori, sipariş ve kullanıcı işlemlerini yönetin.
          </p>
        </div>

        <nav>
          <NavLink className="admin-link" end to="/admin">
            Gösterge Paneli
          </NavLink>
          <NavLink className="admin-link" to="/admin/products">
            Ürünler
          </NavLink>
          <NavLink className="admin-link" to="/admin/categories">
            Kategoriler
          </NavLink>
          <NavLink className="admin-link" to="/admin/orders">
            Siparişler
          </NavLink>
          <NavLink className="admin-link" to="/admin/users">
            Üyeler
          </NavLink>
          <NavLink className="admin-link" to="/">
            Ana Sayfa
          </NavLink>
        </nav>

        <button className="button-secondary" type="button" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  )
}

export default AdminLayout
