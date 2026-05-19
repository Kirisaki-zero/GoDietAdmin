import { useState } from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import './Reports.css';

const reportsData = [
  { id: '994', name: 'Wade Warren', avatar: 'avatar-sw', type: 'Quality & Compliance', status: 'Submitted', updated: '10/28/12', created: '8/21/15' },
  { id: '556', name: 'Aremu Femi', avatar: 'avatar-ap', type: 'Inventory', status: 'Revised', updated: '9/4/12', created: '11/7/16' },
  { id: '154', name: 'Cody Fisher', avatar: 'avatar-dl', type: 'Financial', status: 'Submitted', updated: '9/4/12', created: '4/4/18' },
  { id: '274', name: 'Eleanor Pena', avatar: 'avatar-bs', type: 'Patient', status: 'Submitted', updated: '8/16/13', created: '5/30/14' },
  { id: '536', name: 'Bessie Cooper', avatar: 'avatar-rk', type: 'Quality & Compliance', status: 'Revised', updated: '10/6/13', created: '7/18/17' },
  { id: '556', name: 'Kristin Watson', avatar: 'avatar-fh', type: 'Appointment', status: 'Revised', updated: '5/19/12', created: '7/27/13' },
  { id: '826', name: 'Aremu Femi', avatar: 'avatar-ap', type: 'Patient', status: 'Submitted', updated: '4/21/12', created: '9/23/16' },
  { id: '185', name: 'Jane Cooper', avatar: 'avatar-ms', type: 'Staff', status: 'Revised', updated: '2/11/12', created: '6/21/19' },
  { id: '556', name: 'Kristin Watson', avatar: 'avatar-fh', type: 'Appointment', status: 'Revised', updated: '2/11/12', created: '12/4/17' },
  { id: '536', name: 'Albert Flores', avatar: 'avatar-dl', type: 'Financial', status: 'Submitted', updated: '7/27/13', created: '3/4/16' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('All Reports');
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="reports-page fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title mb-0">Laporan</h1>
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'All Reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('All Reports')}
          >
            All Reports <span className="tab-count">(12)</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Recycle Bin' ? 'active' : ''}`}
            onClick={() => setActiveTab('Recycle Bin')}
          >
            Recycle Bin <span className="tab-count">(12)</span>
          </button>
        </div>
        <button className="add-btn">
          Add <Plus size={16} />
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="filters-row px-6 py-4 border-b border-gray-100 flex gap-6">
          {['All', 'Patient Services', 'Diagnostic Services', 'Pharmacy Services'].map(filter => (
            <button 
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="px-6 py-2">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width: '60px'}}>NO <span className="text-muted text-xs">▼</span></th>
                <th>FULL-NAME</th>
                <th>RECORD TYPE</th>
                <th>STATUS</th>
                <th>DATE UPDATED</th>
                <th>DATE CREATED</th>
                <th style={{width: '40px'}}></th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map((row, idx) => (
                <tr key={`${row.id}-${idx}`}>
                  <td className="font-bold">{row.id}</td>
                  <td>
                    <div className="user-info">
                      <div className={`avatar ${row.avatar}`}>{row.name.substring(0, 2).toUpperCase()}</div>
                      <span className="font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.status}</td>
                  <td>{row.updated}</td>
                  <td>{row.created}</td>
                  <td className="text-muted cursor-pointer"><MoreHorizontal size={20} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
