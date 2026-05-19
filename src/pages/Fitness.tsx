import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Target, Activity, Zap, Search, Flame } from 'lucide-react';
import StatCard from '../components/StatCard';
import './Fitness.css';

const weeklySessionsData = [
  { name: 'Sen', sessions: 320 },
  { name: 'Sel', sessions: 410 },
  { name: 'Rab', sessions: 380 },
  { name: 'Kam', sessions: 450 },
  { name: 'Jum', sessions: 390 },
  { name: 'Sab', sessions: 520 },
  { name: 'Min', sessions: 280 },
];

const complianceTrendData = [
  { name: 'W1', rate: 72 },
  { name: 'W2', rate: 75 },
  { name: 'W3', rate: 73 },
  { name: 'W4', rate: 79 },
  { name: 'W5', rate: 82 },
  { name: 'W6', rate: 85 },
  { name: 'W7', rate: 87 },
];

const fitnessUsersData = [
  { id: 'SW', name: 'Sarah Wijaya', weightChange: '62kg → 58kg', program: 'Fat Loss', bmi: 22.1, compliance: 94, streak: 21, status: 'OK', lastWorkout: 'Hari ini', avatarClass: 'avatar-sw' },
  { id: 'AP', name: 'Andi Pratama', weightChange: '78kg → 82kg', program: 'Muscle Gain', bmi: 24.5, compliance: 88, streak: 14, status: 'OK', lastWorkout: 'Hari ini', avatarClass: 'avatar-ap' },
  { id: 'DL', name: 'Dewi Lestari', weightChange: '72kg → 65kg', program: 'Fat Loss', bmi: 26.3, compliance: 85, streak: 18, status: 'OK', lastWorkout: 'Kemarin', avatarClass: 'avatar-dl' },
  { id: 'BS', name: 'Budi Santoso', weightChange: '75kg → 74kg', program: 'Maintenance', bmi: 23.8, compliance: 62, streak: 3, status: 'Warn', lastWorkout: '3 hari lalu', avatarClass: 'avatar-bs' },
  { id: 'RK', name: 'Rina Kusuma', weightChange: '56kg → 55kg', program: 'Health', bmi: 21.5, compliance: 79, streak: 12, status: 'OK', lastWorkout: 'Kemarin', avatarClass: 'avatar-rk' },
  { id: 'FH', name: 'Fajar Hidayat', weightChange: '88kg → 78kg', program: 'Fat Loss', bmi: 28.1, compliance: 45, streak: 0, status: 'Off', lastWorkout: '5 hari lalu', avatarClass: 'avatar-fh' },
  { id: 'MS', name: 'Maya Sari', weightChange: '60kg → 63kg', program: 'Muscle Gain', bmi: 22.9, compliance: 55, streak: 1, status: 'Warn', lastWorkout: '2 hari lalu', avatarClass: 'avatar-ms' },
  { id: 'RA', name: 'Riko Aditya', weightChange: '85kg → 75kg', program: 'Fat Loss', bmi: 27.5, compliance: 38, streak: 0, status: 'Off', lastWorkout: '7 hari lalu', avatarClass: 'avatar-ra' },
  { id: 'SN', name: 'Siti Nurhaliza', weightChange: '58kg → 57kg', program: 'Maintenance', bmi: 22.0, compliance: 91, streak: 16, status: 'OK', lastWorkout: 'Hari ini', avatarClass: 'avatar-sn' },
  { id: 'DP', name: 'Dimas Prasetyo', weightChange: '82kg → 85kg', program: 'Muscle Gain', bmi: 25.2, compliance: 72, streak: 5, status: 'Warn', lastWorkout: 'Kemarin', avatarClass: 'avatar-dp' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'OK': return <span className="status-badge status-ok"><span className="status-dot success"></span> OK</span>;
    case 'Warn': return <span className="status-badge status-warn"><span className="status-dot warning"></span> Warn</span>;
    case 'Off': return <span className="status-badge status-off"><span className="status-dot danger"></span> Off</span>;
    default: return null;
  }
};

const getComplianceColor = (val: number) => {
  if (val >= 80) return 'var(--color-success)';
  if (val >= 50) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

const getBmiColor = (bmi: number) => {
  if (bmi < 18.5) return 'var(--color-warning)';
  if (bmi >= 18.5 && bmi < 25) return 'var(--color-success)';
  return 'var(--color-danger)';
};

const Fitness = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');

  return (
    <div className="fitness-page fade-in">
      <h1 className="page-title">Kebugaran</h1>

      {/* Top Stats */}
      <div className="grid-stats">
        <StatCard 
          title="Total User Fitness" value="10" subtitle="Aktif" subtitleColor="success"
          icon={<Users size={20} />} iconBgColor="#dcfce7" iconColor="#22c55e" 
        />
        <StatCard 
          title="On Track" value="5" subtitle="50%" subtitleColor="success"
          icon={<Target size={20} />} iconBgColor="#e0e7ff" iconColor="#3b82f6" 
        />
        <StatCard 
          title="Perlu Perhatian" value="3" subtitle="Follow up" subtitleColor="warning"
          icon={<Activity size={20} />} iconBgColor="#ffedd5" iconColor="#f97316" 
        />
        <StatCard 
          title="Avg Compliance" value="71%" subtitle="↗ +5% vs minggu lalu" subtitleColor="info"
          icon={<Zap size={20} />} iconBgColor="#fae8ff" iconColor="#d946ef" 
        />
      </div>

      {/* Charts */}
      <div className="grid-charts mt-6">
        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Workout Sessions Mingguan</h3>
              <p className="chart-subtitle">Total sessions per hari</p>
            </div>
            <div className="badge badge-success bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">↗ +18%</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="sessions" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="chart-title">Compliance Rate Trend</h3>
              <p className="chart-subtitle">Rata-rata kepatuhan user</p>
            </div>
            <div className="badge badge-info bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">↗ 71%</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrendData}>
                <defs>
                  <linearGradient id="colorComplianceTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `${val}%`} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorComplianceTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card mt-6 p-0 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
            {['Semua', 'On Track', 'Perlu Perhatian', 'Tidak Aktif'].map(filter => (
              <button 
                key={filter}
                className={`table-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter} {filter === 'Perlu Perhatian' && <span className="filter-count warning">3</span>}
                {filter === 'Tidak Aktif' && <span className="filter-count danger">2</span>}
              </button>
            ))}
          </div>
          <div className="search-box-small">
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Cari user atau program..." />
          </div>
        </div>

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
              {fitnessUsersData.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className={`avatar ${user.avatarClass}`}>{user.id}</div>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-xs text-muted font-medium flex items-center gap-1">{user.weightChange}</span>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-sm">{user.program}</td>
                  <td className="font-bold text-sm" style={{color: getBmiColor(user.bmi)}}>{user.bmi}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="progress-bar-container" style={{width: '60px', marginTop: 0}}>
                        <div className="progress-bar" style={{width: `${user.compliance}%`, backgroundColor: getComplianceColor(user.compliance)}}></div>
                      </div>
                      <span className="font-bold text-sm">{user.compliance}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 font-semibold text-sm" style={{color: user.streak > 0 ? '#f97316' : '#9ca3af'}}>
                      <Flame size={14} /> {user.streak}d
                    </div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td className="text-sm font-medium text-muted">{user.lastWorkout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Fitness;
