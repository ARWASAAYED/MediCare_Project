import React from "react";

const InputWithIcon = ({
  Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  minLength,
}) => {
  return (
    <div className="relative">
      {Icon ? (
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      ) : null}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
      />
    </div>
  );
};

export default InputWithIcon;
