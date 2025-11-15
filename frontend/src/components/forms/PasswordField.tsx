// [UI] animated eye
'use client';

import React, { useState, useRef } from 'react';

interface PasswordFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id = 'password',
  name = 'password',
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [pupilOffset, setPupilOffset] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      // Map mouse position to normalized range [-1, 1]
      const normalized = ((x / width) - 0.5) * 2;
      // Clamp and multiply by pixel offset (4px max)
      const offset = Math.max(-1, Math.min(1, normalized)) * 4;
      setPupilOffset(offset);
    }
  };

  const handleMouseLeave = () => {
    setPupilOffset(0);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-300">
        {label}
      </label>
      
      <div 
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        <input
          type={visible ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400"
        />
        
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {/* [UI] pupil follows mouse */}
          <div className="relative h-4 w-6">
            {/* Eye outline */}
            <div className="absolute inset-0 rounded-full border border-slate-600 bg-slate-50 dark:bg-slate-100" />
            
            {/* Slash for closed eye */}
            {!visible && (
              <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 bg-slate-700 dark:bg-slate-900" />
            )}
            
            {/* Pupil */}
            <div 
              className="absolute top-1/2 left-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-800 dark:bg-slate-900 transition-transform duration-150"
              style={{ 
                transform: `translate(calc(-50% + ${pupilOffset}px), -50%)` 
              }}
            />
            
            {/* Pupil highlight */}
            <div 
              className="absolute top-1/2 left-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white opacity-70"
              style={{ 
                transform: `translate(calc(-50% + ${pupilOffset * 0.8}px), calc(-50% - 1px))` 
              }}
            />
          </div>
        </button>
      </div>
      
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Click the eye to show or hide your password.
      </p>
    </div>
  );
};

export default PasswordField;