import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  type = 'text',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded bg-gray-700 text-white p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent"
      />
    </div>
  );
};