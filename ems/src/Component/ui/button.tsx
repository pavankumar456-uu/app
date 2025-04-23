import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
    const baseStyles = 'px-4 py-2 rounded font-medium focus:outline-none';
    const variantStyles =
        variant === 'primary'
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-500 text-white hover:bg-gray-600';

    return (
        <button className={`${baseStyles} ${variantStyles}`} {...props}>
            {children}
        </button>
    );
};