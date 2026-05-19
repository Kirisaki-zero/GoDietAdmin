import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container" style={{ padding: '24px 24px 40px' }}>
        <h2 className="logo-text" style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <img src="/icons.svg" alt="logo" style={{ width: '32px', height: '32px', display: 'none' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span style={{ fontStyle: 'italic' }}>GO</span><span style={{ color: '#6b7280' }}>DIET</span>
        </h2>
      </div>

      <nav className="nav-menu">
        <NavLink to="/overview" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Plus size={18} />
          <span>Overview</span>
        </NavLink>
        
        <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Plus size={18} />
          <span>Reports</span>
        </NavLink>
        
        <NavLink to="/fitness" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Plus size={18} />
          <span>Kebugaran</span>
        </NavLink>
      </nav>

      <div className="bottom-menu">
        <div className="nav-item">
          <Plus size={18} />
          <span>Account</span>
        </div>
        <div className="nav-item">
          <Plus size={18} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
