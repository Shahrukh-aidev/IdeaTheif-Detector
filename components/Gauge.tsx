
import React from 'react';

interface GaugeProps {
  value: number;
  size?: number;
}

const Gauge: React.FC<GaugeProps> = ({ value, size = 180 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const getColor = (v: number) => {
    if (v < 30) return '#ef4444'; // Red
    if (v < 70) return '#f59e0b'; // Amber
    return '#22c55e'; // Green
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{Math.round(value)}</span>
        <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">Unique</span>
      </div>
    </div>
  );
};

export default Gauge;
