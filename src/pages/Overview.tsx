import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Target, UserPlus, Scale, Flame, RefreshCcw } from 'lucide-react';
import StatCard from '../components/StatCard';
import './Overview.css';

const growthData = [
  { name: 'Jan', users: 800 },
  { name: 'Feb', users: 950 },
  { name: 'Mar', users: 1100 },
  { name: 'Apr', users: 1250 },
  { name: 'May', users: 1400 },
  { name: 'Jun', users: 1600 },
  { name: 'Jul', users: 1840 },
];

const weeklyData = [
  { name: 'Sen', sessions: 420 },
  { name: 'Sel', sessions: 510 },
  { name: 'Rab', sessions: 470 },
  { name: 'Kam', sessions: 560 },
  { name: 'Jum', sessions: 490 },
  { name: 'Sab', sessions: 620 },
  { name: 'Min', sessions: 380 },
];

const programData = [
  { name: 'Fat Loss', value: 42, color: '#22c55e' },
  { name: 'Muscle Gain', value: 28, color: '#3b82f6' },
  { name: 'Maintenance', value: 18, color: '#f59e0b' },
  { name: 'Health', value: 12, color: '#8b5cf6' },
];

const complianceData = [
  { name: 'W1', rate: 72 },
  { name: 'W2', rate: 76 },
  { name: 'W3', rate: 74 },
  { name: 'W4', rate: 82 },
  { name: 'W5', rate: 79 },
  { name: 'W6', rate: 85 },
  { name: 'W7', rate: 87 },
];

const allPerformers = [
    { id: '#1', name: 'Sarah Wijaya', initials: 'SW', program: 'Fat Loss', streak: '21d', compliance: 92, avatarClass: 'avatar-sw', status: 'On Track' },
    { id: '#2', name: 'Andi Pratama', initials: 'AP', program: 'Muscle Gain', streak: '14d', compliance: 88, avatarClass: 'avatar-ap', status: 'On Track' },
    { id: '#3', name: 'Dewi Lestari', initials: 'DL', program: 'Fat Loss', streak: '5d', compliance: 75, avatarClass: 'avatar-dl', status: 'Perlu Perhatian' },
    { id: '#4', name: 'Budi Santoso', initials: 'BS', program: 'Maintenance', streak: '2d', compliance: 55, avatarClass: 'avatar-bs', status: 'Tidak Aktif' },
    { id: '#5', name: 'Rina Kusuma', initials: 'RK', program: 'Health', streak: '12d', compliance: 79, avatarClass: 'avatar-rk', status: 'Perlu Perhatian' },
    { id: '#6', name: 'Eko Prasetyo', initials: 'EP', program: 'Muscle Gain', streak: '30d', compliance: 95, avatarClass: 'avatar-ep', status: 'On Track' },
    { id: '#7', name: 'Siti Aminah', initials: 'SA', program: 'Fat Loss', streak: '1d', compliance: 40, avatarClass: 'avatar-sa', status: 'Tidak Aktif' },
  ];

