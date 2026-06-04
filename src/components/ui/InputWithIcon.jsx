import React from "react";

const InputWithIcon = ({
  Icon,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required,
  minLength,
  autoComplete,
  error,
}) => {
  const borderClass = "border-gray-300 focus:ring-brand-red";

  return (
    <div className="relative">
      {Icon ? (
        <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      ) : null}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${borderClass}`}
      />
    </div>
  );
};

export default InputWithIcon;
