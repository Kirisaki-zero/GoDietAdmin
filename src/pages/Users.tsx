import { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, type User } from '../api';
import { Search, Trash2, X, Users as UsersIcon, User as UserIcon, Scale, Activity } from 'lucide-react';
import './Users.css';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchUsers();
    if (data.success) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    (u.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (user: User) => {
    if (!confirm(`Hapus akun "${user.email}"?\n\nSemua data user ini (profil, history, bookmark) akan ikut terhapus secara permanen!`)) return;
    const res = await deleteUser(user.id_user);
    if (res.success) {
      setMsg({ type: 'ok', text: `Akun "${user.email}" berhasil dihapus.` });
      setDetailUser(null);
      load();
    } else {
      setMsg({ type: 'err', text: res.message || 'Gagal menghapus user.' });
    }
  };

  // Hitung BMI
  const getBMI = (u: User) => {
    if (!u.berat_badan || !u.tinggi_badan) return null;
    const h = u.tinggi_badan / 100;
    return (u.berat_badan / (h * h)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#f59e0b' };
    if (bmi <= 24.9) return { label: 'Normal', color: '#22c55e' };
    if (bmi <= 29.9) return { label: 'Overweight', color: '#f97316' };
    return { label: 'Obesitas', color: '#ef4444' };
  };

  const getInitials = (nama: string, email: string) => {
    if (nama) return nama.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return email[0].toUpperCase();
  };

  const AVATAR_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const getAvatarColor = (email: string) => AVATAR_COLORS[email.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div className="users-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola User</h1>
          <p className="page-sub">Pantau dan kelola semua pengguna terdaftar di aplikasi GoDiet</p>
        </div>
        <div className="header-stat-chips">
          <div className="stat-chip-lg">
            <UsersIcon size={16} />
            <span>Total: <strong>{users.length}</strong> user</span>
          </div>
        </div>
      </div>

      {/* Flash message */}
      {msg && (
        <div className={`flash-msg ${msg.type}`}>
          {msg.text}
          <button onClick={() => setMsg(null)}><X size={14} /></button>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Cari nama atau email user..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state">
          <UsersIcon size={40} />
          <p>Memuat data pengguna...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <UsersIcon size={48} />
          <p>{users.length === 0 ? 'Belum ada pengguna terdaftar.' : 'Tidak ada user yang cocok dengan pencarian.'}</p>
        </div>
      ) : (
        <div className="users-grid">
          {filtered.map(user => {
            const bmi = getBMI(user);
            const bmiStatus = bmi ? getBMIStatus(Number(bmi)) : null;
            return (
              <div key={user.id_user} className="user-card" onClick={() => setDetailUser(user)}>
                <div className="user-card-top">
                  <div className="user-avatar" style={{ background: getAvatarColor(user.email) }}>
                    {getInitials(user.nama, user.email)}
                  </div>
                  <div className="user-info">
                    <h4 className="user-name">{user.nama || '(Belum diisi)'}</h4>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <button
                    className="btn-icon delete"
                    onClick={e => { e.stopPropagation(); handleDelete(user); }}
                    title="Hapus user"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="user-card-stats">
                  <div className="mini-stat">
                    <span className="mini-label">BB</span>
                    <span className="mini-val">{user.berat_badan ? `${user.berat_badan} kg` : '—'}</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-label">TB</span>
                    <span className="mini-val">{user.tinggi_badan ? `${user.tinggi_badan} cm` : '—'}</span>
                  </div>
                  <div className="mini-stat">
                    <span className="mini-label">Usia</span>
                    <span className="mini-val">{user.usia ? `${user.usia} th` : '—'}</span>
                  </div>
                  {bmi && bmiStatus && (
                    <div className="mini-stat">
                      <span className="mini-label">BMI</span>
                      <span className="mini-val" style={{ color: bmiStatus.color, fontWeight: 700 }}>{bmi}</span>
                    </div>
                  )}
                </div>

                {bmiStatus && (
                  <div className="bmi-badge" style={{ backgroundColor: bmiStatus.color + '20', color: bmiStatus.color }}>
                    {bmiStatus.label}
                  </div>
                )}

                <div className="user-aktivitas">
                  <Activity size={12} />
                  <span>{user.tingkat_aktivitas || 'Aktivitas belum diisi'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {detailUser && (
        <div className="modal-overlay" onClick={() => setDetailUser(null)}>
          <div className="modal-card detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Pengguna</h3>
              <button className="btn-icon" onClick={() => setDetailUser(null)}><X size={18} /></button>
            </div>

            <div className="detail-body">
              {/* Avatar */}
              <div className="detail-avatar-section">
                <div className="detail-avatar" style={{ background: getAvatarColor(detailUser.email) }}>
                  {getInitials(detailUser.nama, detailUser.email)}
                </div>
                <h2 className="detail-name">{detailUser.nama || '(Nama belum diisi)'}</h2>
                <p className="detail-email">{detailUser.email}</p>
                <span className="role-badge">Pengguna</span>
              </div>

              {/* Stats Grid */}
              <div className="detail-grid">
                <div className="detail-stat">
                  <Scale size={20} className="detail-icon" />
                  <span className="detail-label">Berat Badan</span>
                  <span className="detail-value">{detailUser.berat_badan ? `${detailUser.berat_badan} kg` : '—'}</span>
                </div>
                <div className="detail-stat">
                  <UserIcon size={20} className="detail-icon" />
                  <span className="detail-label">Tinggi Badan</span>
                  <span className="detail-value">{detailUser.tinggi_badan ? `${detailUser.tinggi_badan} cm` : '—'}</span>
                </div>
                <div className="detail-stat">
                  <UserIcon size={20} className="detail-icon" />
                  <span className="detail-label">Usia</span>
                  <span className="detail-value">{detailUser.usia ? `${detailUser.usia} tahun` : '—'}</span>
                </div>
                <div className="detail-stat">
                  <UserIcon size={20} className="detail-icon" />
                  <span className="detail-label">Jenis Kelamin</span>
                  <span className="detail-value">{detailUser.jenis_kelamin || '—'}</span>
                </div>
              </div>

              {/* BMI Section */}
              {(() => {
                const bmi = getBMI(detailUser);
                const bmiStatus = bmi ? getBMIStatus(Number(bmi)) : null;
                return bmi && bmiStatus ? (
                  <div className="detail-bmi" style={{ borderColor: bmiStatus.color + '40', backgroundColor: bmiStatus.color + '10' }}>
                    <div className="bmi-number" style={{ color: bmiStatus.color }}>{bmi}</div>
                    <div>
                      <div className="bmi-label">Indeks Massa Tubuh (BMI)</div>
                      <div className="bmi-status" style={{ color: bmiStatus.color }}>{bmiStatus.label}</div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Aktivitas */}
              <div className="detail-aktivitas">
                <Activity size={14} />
                <span>Tingkat Aktivitas: <strong>{detailUser.tingkat_aktivitas || 'Belum diisi'}</strong></span>
              </div>

              {/* User ID */}
              <div className="detail-id">ID: {detailUser.id_user}</div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDetailUser(null)}>Tutup</button>
              <button className="btn-danger" onClick={() => handleDelete(detailUser)}>
                <Trash2 size={15} /> Hapus Akun Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
