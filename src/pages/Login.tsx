import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginAdmin(email, password);

      if (!data.success) {
        setError(data.message || 'Email atau password salah.');
        return;
      }

      if (data.user.role !== 'admin') {
        setError('Akun ini bukan akun admin. Akses ditolak.');
        return;
      }

      // Simpan sesi admin ke localStorage
      localStorage.setItem('admin_id', data.user.id_user);
      localStorage.setItem('admin_email', data.user.email);

      navigate('/overview');
    } catch {
      setError('Tidak bisa terhubung ke server. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🥗</div>
          <h1 className="login-title">GoDiet Admin</h1>
          <p className="login-subtitle">Panel Manajemen Database & AI</p>
        </div>

        {/* Error */}
        {error && <div className="login-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Admin</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@godiet.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <p className="login-note">
          Hanya akun dengan role <strong>admin</strong> yang dapat mengakses panel ini.
        </p>
      </div>
    </div>
  );
}
