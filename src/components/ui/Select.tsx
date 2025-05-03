import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  error,
  fullWidth = false,
  className = '',
  selectClassName = '',
  labelClassName = '',
  onChange,
  ...props
}) => {
  const width = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500';
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className={`${width} ${className}`}>
      {label && (
        <label htmlFor={props.id} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <select
        className={`block w-full px-3 py-2 bg-white border ${errorClass} rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${width} ${selectClassName}`}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;