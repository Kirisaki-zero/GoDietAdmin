import { useState, useEffect } from 'react';
import { Search, RefreshCw, Trash2, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { fetchReports, deleteReport, updateReportStatus, type Report } from '../api';

import './Reports.css';

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending:   { label: 'Menunggu',  className: 'status-badge pending',   icon: <Clock size={12} /> },
  resolved:  { label: 'Selesai',   className: 'status-badge resolved',  icon: <CheckCircle size={12} /> },
  rejected:  { label: 'Ditolak',   className: 'status-badge rejected',  icon: <AlertCircle size={12} /> },
};

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

const avatarColors = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#d946ef', '#06b6d4',
];

const getAvatarColor = (str: string) => avatarColors[str.charCodeAt(0) % avatarColors.length];

const formatDate = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Reports = () => {
  const [reports, setReports]       = useState<Report[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState('Semua');
  const [selected, setSelected]     = useState<Report | null>(null);
  const [deleting, setDeleting]     = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchReports();
      if (Array.isArray(data)) {
        setReports(data);
      } else {
        setError('Gagal memuat laporan dari server.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = reports.filter(r => {
    const matchTab =
      activeTab === 'Semua' ||
      (activeTab === 'Menunggu' && r.status === 'pending') ||
      (activeTab === 'Selesai'  && r.status === 'resolved') ||
      (activeTab === 'Ditolak'  && r.status === 'rejected');
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.username?.toLowerCase().includes(q) ||
      r.judul?.toLowerCase().includes(q) ||
      r.isi_laporan?.toLowerCase().includes(q) ||
      r.kategori?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus laporan ini?')) return;
    setDeleting(id);
    await deleteReport(id);
    setReports(prev => prev.filter(r => r.id_report !== id));
    if (selected?.id_report === id) setSelected(null);
    setDeleting(null);
  };

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: 'resolved' | 'rejected') => {
    setUpdatingStatus(id);
    try {
      const res = await updateReportStatus(id, newStatus);
      if (res.success) {
        setReports(prev => prev.map(r => r.id_report === id ? { ...r, status: newStatus } : r));
        if (selected?.id_report === id) {
          setSelected(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert(res.message || 'Gagal mengubah status laporan.');
      }
    } catch {
      alert('Error koneksi saat memperbarui status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const tabs = ['Semua', 'Menunggu', 'Selesai', 'Ditolak'];

  return (
    <div className="reports-page fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title mb-0">Laporan Pengguna</h1>
          <p className="text-sm text-muted">Laporan yang dikirimkan oleh pengguna aplikasi GoDiet</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="search-box">
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="Cari username, judul, isi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="refresh-btn" onClick={load} title="Refresh">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab-count">
              ({tab === 'Semua'
                ? reports.length
                : reports.filter(r =>
                    tab === 'Menunggu' ? r.status === 'pending'  :
                    tab === 'Selesai'  ? r.status === 'resolved' :
                    r.status === 'rejected'
                  ).length
              })
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="reports-layout">
        {/* Table */}
        <div className="card p-0 overflow-hidden reports-table-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Memuat laporan...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={40} className="text-danger" />
              <p>{error}</p>
              <button className="add-btn" onClick={load}>Coba Lagi</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={40} className="text-muted" />
              <p>Tidak ada laporan{search ? ' yang cocok' : ''}.</p>
            </div>
          ) : (
            <div className="px-6 py-2">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>PENGGUNA</th>
                    <th>JUDUL LAPORAN</th>
                    <th>KATEGORI</th>
                    <th>STATUS</th>
                    <th>TANGGAL</th>
                    <th style={{ width: '80px' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => {
                    const st = statusConfig[row.status] ?? { label: row.status, className: 'status-badge pending', icon: null };
                    const isActive = selected?.id_report === row.id_report;
                    return (
                      <tr
                        key={row.id_report}
                        className={`report-row ${isActive ? 'active-row' : ''}`}
                        onClick={() => setSelected(isActive ? null : row)}
                      >
                        <td className="font-bold text-muted">{idx + 1}</td>
                        <td>
                          <div className="user-info">
                            <div
                              className="avatar"
                              style={{ backgroundColor: getAvatarColor(row.username || 'A'), color: '#fff' }}
                            >
                              {getInitials(row.username || '?')}
                            </div>
                            <span className="font-medium">@{row.username}</span>
                          </div>
                        </td>
                        <td className="report-judul">{row.judul || '-'}</td>
                        <td>
                          <span className="kategori-badge">{row.kategori || 'Umum'}</span>
                        </td>
                        <td>
                          <span className={st.className}>
                            {st.icon} {st.label}
                          </span>
                        </td>
                        <td className="text-muted text-sm">{formatDate(row.created_at)}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              className="action-icon-btn view-btn"
                              title="Lihat detail"
                              onClick={e => { e.stopPropagation(); setSelected(isActive ? null : row); }}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="action-icon-btn delete-btn"
                              title="Hapus laporan"
                              disabled={deleting === row.id_report}
                              onClick={e => { e.stopPropagation(); handleDelete(row.id_report); }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="card report-detail-panel">
            <div className="detail-header">
              <div
                className="detail-avatar"
                style={{ backgroundColor: getAvatarColor(selected.username || 'A') }}
              >
                {getInitials(selected.username || '?')}
              </div>
              <div>
                <h3 className="font-bold">@{selected.username}</h3>
                <p className="text-xs text-muted">{formatDate(selected.created_at)}</p>
              </div>
              <button className="close-panel-btn" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="detail-section">
              <label>Judul Laporan</label>
              <p className="font-semibold">{selected.judul || '-'}</p>
            </div>

            <div className="detail-section">
              <label>Kategori</label>
              <span className="kategori-badge">{selected.kategori || 'Umum'}</span>
            </div>

            <div className="detail-section">
              <label>Isi Laporan</label>
              <div className="isi-laporan-box">
                {selected.isi_laporan || 'Tidak ada isi laporan.'}
              </div>
            </div>

            <div className="detail-section">
              <label>Status</label>
              <span className={(statusConfig[selected.status] ?? statusConfig['pending']).className}>
                {(statusConfig[selected.status] ?? statusConfig['pending']).icon}
                {(statusConfig[selected.status] ?? { label: selected.status }).label}
              </span>
              
              {selected.status === 'pending' && (
                <div className="detail-actions">
                  <button
                    className="resolve-btn"
                    disabled={updatingStatus === selected.id_report}
                    onClick={() => handleUpdateStatus(selected.id_report, 'resolved')}
                  >
                    <CheckCircle size={14} />
                    Selesai
                  </button>
                  <button
                    className="reject-btn"
                    disabled={updatingStatus === selected.id_report}
                    onClick={() => handleUpdateStatus(selected.id_report, 'rejected')}
                  >
                    <AlertCircle size={14} />
                    Tolak
                  </button>
                </div>
              )}
            </div>

            <button
              className="delete-full-btn"
              onClick={() => handleDelete(selected.id_report)}
              disabled={deleting === selected.id_report}
            >
              <Trash2 size={14} />
              {deleting === selected.id_report ? 'Menghapus...' : 'Hapus Laporan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
