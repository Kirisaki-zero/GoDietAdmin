import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, Activity, Target, UserPlus, Scale, Flame, RefreshCcw, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchStats } from '../api';
import './Overview.css';

// ── Types ────────────────────────────────────────────────────────────────
type UserStatus = 'On Track' | 'Perlu Perhatian' | 'Tidak Aktif';
type NotifType  = 'warning' | 'success' | 'info';

interface UserFitnessItem {
  id: string;
  id_user: string;
  name: string;
  initials: string;
  program: string;
  streak: string;
  status: UserStatus;
}

interface NotificationItem {
  type: NotifType;
  text: string;
  label: string;
}

interface StatsData {
  totalUsers: number;
  totalFoods: number;
  newUsersThisMonth: number;
  avgBmi: number;
  userGrowth: Array<{ name: string; users: number }>;
  weeklyWorkouts: Array<{ name: string; sessions: number }>;
  dietDistribution: Array<{ name: string; value: number }>;
  complianceData: Array<{ name: string; rate: number }>;
  todayWorkouts: number;
  weeklyCaloriesBurned: number;
  userFitnessOverview: UserFitnessItem[];
  notifications: NotificationItem[];
}

// ── Constants ─────────────────────────────────────────────────────────────
const PROGRAM_COLORS: Record<string, string> = {
  'Fat Loss':    '#22c55e',
  'Muscle Gain': '#3b82f6',
  'Maintenance': '#f59e0b',
  'Health':      '#8b5cf6',
};

