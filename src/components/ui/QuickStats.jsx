import React from "react";

const QuickStats = ({ stats = [] }) => {
  const cols = stats.length <= 2 ? `grid-cols-${stats.length}` : "grid-cols-3";
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
      <div className={`grid ${cols} gap-4`}>
        {stats.map((s, idx) => (
          <div key={idx} className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-brand-red">{s.value}</p>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
