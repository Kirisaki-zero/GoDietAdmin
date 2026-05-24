import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, Target, Activity, Zap, Search, Flame, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchFitnessData } from '../api';
import './Fitness.css';

// ── Types ─────────────────────────────────────────────────────────────────
interface FitnessUser {
  id: string;
  id_user: string;
  name: string;
  initials: string;
  program: string;
  bmi: number | null;
  compliance: number;
  streak: number;
  status: 'OK' | 'Warn' | 'Off';
  lastWorkout: string;
  totalKalori: number;
}

interface FitnessData {
  totalUserFitness: number;
  countOK: number;
  countWarn: number;
  countOff: number;
  avgCompliance: number;
  weeklySessionsData: Array<{ name: string; sessions: number }>;
  complianceTrendData: Array<{ name: string; rate: number }>;
  fitnessUsers: FitnessUser[];
}

const DEFAULT_DATA: FitnessData = {
  totalUserFitness: 0, countOK: 0, countWarn: 0, countOff: 0, avgCompliance: 0,
  weeklySessionsData: [], complianceTrendData: [], fitnessUsers: [],
};

// ── Helper UI ──────────────────────────────────────────────────────────────
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'OK':   return <span className="status-badge status-ok">  <span className="status-dot success"></span> OK</span>;
    case 'Warn': return <span className="status-badge status-warn"><span className="status-dot warning"></span> Warn</span>;
    case 'Off':  return <span className="status-badge status-off"> <span className="status-dot danger"></span>  Off</span>;
    default:     return null;
  }
};