const DEFAULT_STATS: StatsData = {
  totalUsers: 0, totalFoods: 0, newUsersThisMonth: 0, avgBmi: 0,
  userGrowth: [], weeklyWorkouts: [], dietDistribution: [], complianceData: [],
  todayWorkouts: 0, weeklyCaloriesBurned: 0,
  userFitnessOverview: [], notifications: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────
function getAvatarColor(name: string): string {
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatCalories(cal: number): string {
  if (cal >= 1_000_000) return `${(cal / 1_000_000).toFixed(1)}M`;
  if (cal >= 1_000)     return `${(cal / 1_000).toFixed(1)}K`;
  return cal.toString();
}

function getBmiLabel(bmi: number): string {
  if (bmi === 0)    return 'Belum ada data';
  if (bmi < 18.5)   return 'Underweight';
  if (bmi < 25)     return 'Normal';
  if (bmi < 30)     return 'Overweight';
  return 'Obesitas';
}

// ── Component ─────────────────────────────────────────────────────────────
const Overview = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchStats();
      if (data.success) {
        setStats({ ...DEFAULT_STATS, ...data });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  // ── Derived ──────────────────────────────────────────────────────────
  const programData = stats.dietDistribution.map(d => ({
    name: d.name,
    value: Number(d.value),
    color: PROGRAM_COLORS[d.name] || '#9ca3af',
  }));
  const totalDietUsers = programData.reduce((s, d) => s + d.value, 0);

  const filteredPerformers = stats.userFitnessOverview.filter(p => {
    if (activeFilter === 'Semua') return true;
    return p.status === activeFilter;
  });

  const avgWeeklySessions = stats.weeklyWorkouts.length > 0
    ? Math.round(stats.weeklyWorkouts.reduce((s, d) => s + d.sessions, 0) / stats.weeklyWorkouts.length)
    : 0;

  const avgCompliance = stats.complianceData.length > 0
    ? Math.round(stats.complianceData.reduce((s, d) => s + d.rate, 0) / stats.complianceData.length)
    : 0;

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="overview-page fade-in" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column' }}>
        <div className="loading-spinner" />
        <p className="chart-subtitle" style={{ marginTop: 16 }}>Memuat data dashboard...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="overview-page fade-in" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12 }}>
        <AlertTriangle size={40} color="#ef4444" />
        <p style={{ color: '#ef4444', fontWeight: 600 }}>Gagal memuat data dari server</p>
        <button onClick={loadStats} className="btn-retry">🔄 Coba Lagi</button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="overview-page fade-in">
      <h1 className="page-title">Dashboard Admin</h1>

      {/* Top Stats */}
      <div className="grid-stats">
        <StatCard
          title="Total Users" value={stats.totalUsers.toLocaleString('id-ID')}
          subtitle={`↗ +${stats.newUsersThisMonth} bulan ini`}
          icon={<Users size={20} />} iconBgColor="#dcfce7" iconColor="#22c55e"
        />
        <StatCard
          title="Makanan Database" value={stats.totalFoods.toLocaleString('id-ID')}
          subtitle="Total resep tersedia" subtitleColor="info"
          icon={<UserPlus size={20} />} iconBgColor="#e0e7ff" iconColor="#3b82f6"
        />
        <StatCard
          title="Workout Hari Ini" value={stats.todayWorkouts.toString()}
          subtitle="Sesi tercatat hari ini" subtitleColor="warning"
          icon={<Activity size={20} />} iconBgColor="#fae8ff" iconColor="#d946ef"
        />
        <StatCard
          title="Avg BMI Platform"
          value={stats.avgBmi > 0 ? <>{stats.avgBmi} <span className="text-sm font-normal" style={{color:'var(--color-text-muted)'}}>kg/m²</span></> : '-'}
          subtitle={getBmiLabel(stats.avgBmi)} subtitleColor="info"
          icon={<Scale size={20} />} iconBgColor="#ffedd5" iconColor="#f97316"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid-charts">
        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Pertumbuhan User</h3>
              <p className="chart-subtitle">7 bulan terakhir</p>
            </div>
            <div className="badge badge-success">
              {stats.userGrowth.length > 0 ? `${stats.userGrowth[stats.userGrowth.length - 1].users} user` : '0 user'}
            </div>
          </div>
          <div className="chart-container">
            {stats.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.userGrowth}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p className="chart-subtitle">Belum ada data pertumbuhan user</p>
              </div>
            )}
          </div>
        </div>

        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">User Aktif Mingguan</h3>
              <p className="chart-subtitle">Sesi workout per hari (7 hari terakhir)</p>
            </div>
            <div className="badge badge-success">Avg {avgWeeklySessions}</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyWorkouts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="sessions" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-charts">
        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Distribusi Program Diet</h3>
              <p className="chart-subtitle">Berdasarkan tujuan yang diikuti</p>
            </div>
            <div className="badge badge-info">Total {stats.totalUsers.toLocaleString('id-ID')}</div>
          </div>
          {totalDietUsers > 0 ? (
            <div className="flex w-full items-center">
              <div className="pie-container relative" style={{width: '40%', height: '200px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={programData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {programData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-text">
                  <Users size={24} className="text-muted" />
                </div>
              </div>
              <div className="legend-container flex-1 pl-4">
                {programData.map(item => (
                  <div key={item.name} className="legend-item flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="status-dot" style={{backgroundColor: item.color}}></span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm font-bold">
                      {totalDietUsers > 0 ? Math.round(item.value / totalDietUsers * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-chart">
              <p className="chart-subtitle">Belum ada data distribusi tujuan</p>
            </div>
          )}
        </div>

        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Tingkat Kepatuhan Fitness</h3>
              <p className="chart-subtitle">Compliance user per minggu</p>
            </div>
            <div className="badge badge-info" style={{backgroundColor: '#e0e7ff', color: '#3b82f6'}}>
              Avg {avgCompliance}%
            </div>
          </div>
          <div className="chart-container">
            {stats.complianceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.complianceData}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCompliance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                <p className="chart-subtitle">Belum ada data compliance (workout belum ter-sync)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performers and Notifications */}
      <div className="grid-2-1 mt-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Pantauan Kebugaran User</h3>
            <div className="filter-tabs flex items-center gap-2 p-1 bg-gray-100 rounded-full">
              {(['Semua', 'On Track', 'Perlu Perhatian', 'Tidak Aktif'] as string[]).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${activeFilter === filter ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="performers-list">
            {filteredPerformers.length > 0 ? filteredPerformers.map(p => (
              <div key={p.id_user} className="performer-item flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-muted text-sm font-medium w-6">{p.id}</span>
                  <div className="avatar" style={{ backgroundColor: getAvatarColor(p.name) }}>{p.initials}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{p.name}</h4>
                    <p className="text-xs text-muted">{p.program}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1 text-warning font-semibold text-sm">
                    <Flame size={14} /> {p.streak}
                  </div>
                  <span className={`text-xs font-semibold ${p.status === 'On Track' ? 'text-success' : p.status === 'Perlu Perhatian' ? 'text-warning' : 'text-danger'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            )) : (
              <p className="chart-subtitle" style={{ padding: '16px 0', textAlign: 'center' }}>
                {activeFilter === 'Semua'
                  ? 'Belum ada data user'
                  : `Tidak ada user dengan status "${activeFilter}"`}
              </p>
            )}
          </div>
        </div>

        <div className="card notification-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Notifikasi Terbaru</h3>
            {stats.notifications.length > 0 && (
              <span className="notif-badge">{stats.notifications.length} baru</span>
            )}
          </div>
          <div className="notifications-list">
            {stats.notifications.length > 0 ? stats.notifications.map((notif, i) => (
              <div key={i} className="notification-item">
                <div className={`notif-dot-wrap ${notif.type}`}>
                  <span
                    className="status-dot"
                    style={notif.type === 'info' ? {backgroundColor: '#3b82f6'} : undefined}
                  />
                </div>
                <div className="notif-content">
                  <p className="notif-text">{notif.text}</p>
                </div>
                <span className={`notif-label ${notif.type}`}>{notif.label}</span>
              </div>
            )) : (
              <p className="chart-subtitle" style={{ textAlign: 'center', padding: '16px 0' }}>
                Tidak ada notifikasi aktif
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-bold text-muted mb-3 uppercase">Fitness Highlights</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-success" />
                <div>
                  <p className="text-xs font-medium">Total Workout Hari Ini</p>
                  <p className="text-sm font-bold">{stats.todayWorkouts} sesi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flame size={16} style={{color: '#f97316'}} />
                <div>
                  <p className="text-xs font-medium">Kalori Terbakar (7 hari)</p>
                  <p className="text-sm font-bold">{formatCalories(stats.weeklyCaloriesBurned)} kcal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target size={16} style={{color: '#8b5cf6'}} />
                <div>
                  <p className="text-xs font-medium">User Aktif Latihan</p>
                  <p className="text-sm font-bold">
                    {stats.userFitnessOverview.filter(u => u.status === 'On Track').length} user
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid-stats mt-6">
        <StatCard
          title="User Baru Bulan Ini" value={stats.newUsersThisMonth.toString()}
          subtitle={stats.totalUsers > 0 ? `${Math.round(stats.newUsersThisMonth / stats.totalUsers * 100)}% dari total` : '0%'}
          icon={<UserPlus size={20} />} iconBgColor="#dcfce7" iconColor="#22c55e"
        />
        <StatCard
          title="Avg BMI Platform"
          value={stats.avgBmi > 0 ? <>{stats.avgBmi} <span className="text-sm font-normal" style={{color:'var(--color-text-muted)'}}>kg/m²</span></> : '-'}
          subtitle={getBmiLabel(stats.avgBmi)} subtitleColor="info"
          icon={<Scale size={20} />} iconBgColor="#e0e7ff" iconColor="#3b82f6"
        />
        <StatCard
          title="Total Kalori Terbakar"
          value={<>{formatCalories(stats.weeklyCaloriesBurned)} <span className="text-sm font-normal" style={{color:'var(--color-text-muted)'}}>kcal</span></>}
          subtitle="Minggu ini" subtitleColor="warning"
          icon={<Flame size={20} />} iconBgColor="#ffedd5" iconColor="#f97316"
        />
        <StatCard
          title="Makanan Tersedia" value={stats.totalFoods.toLocaleString('id-ID')}
          subtitle="Resep di database" subtitleColor="danger"
          icon={<RefreshCcw size={20} />} iconBgColor="#fae8ff" iconColor="#d946ef"
        />
      </div>
    </div>
  );
};

export default Overview;
