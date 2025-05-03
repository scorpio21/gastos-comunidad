import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  fullWidth = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  icon,
  ...props
}) => {
  const width = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500';
  
  return (
    <div className={`${width} ${className}`}>
      {label && (
        <label htmlFor={props.id} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`block px-3 py-2 bg-white border ${errorClass} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm ${width} ${inputClassName} ${icon ? 'pl-10' : ''}`}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;