const getComplianceColor = (val: number) => {
  if (val >= 80) return 'var(--color-success)';
  if (val >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

const getBmiColor = (bmi: number | null) => {
  if (bmi === null)              return 'var(--color-text-muted)';
  if (bmi < 18.5)               return 'var(--color-warning)';
  if (bmi >= 18.5 && bmi < 25)  return 'var(--color-success)';
  return 'var(--color-danger)';
};

function getAvatarColor(name: string): string {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Komponen utama ─────────────────────────────────────────────────────────
const Fitness = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchTerm,   setSearchTerm]   = useState('');
  const [data,  setData]    = useState<FitnessData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await fetchFitnessData();
      if (res.success) {
        setData({ ...DEFAULT_DATA, ...res });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Filter berdasarkan tab + pencarian
  const displayedUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return data.fitnessUsers.filter(user => {
      const matchSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.program.toLowerCase().includes(q);

      const matchTab =
        activeFilter === 'Semua'            ||
        (activeFilter === 'On Track'        && user.status === 'OK')   ||
        (activeFilter === 'Perlu Perhatian' && user.status === 'Warn') ||
        (activeFilter === 'Tidak Aktif'     && user.status === 'Off');

      return matchSearch && matchTab;
    });
  }, [activeFilter, searchTerm, data.fitnessUsers]);

  const filterTabs = [
    { label: 'Semua',           badge: null },
    { label: 'On Track',        badge: null },
    { label: 'Perlu Perhatian', badge: data.countWarn > 0 ? { count: data.countWarn, cls: 'warning' } : null },
    { label: 'Tidak Aktif',     badge: data.countOff  > 0 ? { count: data.countOff,  cls: 'danger'  } : null },
  ];

  const avgWeeklySessions = data.weeklySessionsData.length > 0
    ? Math.round(data.weeklySessionsData.reduce((s, d) => s + d.sessions, 0) / data.weeklySessionsData.length)
    : 0;

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fitness-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column' }}>
        <div className="loading-spinner" />
        <p className="chart-subtitle" style={{ marginTop: 16 }}>Memuat data kebugaran...</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="fitness-page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
        <AlertTriangle size={40} color="#ef4444" />
        <p style={{ color: '#ef4444', fontWeight: 600 }}>Gagal memuat data kebugaran</p>
        <button onClick={loadData} className="btn-retry">🔄 Coba Lagi</button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="fitness-page fade-in">
      <h1 className="page-title">Kebugaran</h1>

      {/* ── StatCard ─── */}
      <div className="grid-stats">
        <StatCard
          title="Total User Fitness"
          value={String(data.totalUserFitness)}
          subtitle="Terdaftar"
          subtitleColor="success"
          icon={<Users size={20} />}
          iconBgColor="#dcfce7" iconColor="#22c55e"
        />
        <StatCard
          title="On Track"
          value={String(data.countOK)}
          subtitle={data.totalUserFitness > 0 ? `${Math.round((data.countOK / data.totalUserFitness) * 100)}% optimal` : '0% optimal'}
          subtitleColor="success"
          icon={<Target size={20} />}
          iconBgColor="#e0e7ff" iconColor="#3b82f6"
        />
        <StatCard
          title="Perlu Perhatian"
          value={String(data.countWarn)}
          subtitle="Butuh follow-up"
          subtitleColor="warning"
          icon={<Activity size={20} />}
          iconBgColor="#ffedd5" iconColor="#f97316"
        />
        <StatCard
          title="Avg Compliance"
          value={`${data.avgCompliance}%`}
          subtitle={data.avgCompliance >= 70 ? '↗ Performa bagus' : '↘ Perlu ditingkatkan'}
          subtitleColor="info"
          icon={<Zap size={20} />}
          iconBgColor="#fae8ff" iconColor="#d946ef"
        />
      </div>

      {/* ── Grafik ─── */}
      <div className="grid-charts mt-6">
        {/* Bar chart sesi mingguan */}
        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Workout Sessions Mingguan</h3>
              <p className="chart-subtitle">Total sessions per hari (7 hari terakhir)</p>
            </div>
            <div className="badge badge-success">Avg {avgWeeklySessions}</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklySessionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="sessions" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area chart compliance trend */}
        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Compliance Rate Trend</h3>
              <p className="chart-subtitle">Rata-rata kepatuhan user per minggu</p>
            </div>
            <div className="badge badge-info" style={{ backgroundColor: '#e0e7ff', color: '#3b82f6' }}>
              {data.avgCompliance}%
            </div>
          </div>
          <div className="chart-container">
            {data.complianceTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.complianceTrendData}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: unknown) => [`${v}%`, 'Compliance']} />
                  <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompliance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p className="chart-subtitle">Belum ada data (workout belum ter-sync)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabel dengan filter & search ─── */}
      <div className="card mt-6 p-0 overflow-hidden">
        {/* Header tabel */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          {/* Tab filter */}
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
            {filterTabs.map(({ label, badge }) => (
              <button
                key={label}
                className={`table-filter-btn ${activeFilter === label ? 'active' : ''}`}
                onClick={() => setActiveFilter(label)}
              >
                {label}
                {badge && badge.count > 0 && (
                  <span className={`filter-count ${badge.cls}`}>{badge.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Pencarian */}
          <div className="search-box-small">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Cari user atau program..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="px-6 py-2">
          <table className="data-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>PROGRAM</th>
                <th>BMI</th>
                <th>COMPLIANCE</th>
                <th>STREAK</th>
                <th>STATUS</th>
                <th>LAST WORKOUT</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    {data.fitnessUsers.length === 0 ? 'Belum ada user terdaftar.' : 'Tidak ada data yang cocok.'}
                  </td>
                </tr>
              ) : (
                displayedUsers.map(user => (
                  <tr key={user.id_user}>
                    {/* User */}
                    <td>
                      <div className="user-info">
                        <div
                          className="avatar"
                          style={{ backgroundColor: getAvatarColor(user.name) }}
                        >
                          {user.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name}</span>
                          {user.totalKalori > 0 && (
                            <span className="text-xs text-muted font-medium">
                              🔥 {user.totalKalori.toLocaleString('id-ID')} kcal/30 hari
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Program */}
                    <td className="font-medium text-sm">{user.program}</td>
                    {/* BMI */}
                    <td className="font-bold text-sm" style={{ color: getBmiColor(user.bmi) }}>
                      {user.bmi !== null ? user.bmi : '—'}
                    </td>
                    {/* Compliance */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="progress-bar-container" style={{ width: '60px', marginTop: 0 }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${user.compliance}%`, backgroundColor: getComplianceColor(user.compliance) }}
                          />
                        </div>
                        <span className="font-bold text-sm">{user.compliance}%</span>
                      </div>
                    </td>
                    {/* Streak */}
                    <td>
                      <div
                        className="flex items-center gap-1 font-semibold text-sm"
                        style={{ color: user.streak > 0 ? '#f97316' : '#9ca3af' }}
                      >
                        <Flame size={14} /> {user.streak}d
                      </div>
                    </td>
                    {/* Status */}
                    <td>{getStatusBadge(user.status)}</td>
                    {/* Last Workout */}
                    <td className="text-sm font-medium text-muted">{user.lastWorkout}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fitness;
