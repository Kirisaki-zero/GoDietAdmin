import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UtensilsCrossed, Activity, BarChart2, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('admin_email') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_email');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo-container">
        <h2 className="logo-text">
          <span style={{ color: '#22c55e', fontStyle: 'italic' }}>GO</span>
          <span style={{ color: '#6b7280' }}>DIET</span>
        </h2>
        <p className="logo-sub">Admin Panel</p>
      </div>

      {/* Nav Menu */}
      <nav className="nav-menu">
        <p className="nav-section-label">UTAMA</p>
        <NavLink to="/overview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={18} />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/fitness" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={18} />
          <span>Kebugaran</span>
        </NavLink>

        <p className="nav-section-label" style={{ marginTop: '20px' }}>DATABASE</p>
        <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={18} />
          <span>Kelola User</span>
        </NavLink>

        <NavLink to="/foods" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UtensilsCrossed size={18} />
          <span>Kelola Makanan</span>
        </NavLink>
      </nav>

      {/* Bottom: Admin info + Logout */}
      <div className="bottom-menu">
        <div className="admin-info">
          <div className="admin-avatar">
            {adminEmail.charAt(0).toUpperCase()}
          </div>
          <div className="admin-email">{adminEmail}</div>
        </div>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
