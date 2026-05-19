import React from 'react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  subtitleColor?: 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor = 'success',
  icon,
  iconBgColor = '#e5e7eb',
  iconColor = '#6b7280'
}) => {
  return (
    <div className="card stat-card">
      <div className="stat-icon-wrapper" style={{ backgroundColor: iconBgColor, color: iconColor }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && (
          <p className={`stat-subtitle text-${subtitleColor}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
