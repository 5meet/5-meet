import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export const Label = ({
  required = false,
  children,
  className = '',
  ...props
}: LabelProps) => {
  return (
    <label
      className={`
        inline-flex items-center gap-1
        text-sm text-gray-800
        select-none cursor-pointer
        ${className}
      `}
      {...props}
    >
      <span>{children}</span>
      {required && (
        <span className="text-primary-500 font-bold leading-none" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

Label.displayName = 'Label';
export default Label;