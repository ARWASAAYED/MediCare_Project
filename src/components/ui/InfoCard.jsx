import React from "react";

const InfoCard = ({ Icon, label, value, children }) => {
  const content = children || (
    <p className="text-gray-800 font-medium">{value}</p>
  );
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        {Icon ? <Icon className="w-5 h-5 text-brand-red" /> : null}
        <div className="flex-1">
          <p className="text-xs text-gray-600 font-semibold">{label}</p>
          {content}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
