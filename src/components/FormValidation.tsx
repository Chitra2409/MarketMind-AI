import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  rules?: ValidationRule[];
  placeholder?: string;
  required?: boolean;
}

export function FormField({ label, type, value, onChange, rules = [], placeholder, required = false }: FormFieldProps) {
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const errors = rules.filter(rule => !rule.test(value)).map(rule => rule.message);
  const isValid = errors.length === 0 && (!required || value.trim() !== '');
  const hasErrors = isTouched && errors.length > 0;
  const isEmpty = required && isTouched && value.trim() === '';

  const handleBlur = () => {
    setIsTouched(true);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={4}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              hasErrors || isEmpty
                ? 'border-red-300 dark:border-red-600'
                : isValid && isTouched
                ? 'border-green-300 dark:border-green-600'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
        ) : (
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
              hasErrors || isEmpty
                ? 'border-red-300 dark:border-red-600'
                : isValid && isTouched
                ? 'border-green-300 dark:border-green-600'
                : 'border-gray-300 dark:border-gray-600'
            } ${type === 'password' ? 'pr-12' : ''}`}
          />
        )}
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {isTouched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {isEmpty && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {label} is required
        </p>
      )}
      
      {hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}
      
      {isValid && isTouched && !isEmpty && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Looks good!
        </p>
      )}
    </div>
  );
}

// Common validation rules
export const validationRules = {
  email: {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  minLength: (length: number) => ({
    test: (value: string) => value.length >= length,
    message: `Must be at least ${length} characters long`
  }),
  maxLength: (length: number) => ({
    test: (value: string) => value.length <= length,
    message: `Must be no more than ${length} characters long`
  }),
  hasUppercase: {
    test: (value: string) => /[A-Z]/.test(value),
    message: 'Must contain at least one uppercase letter'
  },
  hasLowercase: {
    test: (value: string) => /[a-z]/.test(value),
    message: 'Must contain at least one lowercase letter'
  },
  hasNumber: {
    test: (value: string) => /\d/.test(value),
    message: 'Must contain at least one number'
  },
  hasSpecialChar: {
    test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
    message: 'Must contain at least one special character'
  },
  noSpaces: {
    test: (value: string) => !/\s/.test(value),
    message: 'Cannot contain spaces'
  }
};