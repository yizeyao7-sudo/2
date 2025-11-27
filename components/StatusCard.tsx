import React from 'react';

interface StatusCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  active?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, icon, active = false }) => {
  return (
    <div 
      className={`flex flex-col items-start p-4 rounded-2xl border transition-colors ${active ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}
    >
      <div className={`mb-3 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
        <div className="text-xl font-extrabold text-gray-900">{value}</div>
      </div>
    </div>
  );
};

export default StatusCard;