const Overview = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filteredPerformers = allPerformers.filter(p => {
    if (activeFilter === 'Semua') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="overview-page fade-in">
      <h1 className="page-title">Dashboard Admin</h1>

      {/* Top Stats */}
      <div className="grid-stats">
        <StatCard 
          title="Total Users" value="1,840" subtitle="↗ +220" 
          icon={<Users size={20} />} iconBgColor="#dcfce7" iconColor="#22c55e" 
        />
        <StatCard 
          title="User Aktif" value="1,245" subtitle="67.7%" subtitleColor="info"
          icon={<UserPlus size={20} />} iconBgColor="#e0e7ff" iconColor="#3b82f6" 
        />
        <StatCard 
          title="Workout Hari Ini" value="384" subtitle="↗ +12%" subtitleColor="warning"
          icon={<Activity size={20} />} iconBgColor="#fae8ff" iconColor="#d946ef" 
        />
        <StatCard 
          title="Avg Compliance" value="87%" subtitle="↗ +5%" subtitleColor="danger"
          icon={<Target size={20} />} iconBgColor="#ffedd5" iconColor="#f97316" 
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
            <div className="badge badge-success">↗ +124%</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
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
          </div>
        </div>

        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">User Aktif Mingguan</h3>
              <p className="chart-subtitle">Workout sessions per hari</p>
            </div>
            <div className="badge badge-success">Avg 493</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
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
              <p className="chart-subtitle">Berdasarkan program yang diikuti</p>
            </div>
            <div className="badge badge-info">Total 1,840</div>
          </div>
          <div className="flex w-full items-center">
            <div className="pie-container relative" style={{width: '40%', height: '200px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
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
                  <div className="text-sm font-bold">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Tingkat Kepatuhan Fitness</h3>
              <p className="chart-subtitle">Rata-rata compliance user</p>
            </div>
            <div className="badge badge-info" style={{backgroundColor: '#e0e7ff', color: '#3b82f6'}}>↗ +15%</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceData}>
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
          </div>
        </div>
      </div>

      {/* Performers and Notifications */}
      <div className="grid-2-1 mt-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Pantauan Kebugaran User</h3>
            <div className="filter-tabs flex items-center gap-2 p-1 bg-gray-100 rounded-full">
                {['Semua', 'On Track', 'Perlu Perhatian', 'Tidak Aktif'].map(filter => (
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
            {filteredPerformers.map(p => (
              <div key={p.id} className="performer-item flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-muted text-sm font-medium w-6">{p.id}</span>
                  <div className={`avatar ${p.avatarClass}`}>{p.initials}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{p.name}</h4>
                    <p className="text-xs text-muted">{p.program}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1 text-warning font-semibold text-sm">
                    <Flame size={14} /> {p.streak}
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={`font-semibold ${p.status === 'On Track' ? 'text-success' : p.status === 'Perlu Perhatian' ? 'text-warning' : 'text-danger'}`}>{p.compliance}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className={`progress-bar ${p.status === 'On Track' ? 'bg-success' : p.status === 'Perlu Perhatian' ? 'bg-warning' : 'bg-danger'}`} style={{width: `${p.compliance}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-4">Notifikasi Terbaru</h3>
          <div className="notifications-list flex flex-col gap-4">
            <div className="notification-item flex gap-3">
              <div className="mt-1"><span className="status-dot warning"></span></div>
              <div>
                <p className="text-sm font-medium">5 user belum workout 3+ hari</p>
                <p className="text-xs text-muted">2 jam lalu</p>
              </div>
            </div>
            <div className="notification-item flex gap-3">
              <div className="mt-1"><span className="status-dot success"></span></div>
              <div>
                <p className="text-sm font-medium">12 user mencapai target minggu ini</p>
                <p className="text-xs text-muted">5 jam lalu</p>
              </div>
            </div>
            <div className="notification-item flex gap-3">
              <div className="mt-1"><span className="status-dot" style={{backgroundColor: '#3b82f6'}}></span></div>
              <div>
                <p className="text-sm font-medium">28 user baru bergabung minggu ini</p>
                <p className="text-xs text-muted">1 hari lalu</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-bold text-muted mb-3 uppercase">Fitness Highlights</h4>
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3">
                  <Activity size={16} className="text-success" />
                  <div>
                    <p className="text-xs font-medium">Total Workout Hari Ini</p>
                    <p className="text-sm font-bold">384 sessions</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Activity size={16} className="text-danger" />
                  <div>
                    <p className="text-xs font-medium">Avg Heart Rate User</p>
                    <p className="text-sm font-bold">74 bpm</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Target size={16} className="text-purple-500" style={{color: '#8b5cf6'}} />
                  <div>
                    <p className="text-xs font-medium">Target Achieved</p>
                    <p className="text-sm font-bold">68 user</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid-stats mt-6">
        <StatCard 
          title="User Baru Bulan Ini" value="220" subtitle="+13.6%" 
          icon={<UserPlus size={20} />} iconBgColor="#dcfce7" iconColor="#22c55e" 
        />
        <StatCard 
          title="Avg BMI Platform" value={<>23.4 <span className="text-sm font-normal text-muted">kg/m²</span></>} subtitle="Normal" subtitleColor="info"
          icon={<Scale size={20} />} iconBgColor="#e0e7ff" iconColor="#3b82f6" 
        />
        <StatCard 
          title="Total Kalori Terbakar" value={<>2.1M <span className="text-sm font-normal text-muted">kcal</span></>} subtitle="Minggu ini" subtitleColor="warning"
          icon={<Flame size={20} />} iconBgColor="#ffedd5" iconColor="#f97316" 
        />
        <StatCard 
          title="Retention Rate" value="89%" subtitle="+3% vs bulan lalu" subtitleColor="danger"
          icon={<RefreshCcw size={20} />} iconBgColor="#fae8ff" iconColor="#d946ef" 
        />
      </div>

    </div>
  );
};

export default Overview;
